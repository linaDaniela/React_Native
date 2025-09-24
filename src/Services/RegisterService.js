import AsyncStorage from '@react-native-async-storage/async-storage';

import storageService from './WebStorageService';

// Simular base de datos local
const DATABASE_KEY = 'users_database';

export const registerUser = async (userData) => {
  try {
    console.log("RegisterService: Registrando usuario en base de datos...");
    console.log("RegisterService: Datos del usuario:", userData);
    
    // Validar email antes de procesar
    if (!userData.email || typeof userData.email !== 'string') {
      return { success: false, message: "Email inválido" };
    }
    
    // Limpiar email (quitar espacios y convertir a minúsculas)
    const cleanEmail = userData.email.trim().toLowerCase();
    console.log("RegisterService: Email limpio:", cleanEmail);
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: "Formato de email inválido" };
    }
    
    // Obtener usuarios existentes
    const existingUsers = await getUsers();
    console.log("RegisterService: Usuarios existentes:", existingUsers);
    
    // Verificar si el email ya existe (comparar con email limpio)
    const emailExists = existingUsers.find(user => user.email && user.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      console.log("RegisterService: Email ya registrado:", cleanEmail);
      return {
        success: false,
        message: "El email ya está registrado"
      };
    }
    
    // Crear nuevo usuario con ID único y email limpio
    const newUser = {
      id: Date.now(),
      ...userData,
      email: cleanEmail, // Usar email limpio
      fechaRegistro: new Date().toISOString(),
      activo: true
    };
    
    // Agregar a la lista de usuarios
    const updatedUsers = [...existingUsers, newUser];
    
    // Guardar en la "base de datos"
    const dataToSave = JSON.stringify(updatedUsers);
    console.log("RegisterService: Guardando en storage:", dataToSave);
    await storageService.setItem(DATABASE_KEY, dataToSave);
    
    // Verificar que se guardó correctamente
    const savedData = await storageService.getItem(DATABASE_KEY);
    console.log("RegisterService: Verificación - datos guardados:", savedData);
    
    console.log("RegisterService: Usuario registrado en BD:", newUser);
    
    return {
      success: true,
      message: "Usuario registrado exitosamente",
      user: newUser
    };
    
  } catch (error) {
    console.error("RegisterService: Error al registrar usuario:", error);
    return {
      success: false,
      message: "Error al registrar usuario en la base de datos"
    };
  }
};

export const getUsers = async () => {
  try {
    console.log("RegisterService: Obteniendo usuarios de storage...");
    const usersData = await storageService.getItem(DATABASE_KEY);
    console.log("RegisterService: Datos raw de storage:", usersData);
    const users = usersData ? JSON.parse(usersData) : [];
    console.log("RegisterService: Usuarios parseados:", users);
    return users;
  } catch (error) {
    console.error("RegisterService: Error al obtener usuarios:", error);
    return [];
  }
};

export const getUserByEmail = async (email) => {
  try {
    console.log("RegisterService: Buscando usuario con email:", email);
    
    // Limpiar email de búsqueda
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    console.log("RegisterService: Email limpio para búsqueda:", cleanEmail);
    
    const users = await getUsers();
    console.log("RegisterService: Usuarios en BD:", users);
    
    // Buscar usuario con email limpio
    const foundUser = users.find(user => 
      user.email && user.email.toLowerCase() === cleanEmail
    );
    console.log("RegisterService: Usuario encontrado:", foundUser);
    return foundUser;
  } catch (error) {
    console.error("RegisterService: Error al buscar usuario:", error);
    return null;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: "Usuario no encontrado" };
    }
    
    users[userIndex] = { ...users[userIndex], ...updateData };
    await storageService.setItem(DATABASE_KEY, JSON.stringify(users));
    
    return { success: true, user: users[userIndex] };
  } catch (error) {
    console.error("RegisterService: Error al actualizar usuario:", error);
    return { success: false, message: "Error al actualizar usuario" };
  }
};

export const deleteUser = async (userId) => {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    await storageService.setItem(DATABASE_KEY, JSON.stringify(filteredUsers));
    
    return { success: true };
  } catch (error) {
    console.error("RegisterService: Error al eliminar usuario:", error);
    return { success: false, message: "Error al eliminar usuario" };
  }
};
