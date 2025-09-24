// Servicio para limpiar datos corruptos en localStorage
import storageService from './WebStorageService';

const DATABASE_KEY = 'users_database';

export const clearCorruptedData = async () => {
  try {
    console.log("CleanupService: Limpiando datos corruptos...");
    
    // Limpiar completamente la base de datos
    await storageService.removeItem(DATABASE_KEY);
    console.log("CleanupService: Base de datos limpiada");
    
    // También limpiar tokens y datos de usuario
    await storageService.removeItem('userToken');
    await storageService.removeItem('userData');
    console.log("CleanupService: Tokens y datos de usuario limpiados");
    
    return { success: true, message: "Datos corruptos eliminados" };
  } catch (error) {
    console.error("CleanupService: Error al limpiar datos:", error);
    return { success: false, message: "Error al limpiar datos" };
  }
};

export const validateAndFixData = async () => {
  try {
    console.log("CleanupService: Validando y corrigiendo datos...");
    
    const usersData = await storageService.getItem(DATABASE_KEY);
    
    if (!usersData) {
      console.log("CleanupService: No hay datos para validar");
      return { success: true, message: "No hay datos para validar" };
    }
    
    const users = JSON.parse(usersData);
    console.log("CleanupService: Usuarios encontrados:", users);
    
    // Validar cada usuario
    const validUsers = users.filter(user => {
      // Verificar que tenga email válido
      if (!user.email || typeof user.email !== 'string') {
        console.log("CleanupService: Usuario sin email válido:", user);
        return false;
      }
      
      // Verificar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        console.log("CleanupService: Email con formato inválido:", user.email);
        return false;
      }
      
      return true;
    });
    
    console.log("CleanupService: Usuarios válidos:", validUsers);
    
    // Guardar solo usuarios válidos
    if (validUsers.length !== users.length) {
      await storageService.setItem(DATABASE_KEY, JSON.stringify(validUsers));
      console.log("CleanupService: Datos corregidos y guardados");
    }
    
    return { 
      success: true, 
      message: `Validación completada. ${validUsers.length} usuarios válidos de ${users.length} total` 
    };
  } catch (error) {
    console.error("CleanupService: Error al validar datos:", error);
    return { success: false, message: "Error al validar datos" };
  }
};
