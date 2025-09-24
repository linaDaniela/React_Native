import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserByEmail } from "./RegisterService";
import storageService from "./WebStorageService";
import { handleMobileError, isMobileEnvironment } from "./MobileErrorHandler";
import { offlineLoginUser, offlineLogoutUser, offlineGetStoredUser, offlineIsLoggedIn } from "./OfflineAuthService";
import api from './conexion';
import { Platform } from 'react-native';

export const loginUser = async (email, password) => {
    try {
        console.log("AuthService: Intentando login con:", email);
        console.log("AuthService: Plataforma:", Platform.OS);
        
        // En móvil, usar siempre el servicio offline
        if (Platform.OS !== 'web') {
            console.log("AuthService: Usando servicio offline para móvil");
            return await offlineLoginUser(email, password);
        }
        
        console.log("AuthService: Usando servicio web");
        
        // Verificar si estamos en modo demo y si las credenciales son de demo
        const demoCredentials = [
            { email: "medico@eps.com", password: "medico123", role: "medico", name: "Dr. Carlos Rodríguez" },
            { email: "paciente@eps.com", password: "paciente123", role: "paciente", name: "Juan Pérez" }
        ];
        
        const demoCreds = demoCredentials.find(cred => cred.email === email);
        if (demoCreds && demoCreds.password === password) {
            console.log("Login exitoso en modo demo");
            
            // Crear un token demo
            const demoToken = `demo_token_${Date.now()}`;
            const demoUser = {
                id: 1,
                email: email,
                name: demoCreds.name,
                role: demoCreds.role
            };
            
            await storageService.setItem("userToken", demoToken);
            await storageService.setItem("userData", JSON.stringify(demoUser));
            
            return { 
                success: true, 
                token: demoToken,
                user: demoUser,
                message: "Login exitoso (modo demo)"
            };
        }
        
        // Si no es una credencial demo, buscar en la base de datos
        console.log("Buscando usuario en base de datos para:", email);
        
        const dbUser = await getUserByEmail(email);
        console.log("Resultado de búsqueda en BD:", dbUser);
        
        if (dbUser && dbUser.password === password) {
            console.log("Usuario encontrado en BD:", dbUser);
            
            const loginToken = `login_token_${Date.now()}`;
            const loginUser = {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name || `${dbUser.nombre} ${dbUser.apellido}`,
                role: dbUser.rol,
                nombre: dbUser.nombre,
                apellido: dbUser.apellido,
                telefono: dbUser.telefono
            };
            
            await storageService.setItem("userToken", loginToken);
            await storageService.setItem("userData", JSON.stringify(loginUser));
            
            return { 
                success: true, 
                token: loginToken,
                user: loginUser,
                message: "Login exitoso (usuario de BD)"
            };
        } else if (dbUser) {
            console.log("Usuario encontrado pero contraseña incorrecta");
            return {
                success: false,
                message: "Contraseña incorrecta"
            };
        }
        
        // Si no se encuentra en BD, crear usuario temporal
        console.log("Usuario no encontrado en BD, creando temporal para:", email);
        
        const tempToken = `temp_token_${Date.now()}`;
        const tempUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0], // Usar la parte antes del @ como nombre
            role: "paciente"
        };
        
        await storageService.setItem("userToken", tempToken);
        await storageService.setItem("userData", JSON.stringify(tempUser));
        
        return { 
            success: true, 
            token: tempToken,
            user: tempUser,
            message: "Login exitoso (usuario temporal)"
        };
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        
        // En caso de cualquier error, crear un usuario temporal
        console.log("Creando usuario temporal debido a error");
        
        const tempToken = `temp_token_${Date.now()}`;
        const tempUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            role: "paciente"
        };
        
        try {
            await storageService.setItem("userToken", tempToken);
            await storageService.setItem("userData", JSON.stringify(tempUser));
            
            return { 
                success: true, 
                token: tempToken,
                user: tempUser,
                message: "Login exitoso (modo offline)"
            };
        } catch (storageError) {
            console.error("Error al guardar datos:", storageError);
            return {
                success: false,
                message: "Error al guardar datos del usuario"
            };
        }
    }
};

export const logoutUser = async () => {
    try {
        // En móvil, usar servicio offline
        if (Platform.OS !== 'web') {
            return await offlineLogoutUser();
        }
        
        await storageService.removeItem("userToken");
        await storageService.removeItem("userData");
        console.log("Logout exitoso");
        return { success: true };
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return { success: false, message: "Error al cerrar sesión" };
    }
};

export const getStoredUser = async () => {
    try {
        // En móvil, usar servicio offline
        if (Platform.OS !== 'web') {
            return await offlineGetStoredUser();
        }
        
        const token = await storageService.getItem("userToken");
        const userData = await storageService.getItem("userData");
        
        return {
            token,
            user: userData ? JSON.parse(userData) : null
        };
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        return { token: null, user: null };
    }
};

export const isLoggedIn = async () => {
    try {
        // En móvil, usar servicio offline
        if (Platform.OS !== 'web') {
            return await offlineIsLoggedIn();
        }
        
        const token = await storageService.getItem("userToken");
        return !!token;
    } catch (error) {
        console.error("Error al verificar login:", error);
        return false;
    }
};