import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { getToken } from 'services/tokenService';
import { addNotification } from './notificationsSlice';

export const getVolunteers = createAsyncThunk('volunteers/getVolunteers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/volunteers');

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Getting volunteers data failed');
  }
});

export const createVolunteer = createAsyncThunk(
  'volunteers/createVolunteer',
  async (volunteerData, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.post('/volunteers', volunteerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Created',
            text: 'Volunteer created successfully',
            type: 'success',
          })
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Creating volunteer failed');
    }
  }
);

export const deleteVolunteers = createAsyncThunk(
  'volunteers/deleteVolunteers',
  async (volunteerIds, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.delete('/volunteers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: volunteerIds },
      });

      return response.data?.deletedIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Deleting volunteers failed');
    }
  }
);

const volunteersSlice = createSlice({
  name: 'volunteers',
  initialState: {
    volunteers: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVolunteers.fulfilled, (state, action) => {
        state.volunteers = action.payload;
      })
      .addCase(getVolunteers.rejected, (state, action) => {
        state.error = action.payload || 'Error getting volunteers';
      })
      .addCase(createVolunteer.fulfilled, (state, action) => {
        state.volunteers = [...state.volunteers, action.payload];
      })
      .addCase(createVolunteer.rejected, (state, action) => {
        state.error = action.payload || 'Error creating volunteer';
      })
      .addCase(deleteVolunteers.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.filter((org) => !action.payload.includes(org.id));
      })
      .addCase(deleteVolunteers.rejected, (state, action) => {
        state.error = action.payload || 'Error deleting volunteers';
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

export default volunteersSlice.reducer;
