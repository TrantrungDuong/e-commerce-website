// common/services/localStorageService.js

export const KEY_TOKEN = "accessToken"; // Key cho Access Token

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

export const clearAllAuthData = () => {
  removeToken();
  localStorage.removeItem('role');
};