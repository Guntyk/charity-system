import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from '@redux/features/notificationsSlice';
import organizationsReducer from '@redux/features/organizationsSlice';
import usersReducer from '@redux/features/usersSlice';
import authReducer from '@redux/features/authSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    organizations: organizationsReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
