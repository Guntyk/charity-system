import Cookies from 'js-cookie';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 / 24 });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7 });
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeTokens = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
