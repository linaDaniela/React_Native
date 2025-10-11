import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/apiConfig';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        console.log('Token expirado, datos de autenticación eliminados');
      } catch (storageError) {
        console.error('Error al limpiar datos de autenticación:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

