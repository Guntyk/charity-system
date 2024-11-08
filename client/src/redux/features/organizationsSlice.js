import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { getToken } from 'services/tokenService';

export const getOrganizations = createAsyncThunk('organizations/getOrganizations', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/organizations');

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Getting organizations data failed');
  }
});

export const createOrganization = createAsyncThunk(
  'organizations/createOrganization',
  async (organizationData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.post('/organizations', organizationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Creating organization failed');
    }
  }
);

export const deleteOrganizations = createAsyncThunk(
  'organizations/deleteOrganizations',
  async (organizationIds, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.delete('/organizations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: organizationIds },
      });

      return response.data?.deletedIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Deleting organizations failed');
    }
  }
);

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: {
    organizations: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizations.fulfilled, (state, action) => {
        state.organizations = action.payload;
      })
      .addCase(getOrganizations.rejected, (state, action) => {
        state.error = action.payload || 'Error getting organizations';
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.organizations = [action.payload, ...state.organizations];
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.error = action.payload || 'Error creating organization';
      })
      .addCase(deleteOrganizations.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter((org) => !action.payload.includes(org.id));
      })
      .addCase(deleteOrganizations.rejected, (state, action) => {
        state.error = action.payload || 'Error deleting organizations';
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

export default organizationsSlice.reducer;
