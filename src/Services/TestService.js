import storageService from './WebStorageService';

export const testAsyncStorage = async () => {
  try {
    console.log("TestService: Probando AsyncStorage...");
    
    // Test 1: Guardar datos
    const testData = { test: "data", timestamp: Date.now() };
    await storageService.setItem('test_key', JSON.stringify(testData));
    console.log("TestService: Datos guardados:", testData);
    
    // Test 2: Leer datos
    const savedData = await storageService.getItem('test_key');
    console.log("TestService: Datos leídos:", savedData);
    
    // Test 3: Parsear datos
    const parsedData = JSON.parse(savedData);
    console.log("TestService: Datos parseados:", parsedData);
    
    // Test 4: Limpiar datos de prueba
    await storageService.removeItem('test_key');
    console.log("TestService: Datos de prueba eliminados");
    
    return { success: true, message: "AsyncStorage funciona correctamente" };
  } catch (error) {
    console.error("TestService: Error en AsyncStorage:", error);
    return { success: false, message: "Error en AsyncStorage" };
  }
};

export const debugDatabase = async () => {
  try {
    console.log("TestService: Debug de base de datos...");
    
    // Ver todas las claves en storage
    const allKeys = await storageService.getAllKeys();
    console.log("TestService: Todas las claves en storage:", allKeys);
    
    // Ver datos de usuarios
    const usersData = await storageService.getItem('users_database');
    console.log("TestService: Datos de usuarios raw:", usersData);
    
    if (usersData) {
      const users = JSON.parse(usersData);
      console.log("TestService: Usuarios parseados:", users);
    } else {
      console.log("TestService: No hay datos de usuarios");
    }
    
    return { success: true };
  } catch (error) {
    console.error("TestService: Error en debug:", error);
    return { success: false };
  }
};
