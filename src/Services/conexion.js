import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL_BASE = "http://10.2.234.228:8000/api";

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
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                config.headers.Authorization = `Bearer ${userToken}`;
            }
        return config;
        }
        (error) => {
            return Promise.reject(error);
        }

    },
);

api.interceptors.response.use(
    (response)=> response,

    async(error) =>{
        const iriginalRequest = error.config;
        const isRutaPublica = RutasPublicas.some(ruta => originalRequest.url.includes(ruta));

        if(error.response && error.response.status === 401 && !originalRequest._retry && !isRutaPublica){
            originalRequest._retry = true;
            await AsyncStorage.removeItem("userToken"); //elimina el token guardado
            console.log("Token expirado o no autorizado, Redirigiendo al login")
        }
        return Promise .reject (error);

    }
);

        export default api;