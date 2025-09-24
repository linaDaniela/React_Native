// Configuración específica para móvil
import { Platform } from 'react-native';

export const MOBILE_CONFIG = {
  // URLs de API
  API_BASE_URL: Platform.OS === 'web' 
    ? 'http://localhost:8000/api' 
    : 'http://172.20.10.8:8000/api',
  
  // Configuración de almacenamiento
  STORAGE_TYPE: Platform.OS === 'web' ? 'localStorage' : 'AsyncStorage',
  
  // Configuración de debug
  DEBUG_MODE: __DEV__,
  
  // Configuración de red
  NETWORK_TIMEOUT: 10000, // 10 segundos
  
  // Configuración de autenticación
  TOKEN_KEY: 'userToken',
  USER_DATA_KEY: 'userData',
  
  // Configuración de demo
  DEMO_CREDENTIALS: [
    { 
      email: "medico@eps.com", 
      password: "medico123", 
      role: "medico", 
      name: "Dr. Carlos Rodríguez" 
    },
    { 
      email: "paciente@eps.com", 
      password: "paciente123", 
      role: "paciente", 
      name: "Juan Pérez" 
    }
  ],
  
  // Configuración de errores
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    AUTH_ERROR: 'Error de autenticación. Verifica tus credenciales.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    UNKNOWN_ERROR: 'Error desconocido. Intenta nuevamente.'
  }
};

export default MOBILE_CONFIG;
