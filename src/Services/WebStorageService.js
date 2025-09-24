// Servicio de almacenamiento que funciona tanto en web como en móvil
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageService {
  constructor() {
    this.isWeb = Platform.OS === 'web';
  }

  async setItem(key, value) {
    try {
      if (this.isWeb) {
        // En web, usar localStorage
        localStorage.setItem(key, value);
        console.log(`WebStorage: Guardado en localStorage - ${key}:`, value);
      } else {
        // En móvil, usar AsyncStorage
        await AsyncStorage.setItem(key, value);
        console.log(`WebStorage: Guardado en AsyncStorage - ${key}:`, value);
      }
      return true;
    } catch (error) {
      console.error(`WebStorage: Error al guardar ${key}:`, error);
      return false;
    }
  }

  async getItem(key) {
    try {
      if (this.isWeb) {
        // En web, usar localStorage
        const value = localStorage.getItem(key);
        console.log(`WebStorage: Leído de localStorage - ${key}:`, value);
        return value;
      } else {
        // En móvil, usar AsyncStorage
        const value = await AsyncStorage.getItem(key);
        console.log(`WebStorage: Leído de AsyncStorage - ${key}:`, value);
        return value;
      }
    } catch (error) {
      console.error(`WebStorage: Error al leer ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      if (this.isWeb) {
        // En web, usar localStorage
        localStorage.removeItem(key);
        console.log(`WebStorage: Eliminado de localStorage - ${key}`);
      } else {
        // En móvil, usar AsyncStorage
        await AsyncStorage.removeItem(key);
        console.log(`WebStorage: Eliminado de AsyncStorage - ${key}`);
      }
      return true;
    } catch (error) {
      console.error(`WebStorage: Error al eliminar ${key}:`, error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      if (this.isWeb) {
        // En web, obtener todas las claves de localStorage
        const keys = Object.keys(localStorage);
        console.log(`WebStorage: Claves en localStorage:`, keys);
        return keys;
      } else {
        // En móvil, usar AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        console.log(`WebStorage: Claves en AsyncStorage:`, keys);
        return keys;
      }
    } catch (error) {
      console.error(`WebStorage: Error al obtener claves:`, error);
      return [];
    }
  }
}

// Crear instancia única
const storageService = new StorageService();

export default storageService;
