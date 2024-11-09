import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from '@redux/features/notificationsSlice';
import organizationsReducer from '@redux/features/organizationsSlice';
import projectsReducer from '@redux/features/projectsSlice';
import usersReducer from '@redux/features/usersSlice';
import authReducer from '@redux/features/authSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    organizations: organizationsReducer,
    projects: projectsReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
