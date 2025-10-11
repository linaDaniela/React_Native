// Configuración de la API
export const API_CONFIG = {
  // Cambiar esta URL según tu entorno
  BASE_URL: 'http://172.20.10.8:8000/api', // Para emulador Android
  
 
  TIMEOUT: 30000, // 30 segundos
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Función para obtener la URL base según el entorno
export const getApiBaseUrl = () => {
  // En desarrollo, puedes cambiar fácilmente la URL aquí
  return API_CONFIG.BASE_URL;
};

// Función para verificar si la API está disponible
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/test`);
    return response.ok;
  } catch (error) {
    console.error('Error checking API connection:', error);
    return false;
  }
};
