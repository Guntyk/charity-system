import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from '@redux/features/notificationsSlice';
import usersReducer from '@redux/features/usersSlice';
import authReducer from '@redux/features/authSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
