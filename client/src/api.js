import axios from 'axios';
import { refreshAuthToken, logoutUser } from '@redux/features/authSlice';
import { getRefreshToken } from 'services/tokenService';
import { store } from '@redux/store';

export const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        store.dispatch(logoutUser());
        return Promise.reject(error);
      }

      try {
        await store.dispatch(refreshAuthToken());
        const newToken = store.getState().auth.token;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
