import ApiService from './ApiService';

export const loginUser = async (email, password, tipo_usuario = 'paciente') => {
  return await ApiService.loginUser(email, password, tipo_usuario);
};

export const logoutUser = async () => {
  return await ApiService.logoutUser();
};

export const getStoredUser = async () => {
  return await ApiService.getStoredUser();
};

export const isLoggedIn = async () => {
  return await ApiService.isLoggedIn();
};