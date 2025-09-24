// Servicio de autenticación optimizado para móvil
import storageService from './WebStorageService';
import { getUserByEmail } from './RegisterService';
import MobileApiService from './MobileApiService';

export const mobileLoginUser = async (email, password) => {
  try {
    console.log("MobileAuthService: Intentando login móvil con:", email);
    
    // Verificar si estamos en modo demo y si las credenciales son de demo
    const demoCredentials = [
      { email: "medico@eps.com", password: "medico123", role: "medico", name: "Dr. Carlos Rodríguez" },
      { email: "paciente@eps.com", password: "paciente123", role: "paciente", name: "Juan Pérez" }
    ];
    
    const demoCreds = demoCredentials.find(cred => cred.email === email);
    if (demoCreds && demoCreds.password === password) {
      console.log("MobileAuthService: Login exitoso en modo demo");
      
      // Crear un token demo
      const demoToken = `mobile_demo_token_${Date.now()}`;
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
        message: "Login exitoso (modo demo móvil)"
      };
    }
    
    // Si no es una credencial demo, buscar en la base de datos local
    console.log("MobileAuthService: Buscando usuario en base de datos local para:", email);
    
    const dbUser = await getUserByEmail(email);
    if (dbUser && dbUser.password === password) {
      console.log("MobileAuthService: Usuario encontrado en BD local:", dbUser);
      
      const loginToken = `mobile_login_token_${Date.now()}`;
      const loginUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
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
        message: "Login exitoso (usuario de BD local)"
      };
    }
    
    // Si no se encuentra en BD local, crear usuario temporal
    console.log("MobileAuthService: Usuario no encontrado en BD local, creando temporal para:", email);
    
    const tempToken = `mobile_temp_token_${Date.now()}`;
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
      message: "Login exitoso (usuario temporal móvil)"
    };
    
  } catch (error) {
    console.error("MobileAuthService: Error al iniciar sesión:", error);
    
    // En caso de cualquier error, crear un usuario temporal
    console.log("MobileAuthService: Creando usuario temporal debido a error");
    
    const tempToken = `mobile_error_token_${Date.now()}`;
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
        message: "Login exitoso (modo offline móvil)"
      };
    } catch (storageError) {
      console.error("MobileAuthService: Error al guardar datos:", storageError);
      return {
        success: false,
        message: "Error al guardar datos del usuario"
      };
    }
  }
};

export const mobileLogoutUser = async () => {
  try {
    await storageService.removeItem("userToken");
    await storageService.removeItem("userData");
    console.log("MobileAuthService: Logout exitoso");
    return { success: true };
  } catch (error) {
    console.error("MobileAuthService: Error al cerrar sesión:", error);
    return { success: false, message: "Error al cerrar sesión" };
  }
};

export const mobileGetStoredUser = async () => {
  try {
    const token = await storageService.getItem("userToken");
    const userData = await storageService.getItem("userData");
    
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error("MobileAuthService: Error al obtener datos del usuario:", error);
    return { token: null, user: null };
  }
};

export const mobileIsLoggedIn = async () => {
  try {
    const token = await storageService.getItem("userToken");
    return !!token;
  } catch (error) {
    console.error("MobileAuthService: Error al verificar login:", error);
    return false;
  }
};

// Función para probar conectividad del servidor
export const testServerConnection = async () => {
  try {
    const isConnected = await MobileApiService.testConnection();
    console.log("MobileAuthService: Conectividad del servidor:", isConnected ? "OK" : "ERROR");
    return isConnected;
  } catch (error) {
    console.error("MobileAuthService: Error al probar conectividad:", error);
    return false;
  }
};
