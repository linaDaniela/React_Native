// Servicio de debug específico para usuarios
import storageService from './WebStorageService';
import { getUsers, getUserByEmail } from './RegisterService';

export const debugUserSearch = async (email) => {
  try {
    console.log("=== DEBUG USER SEARCH ===");
    console.log("Email a buscar:", email);
    
    // 1. Ver todos los usuarios
    console.log("1. Obteniendo todos los usuarios...");
    const allUsers = await getUsers();
    console.log("   Total usuarios:", allUsers.length);
    
    allUsers.forEach((user, index) => {
      console.log(`   Usuario ${index + 1}:`, {
        id: user.id,
        email: user.email,
        name: user.name,
        rol: user.rol
      });
    });
    
    // 2. Buscar usuario específico
    console.log("2. Buscando usuario específico...");
    const foundUser = await getUserByEmail(email);
    console.log("   Usuario encontrado:", foundUser);
    
    // 3. Comparación manual
    console.log("3. Comparación manual...");
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    console.log("   Email limpio:", cleanEmail);
    
    const manualSearch = allUsers.find(user => 
      user.email && user.email.toLowerCase() === cleanEmail
    );
    console.log("   Búsqueda manual:", manualSearch);
    
    // 4. Verificar diferencias
    console.log("4. Verificando diferencias...");
    allUsers.forEach((user, index) => {
      if (user.email) {
        const userEmailClean = user.email.toLowerCase();
        const isMatch = userEmailClean === cleanEmail;
        console.log(`   Usuario ${index + 1} email: "${user.email}" -> "${userEmailClean}" -> Match: ${isMatch}`);
      }
    });
    
    console.log("=== FIN DEBUG USER SEARCH ===");
    
    return {
      success: true,
      totalUsers: allUsers.length,
      foundUser: foundUser,
      manualSearch: manualSearch,
      cleanEmail: cleanEmail
    };
  } catch (error) {
    console.error("Error en debug user search:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const debugAllUsers = async () => {
  try {
    console.log("=== DEBUG ALL USERS ===");
    
    // Ver datos raw de localStorage
    const rawData = await storageService.getItem('users_database');
    console.log("Datos raw de localStorage:", rawData);
    
    // Ver usuarios parseados
    const users = await getUsers();
    console.log("Usuarios parseados:", users);
    
    // Mostrar cada usuario con detalles
    users.forEach((user, index) => {
      console.log(`Usuario ${index + 1}:`, {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        password: user.password ? '***' : 'NO',
        name: user.name,
        fechaRegistro: user.fechaRegistro,
        activo: user.activo
      });
    });
    
    console.log("=== FIN DEBUG ALL USERS ===");
    
    return {
      success: true,
      users: users,
      totalCount: users.length
    };
  } catch (error) {
    console.error("Error en debug all users:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testLoginWithUser = async (email, password) => {
  try {
    console.log("=== TEST LOGIN WITH USER ===");
    console.log("Email:", email);
    console.log("Password:", password);
    
    // 1. Buscar usuario
    const user = await getUserByEmail(email);
    console.log("Usuario encontrado:", user);
    
    if (!user) {
      console.log("Usuario no encontrado");
      return { success: false, message: "Usuario no encontrado" };
    }
    
    // 2. Verificar contraseña
    console.log("Contraseña del usuario:", user.password ? '***' : 'NO');
    const passwordMatch = user.password === password;
    console.log("Contraseña coincide:", passwordMatch);
    
    if (!passwordMatch) {
      console.log("Contraseña incorrecta");
      return { success: false, message: "Contraseña incorrecta" };
    }
    
    // 3. Crear datos de login
    const loginData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono
    };
    
    console.log("Datos de login:", loginData);
    console.log("=== FIN TEST LOGIN WITH USER ===");
    
    return {
      success: true,
      user: loginData,
      message: "Login exitoso"
    };
  } catch (error) {
    console.error("Error en test login with user:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
