import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageService from "./WebStorageService";
import { Platform } from 'react-native';

// Solo usar servidor externo en web, no en móvil
const API_URL_BASE = Platform.OS === 'web' 
  ? "http://172.20.10.8:8000/api" 
  : null; // No usar servidor externo en móvil

const api = axios.create({
    baseURL: API_URL_BASE,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

const RutasPublicas = ['/login', '/register'];

api.interceptors.request.use(
    async (config) => {
        const esRutaPublica = RutasPublicas.some(ruta => config.url.includes(ruta));

        if (!esRutaPublica) {
            const userToken = await storageService.getItem('userToken');
            if (userToken) {
                config.headers.Authorization = `Bearer ${userToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isRutaPublica = RutasPublicas.some(ruta => originalRequest.url.includes(ruta));

        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRutaPublica) {
            originalRequest._retry = true;
            await storageService.removeItem("userToken"); // elimina el token guardado
            await storageService.removeItem("userData"); // elimina los datos del usuario
            console.log("Token expirado o no autorizado, Redirigiendo al login");
        }
        return Promise.reject(error);
    }
);

        export default api;