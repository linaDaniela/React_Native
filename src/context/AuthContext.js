import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../service/ApiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log('checkAuthStatus - token:', token ? 'existe' : 'no existe');
      console.log('checkAuthStatus - userData:', userData);
      
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('checkAuthStatus - parsedUserData:', parsedUserData);
        console.log('checkAuthStatus - tipo:', parsedUserData.tipo);
        
        setUser(parsedUserData);
        setUserType(parsedUserData.tipo);
        setIsAuthenticated(true);
        
        console.log('checkAuthStatus - Estado actualizado:', {
          user: parsedUserData,
          userType: parsedUserData.tipo,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, tipo = 'paciente') => {
    try {
      console.log('Iniciando login para:', email, 'tipo:', tipo);
      
      const result = await authService.login(email, password, tipo);
      
      if (result.success) {
        console.log('Respuesta completa del backend:', result.data);
        
        // Acceder a los datos anidados correctamente
        const responseData = result.data.data || result.data;
        const { user, token, tipo: userTipo } = responseData;
        
        console.log('Datos extraídos:', { user, token, userTipo });
        
        if (!user || !token || !userTipo) {
          throw new Error('Datos de respuesta incompletos del servidor');
        }
        
        // Guardar datos en AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          ...user,
          tipo: userTipo
        }));
        
        // Actualizar estado
        setUser({ ...user, tipo: userTipo });
        setUserType(userTipo);
        setIsAuthenticated(true);
        
        console.log('Login completado exitosamente como:', userTipo);
        return { success: true, userType: userTipo };
      } else {
        throw new Error(result.message || 'Credenciales inválidas');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Cerrando sesión...');
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Limpiar estado
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};