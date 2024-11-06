import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setToken, getToken, removeToken, refreshExpiry } from 'services/tokenService';

const API_URL = process.env.REACT_APP_SERVER_API_URL;

export const registerUser = createAsyncThunk('users/registerUser', async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    await dispatch(loginUser({ email: userData.email, password: userData.password }));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    setToken(response.data.token);
    return response.data.token;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    error: null,
    isLoading: false,
    token: getToken(),
    isAuthenticated: !!getToken(),
  },
  reducers: {
    logoutUser: (state) => {
      removeToken();
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.error = null;
      })
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

refreshExpiry();
