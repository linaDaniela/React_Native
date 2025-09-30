import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://172.20.10.8:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

const RutasPublicas = [
  '/login', 
  '/register-paciente',
  '/public/eps',
  '/public/especialidades',
  '/public/consultorios',
  '/public/medicos',
  '/health'
];

// Interceptor de REQUEST
api.interceptors.request.use(
    async (config) => {
        const esRutaPublica = RutasPublicas.some(ruta => config.url.includes(ruta));

        if (!esRutaPublica) {
            try { 
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken) {
                    // IMPORTANTE: Solo enviar a Laravel si NO es token local
                    if (!userToken.startsWith('local_token_') && !userToken.startsWith('demo_token_')) {
                        config.headers.Authorization = `Bearer ${userToken}`;
                        console.log("🔑 Token Laravel enviado");
                    } else {
                        console.log("⚠️ Token local detectado - no se envía a Laravel");
                    }
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

// Interceptor de RESPONSE
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isRutaPublica = RutasPublicas.some(ruta => originalRequest.url.includes(ruta));

        if (error.response?.status === 401 && !originalRequest._retry && !isRutaPublica) {
            originalRequest._retry = true;
            
            // Verificar si es token local
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken && (userToken.startsWith('local_token_') || userToken.startsWith('demo_token_'))) {
                console.log("⚠️ 401 con token local - esto es normal, usar datos de ejemplo");
                // NO limpiar el token local
                return Promise.reject(error);
            }
            
            // Solo limpiar si es token de Laravel
            try {
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("userData");
                console.log("Token Laravel expirado - limpiado");
            } catch (storageError) {
                console.error('Error al limpiar datos:', storageError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;