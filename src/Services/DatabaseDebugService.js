import storageService from './WebStorageService';
import { getUsers, getUserByEmail } from './RegisterService';

const DATABASE_KEY = 'users_database';

export const debugDatabase = async () => {
  try {
    console.log("=== DEBUG DE BASE DE DATOS ===");
    
    // 1. Verificar storage directo
    console.log("1. Verificando storage directo...");
    const rawData = await storageService.getItem(DATABASE_KEY);
    console.log("Raw data from storage:", rawData);
    
    // 2. Verificar usuarios parseados
    console.log("2. Verificando usuarios parseados...");
    const users = await getUsers();
    console.log("Usuarios en BD:", users);
    console.log("Total usuarios:", users.length);
    
    // 3. Mostrar detalles de cada usuario
    console.log("3. Detalles de usuarios:");
    users.forEach((user, index) => {
      console.log(`Usuario ${index + 1}:`, {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        fechaRegistro: user.fechaRegistro,
        activo: user.activo
      });
    });
    
    // 4. Verificar estructura de datos
    console.log("4. Verificando estructura de datos...");
    if (users.length > 0) {
      const firstUser = users[0];
      console.log("Estructura del primer usuario:", Object.keys(firstUser));
    }
    
    console.log("=== FIN DEBUG DE BASE DE DATOS ===");
    
    return {
      success: true,
      totalUsers: users.length,
      users: users,
      rawData: rawData
    };
    
  } catch (error) {
    console.error("Error en debug de base de datos:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testUserRegistration = async (testUserData) => {
  try {
    console.log("=== TEST DE REGISTRO DE USUARIO ===");
    console.log("Datos de prueba:", testUserData);
    
    // 1. Verificar estado antes del registro
    console.log("1. Estado antes del registro:");
    const usersBefore = await getUsers();
    console.log("Usuarios antes:", usersBefore.length);
    
    // 2. Simular registro
    console.log("2. Simulando registro...");
    const { registerUser } = await import('./RegisterService');
    const result = await registerUser(testUserData);
    console.log("Resultado del registro:", result);
    
    // 3. Verificar estado después del registro
    console.log("3. Estado después del registro:");
    const usersAfter = await getUsers();
    console.log("Usuarios después:", usersAfter.length);
    
    // 4. Verificar que el usuario se agregó
    if (result.success) {
      const newUser = await getUserByEmail(testUserData.email);
      console.log("Usuario encontrado después del registro:", newUser);
    }
    
    console.log("=== FIN TEST DE REGISTRO ===");
    
    return {
      success: result.success,
      usersBefore: usersBefore.length,
      usersAfter: usersAfter.length,
      newUserAdded: usersAfter.length > usersBefore.length,
      result: result
    };
    
  } catch (error) {
    console.error("Error en test de registro:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const clearDatabase = async () => {
  try {
    console.log("=== LIMPIANDO BASE DE DATOS ===");
    await storageService.removeItem(DATABASE_KEY);
    console.log("Base de datos limpiada");
    
    // Verificar que se limpió
    const users = await getUsers();
    console.log("Usuarios después de limpiar:", users.length);
    
    return {
      success: true,
      message: "Base de datos limpiada correctamente"
    };
  } catch (error) {
    console.error("Error al limpiar base de datos:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyUserExists = async (email) => {
  try {
    console.log("=== VERIFICANDO EXISTENCIA DE USUARIO ===");
    console.log("Email a verificar:", email);
    
    const user = await getUserByEmail(email);
    console.log("Usuario encontrado:", user);
    
    if (user) {
      console.log("✅ Usuario existe en la base de datos");
      return {
        exists: true,
        user: user
      };
    } else {
      console.log("❌ Usuario NO existe en la base de datos");
      return {
        exists: false,
        user: null
      };
    }
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    return {
      exists: false,
      error: error.message
    };
  }
};

export const listAllUsers = async () => {
  try {
    console.log("=== LISTANDO TODOS LOS USUARIOS ===");
    const users = await getUsers();
    
    console.log("Total de usuarios:", users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Rol: ${user.rol}`);
    });
    
    return {
      success: true,
      totalUsers: users.length,
      users: users
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
