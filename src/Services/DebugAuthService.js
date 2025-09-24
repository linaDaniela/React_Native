// Servicio de debug para autenticación
import storageService from './WebStorageService';
import { getUsers } from './RegisterService';

export const debugAuthState = async () => {
  try {
    console.log("=== DEBUG AUTH STATE ===");
    
    // 1. Verificar localStorage
    console.log("1. Verificando localStorage...");
    const allKeys = await storageService.getAllKeys();
    console.log("   Claves en localStorage:", allKeys);
    
    // 2. Verificar token
    console.log("2. Verificando token...");
    const token = await storageService.getItem('userToken');
    console.log("   Token:", token ? "EXISTE" : "NO EXISTE");
    if (token) {
      console.log("   Token value:", token);
    }
    
    // 3. Verificar datos de usuario
    console.log("3. Verificando datos de usuario...");
    const userData = await storageService.getItem('userData');
    console.log("   UserData:", userData ? "EXISTE" : "NO EXISTE");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("   UserData parsed:", parsedUser);
    }
    
    // 4. Verificar base de datos de usuarios
    console.log("4. Verificando base de datos de usuarios...");
    const users = await getUsers();
    console.log("   Usuarios en BD:", users.length);
    users.forEach((user, index) => {
      console.log(`   Usuario ${index + 1}:`, {
        id: user.id,
        email: user.email,
        name: user.name,
        rol: user.rol
      });
    });
    
    // 5. Estado de autenticación
    console.log("5. Estado de autenticación:");
    const isAuthenticated = !!(token && userData);
    console.log("   Autenticado:", isAuthenticated ? "SÍ" : "NO");
    
    console.log("=== FIN DEBUG AUTH STATE ===");
    
    return {
      success: true,
      authenticated: isAuthenticated,
      token: token,
      userData: userData ? JSON.parse(userData) : null,
      usersCount: users.length
    };
  } catch (error) {
    console.error("Error en debug auth state:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testLoginFlow = async (email, password) => {
  try {
    console.log("=== TEST LOGIN FLOW ===");
    console.log("Email:", email);
    console.log("Password:", password);
    
    // 1. Buscar usuario
    const { getUserByEmail } = await import('./RegisterService');
    const user = await getUserByEmail(email);
    console.log("Usuario encontrado:", user);
    
    // 2. Verificar contraseña
    if (user && user.password === password) {
      console.log("Contraseña correcta");
      
      // 3. Crear token y datos
      const token = `test_token_${Date.now()}`;
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.rol
      };
      
      // 4. Guardar
      await storageService.setItem('userToken', token);
      await storageService.setItem('userData', JSON.stringify(userData));
      
      console.log("Token y datos guardados");
      console.log("=== FIN TEST LOGIN FLOW ===");
      
      return { success: true, user: userData };
    } else {
      console.log("Usuario no encontrado o contraseña incorrecta");
      console.log("=== FIN TEST LOGIN FLOW ===");
      return { success: false, message: "Credenciales incorrectas" };
    }
  } catch (error) {
    console.error("Error en test login flow:", error);
    return { success: false, error: error.message };
  }
};
