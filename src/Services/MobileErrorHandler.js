// Manejador de errores específico para móvil
import storageService from './WebStorageService';

export const handleMobileError = async (error) => {
  try {
    console.log("MobileErrorHandler: Manejando error:", error);
    
    // Si es error 401, limpiar datos de autenticación
    if (error.response && error.response.status === 401) {
      console.log("MobileErrorHandler: Error 401 detectado, limpiando datos...");
      
      await storageService.removeItem('userToken');
      await storageService.removeItem('userData');
      
      console.log("MobileErrorHandler: Datos de autenticación limpiados");
      
      return {
        handled: true,
        message: "Sesión expirada. Por favor, inicia sesión nuevamente.",
        action: "redirect_to_login"
      };
    }
    
    // Si es error de red
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.log("MobileErrorHandler: Error de red detectado");
      
      return {
        handled: true,
        message: "Error de conexión. Verifica tu internet.",
        action: "show_offline_mode"
      };
    }
    
    // Si es error del servidor
    if (error.response && error.response.status >= 500) {
      console.log("MobileErrorHandler: Error del servidor detectado");
      
      return {
        handled: true,
        message: "Error del servidor. Intenta más tarde.",
        action: "show_retry_option"
      };
    }
    
    // Error no manejado
    console.log("MobileErrorHandler: Error no manejado:", error.message);
    
    return {
      handled: false,
      message: error.message || "Error desconocido",
      action: "show_generic_error"
    };
    
  } catch (handlerError) {
    console.error("MobileErrorHandler: Error en el manejador:", handlerError);
    
    return {
      handled: false,
      message: "Error crítico en el sistema",
      action: "show_critical_error"
    };
  }
};

export const createMobileSafeRequest = async (url, options = {}) => {
  try {
    console.log("MobileErrorHandler: Haciendo request seguro a:", url);
    
    // Obtener token si existe
    const token = await storageService.getItem('userToken');
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Agregar token si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Hacer la petición con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Si es 401, limpiar datos automáticamente
    if (response.status === 401) {
      console.log("MobileErrorHandler: 401 en request, limpiando datos...");
      await storageService.removeItem('userToken');
      await storageService.removeItem('userData');
      
      throw new Error('Sesión expirada');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
    
  } catch (error) {
    console.error("MobileErrorHandler: Error en request seguro:", error);
    
    // Manejar el error
    const handledError = await handleMobileError(error);
    
    if (handledError.handled) {
      throw new Error(handledError.message);
    } else {
      throw error;
    }
  }
};

export const isMobileEnvironment = () => {
  // Detectar si estamos en móvil
  return typeof navigator !== 'undefined' && 
         (navigator.userAgent.includes('Mobile') || 
          navigator.userAgent.includes('Android') || 
          navigator.userAgent.includes('iPhone'));
};
