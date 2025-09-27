import { Platform } from 'react-native';

const config = {
  // URL de API basada en tu configuración
  API_BASE_URL: 'http://10.2.232.243:8000/api',
  
  // Configuración de autenticación
  AUTH_CONFIG: {
    TOKEN_KEY: 'userToken',
    USER_KEY: 'userData',
    REFRESH_TOKEN_KEY: 'refresh_token'
  },
  
  // Tipos de usuario
  USER_TYPES: {
    ADMINISTRADOR: 'administrador',
    MEDICO: 'medico',
    PACIENTE: 'paciente'
  },
  
  // Estados de citas
  CITAS_ESTADOS: {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    CANCELADA: 'cancelada',
    REALIZADA: 'realizada'
  },
  
  // Configuración de la app
  APP_CONFIG: {
    NAME: 'Sistema de Citas Médicas',
    VERSION: '2.0.0',
    DEBUG: __DEV__
  },
  
  // Configuración de almacenamiento
  STORAGE_TYPE: Platform.OS === 'web' ? 'localStorage' : 'AsyncStorage',
  
  // Configuración de red
  NETWORK_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de demo
  DEMO_CREDENTIALS: [
    { 
      usuario: "admin", 
      password: "admin123", 
      tipo_usuario: "administrador", 
      name: "Super Administrador" 
    },
    { 
      usuario: "wmorales", 
      password: "medico123", 
      tipo_usuario: "medico", 
      name: "Dr. Wylmer Morales" 
    },
    { 
      usuario: "jperez", 
      password: "paciente123", 
      tipo_usuario: "paciente", 
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

export default config;
export const { API_BASE_URL, AUTH_CONFIG, USER_TYPES, CITAS_ESTADOS, APP_CONFIG } = config;
