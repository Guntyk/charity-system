import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { setToken, getToken, setRefreshToken, getRefreshToken, removeTokens } from 'services/tokenService';
import { addNotification } from './notificationsSlice';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    await dispatch(loginUser({ email: userData.email, password: userData.password }));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    setToken(response.data.token);
    setRefreshToken(response.data.refreshToken);

    if (response.data.token) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: 'Success',
          text: 'Successful login',
          type: 'success',
        })
      );
    }

    return response.data.token;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

export const refreshAuthToken = createAsyncThunk('auth/refreshAuthToken', async (_, { dispatch, rejectWithValue }) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    dispatch(logoutUser());
    return rejectWithValue('No refresh token available');
  }

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    setToken(response.data.token);
    return response.data.token;
  } catch (error) {
    dispatch(logoutUser());
    return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    isLoading: false,
    token: getToken(),
    isAuthenticated: !!getRefreshToken(),
  },
  reducers: {
    logoutUser: (state) => {
      removeTokens();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || 'Login failed';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user';
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.error = action.payload || 'Token refresh failed';
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.error = null;
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
