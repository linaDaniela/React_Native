import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

// Configuración base de la API
const API_BASE_URL = 'http://172.20.10.8:8000/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 segundos
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Rutas públicas que no requieren autenticación
const RutasPublicas = [
  '/login', 
  '/register-paciente',
  '/public/eps',
  '/public/especialidades',
  '/public/consultorios',
  '/public/medicos'
];

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
    async (config) => {
        const esRutaPublica = RutasPublicas.some(ruta => config.url.includes(ruta));

        if (!esRutaPublica) {
            try { 
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken) {
                    config.headers.Authorization = `Bearer ${userToken}`;
                }
            } catch (error) {
                console.error('Error al obtener token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isRutaPublica = RutasPublicas.some(ruta => originalRequest.url.includes(ruta));

        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRutaPublica) {
            originalRequest._retry = true;
            try {
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("userData");
                console.log("Token expirado o no autorizado, Redirigiendo al login");
            } catch (storageError) {
                console.error('Error al limpiar datos de autenticación:', storageError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;