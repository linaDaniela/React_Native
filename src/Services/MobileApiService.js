// Servicio de API optimizado para móvil
import storageService from './WebStorageService';

class MobileApiService {
  constructor() {
    this.baseURL = 'http://172.20.10.8:8000/api';
    this.isMobile = true; // Siempre true para Expo Go
  }

  async makeRequest(endpoint, options = {}) {
    try {
      console.log(`MobileApiService: Haciendo request a ${endpoint}`);
      
      // Obtener token si existe
      const token = await storageService.getItem('userToken');
      
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...options
      };

      // Agregar token si existe
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('MobileApiService: Token agregado a headers');
      }

      // Construir URL completa
      const url = `${this.baseURL}${endpoint}`;
      console.log(`MobileApiService: URL completa: ${url}`);

      // Hacer la petición
      const response = await fetch(url, config);
      
      console.log(`MobileApiService: Response status: ${response.status}`);
      
      // Si es 401, limpiar token
      if (response.status === 401) {
        console.log('MobileApiService: Token expirado, limpiando...');
        await storageService.removeItem('userToken');
        await storageService.removeItem('userData');
        throw new Error('Token expirado o no autorizado');
      }

      // Parsear respuesta
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`MobileApiService: Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos específicos
  async login(email, password) {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateProfile(profileData) {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getProfile() {
    return this.makeRequest('/profile');
  }

  // Método para probar conectividad
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('MobileApiService: Error de conectividad:', error);
      return false;
    }
  }
}

export default new MobileApiService();
