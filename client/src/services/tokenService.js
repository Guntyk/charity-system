import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_DAYS = 7;

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: TOKEN_EXPIRY_DAYS });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const refreshExpiry = () => {
  const token = getToken();
  if (token) {
    setToken(token);
  }
};
