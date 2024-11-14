import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { getToken } from 'services/tokenService';
import { addNotification } from './notificationsSlice';

export const getProjects = createAsyncThunk('projects/getProjects', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/projects');

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Getting projects data failed');
  }
});

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.post('/projects', projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        dispatch(
          addNotification({
            id: Date.now(),
            title: 'Created',
            text: 'Project created successfully',
            type: 'success',
          })
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Creating project failed');
    }
  }
);

export const deleteProjects = createAsyncThunk('projects/deleteProjects', async (projectIds, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await api.delete('/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ids: projectIds },
    });

    return response.data?.deletedIds;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Deleting projects failed');
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.error = action.payload || 'Error getting projects';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects = [action.payload, ...state.projects];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload || 'Error creating project';
      })
      .addCase(deleteProjects.fulfilled, (state, action) => {
        state.projects = state.projects.filter((org) => !action.payload.includes(org.id));
      })
      .addCase(deleteProjects.rejected, (state, action) => {
        state.error = action.payload || 'Error deleting projects';
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

export default projectsSlice.reducer;
