import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from 'services/tokenService';

const API_URL = process.env.REACT_APP_SERVER_API_URL;

export const getUsers = createAsyncThunk('users/getUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/users`);

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Getting users data failed');
  }
});

export const updateUserRoles = createAsyncThunk('users/updateUserRoles', async (changedRoles, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/users/roles`, changedRoles, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Updating user roles failed');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.error = action.payload || 'Error';
      })
      .addCase(updateUserRoles.fulfilled, (state, action) => {
        const updatedUsers = action.payload?.data || [];

        updatedUsers.forEach((updatedUser) => {
          const index = state.users.findIndex((user) => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        });

        state.error = null;
      })
      .addCase(updateUserRoles.rejected, (state, action) => {
        state.error = action.payload || 'Error';
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
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

export default usersSlice.reducer;
