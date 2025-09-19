import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './conexion';

export const loginUser = async (email,password) => {
    try{
        const response = await api.post('login', {emial, password});
        const token = response.data.token;
        console.log("Respuesta del servidor:", response.data);
        console.log("Token recibido:",  token);
        if(token){
            await AsyncStorage.setItem("userToken", token);
        } else {
            console.error("No se recibio token en la respuesta");
        }
        return {success: true, token};
    } catch(error){
        console.error("Error al iniciar sesion:", error.response ? error.response.data: error.mensage);

        return{
            success: false,
            message: error.response ? error.data : "Error de connexion",
        };
    }
}