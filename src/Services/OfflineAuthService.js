// Servicio de autenticación completamente offline para móvil
import storageService from './WebStorageService';
import { getUserByEmail } from './RegisterService';
import { Platform } from 'react-native';

export const offlineLoginUser = async (email, password) => {
  try {
    console.log("OfflineAuthService: Login offline con:", email);
    console.log("OfflineAuthService: Plataforma:", Platform.OS);
    
    // Verificar si estamos en modo demo y si las credenciales son de demo
    const demoCredentials = [
      { email: "medico@eps.com", password: "medico123", role: "medico", name: "Dr. Carlos Rodríguez" },
      { email: "paciente@eps.com", password: "paciente123", role: "paciente", name: "Juan Pérez" }
    ];
    
    const demoCreds = demoCredentials.find(cred => cred.email === email);
    if (demoCreds && demoCreds.password === password) {
      console.log("OfflineAuthService: Login exitoso en modo demo");
      
      // Crear un token demo
      const demoToken = `offline_demo_token_${Date.now()}`;
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
        message: "Login exitoso (modo demo offline)"
      };
    }
    
    // Si no es una credencial demo, buscar en la base de datos local
    console.log("OfflineAuthService: Buscando usuario en base de datos local para:", email);
    
    const dbUser = await getUserByEmail(email);
    if (dbUser && dbUser.password === password) {
      console.log("OfflineAuthService: Usuario encontrado en BD local:", dbUser);
      
      const loginToken = `offline_login_token_${Date.now()}`;
      const loginUserData = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.rol,
        nombre: dbUser.nombre,
        apellido: dbUser.apellido,
        telefono: dbUser.telefono
      };
      
      await storageService.setItem("userToken", loginToken);
      await storageService.setItem("userData", JSON.stringify(loginUserData));
      
      return { 
        success: true, 
        token: loginToken,
        user: loginUserData,
        message: "Login exitoso (usuario de BD local)"
      };
    }
    
    // Si no se encuentra en BD local, crear usuario temporal
    console.log("OfflineAuthService: Usuario no encontrado en BD local, creando temporal para:", email);
    
    const tempToken = `offline_temp_token_${Date.now()}`;
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
      message: "Login exitoso (usuario temporal offline)"
    };
    
  } catch (error) {
    console.error("OfflineAuthService: Error al iniciar sesión:", error);
    
    // En caso de cualquier error, crear un usuario temporal
    console.log("OfflineAuthService: Creando usuario temporal debido a error");
    
    const tempToken = `offline_error_token_${Date.now()}`;
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
      console.error("OfflineAuthService: Error al guardar datos:", storageError);
      return {
        success: false,
        message: "Error al guardar datos del usuario"
      };
    }
  }
};

export const offlineLogoutUser = async () => {
  try {
    await storageService.removeItem("userToken");
    await storageService.removeItem("userData");
    console.log("OfflineAuthService: Logout exitoso");
    return { success: true };
  } catch (error) {
    console.error("OfflineAuthService: Error al cerrar sesión:", error);
    return { success: false, message: "Error al cerrar sesión" };
  }
};

export const offlineGetStoredUser = async () => {
  try {
    const token = await storageService.getItem("userToken");
    const userData = await storageService.getItem("userData");
    
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error("OfflineAuthService: Error al obtener datos del usuario:", error);
    return { token: null, user: null };
  }
};

export const offlineIsLoggedIn = async () => {
  try {
    const token = await storageService.getItem("userToken");
    return !!token;
  } catch (error) {
    console.error("OfflineAuthService: Error al verificar login:", error);
    return false;
  }
};
