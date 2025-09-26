import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './conexion';

class ApiService {
  // Métodos para usuarios/autenticación
  static async registerUser(userData) {
    try {
      console.log("ApiService: Registrando usuario:", userData);
      
      // Preparar datos para Laravel
      const laravelData = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        fecha_nacimiento: userData.fecha_nacimiento,
        email: userData.email,
        telefono: userData.telefono,
        usuario: userData.usuario,
        password: userData.password,
        direccion: userData.direccion,
        eps_id: userData.eps_id,
        tipo_afiliacion: userData.tipo_afiliacion,
        numero_afiliacion: userData.numero_afiliacion,
        grupo_sanguineo: userData.grupo_sanguineo,
        alergias: userData.alergias,
        medicamentos_actuales: userData.medicamentos_actuales,
        contacto_emergencia_nombre: userData.contacto_emergencia_nombre,
        contacto_emergencia_telefono: userData.contacto_emergencia_telefono,
        rol: userData.rol || 'paciente'
      };

      // Intentar registro con Laravel
      try {
        console.log("🌐 Enviando datos a Laravel:", laravelData);
        const response = await api.post('/register-paciente', laravelData);
        console.log("✅ Registro exitoso con Laravel:", response.data);
        
        // También guardar localmente para compatibilidad
        await this.saveUserLocally(userData);
        
        return {
          success: true,
          message: "Paciente registrado exitosamente en la base de datos",
          data: response.data
        };
      } catch (error) {
        console.log("❌ Error con Laravel:", error.response?.data || error.message);
        
        // Mostrar el error específico de Laravel
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat();
          return {
            success: false,
            message: `Errores de validación: ${errorMessages.join(', ')}`,
            errors: validationErrors
          };
        }
        
        if (error.response?.status === 500) {
          return {
            success: false,
            message: "Error interno del servidor. Verifica que la base de datos esté configurada correctamente."
          };
        }
        
        // Solo usar fallback local si es un error de conexión
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          console.log("🔄 Error de conexión, usando modo local");
          await this.saveUserLocally(userData);
          
          return {
            success: true,
            message: "Paciente registrado localmente (sin conexión a servidor)",
            data: userData
          };
        }
        
        // Para otros errores, no usar fallback
        return {
          success: false,
          message: error.response?.data?.message || "Error al registrar paciente en el servidor"
        };
      }
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        message: "Error al registrar paciente"
      };
    }
  }

  static async loginUser(email, password, tipo_usuario = 'paciente') {
    try {
      console.log("ApiService: Intentando login con:", email, "tipo:", tipo_usuario);
      
      // Intentar login con Laravel
      try {
        const response = await api.post('/login', {
          email,
          password,
          tipo_usuario
        });
        
        if (response.data.success) {
          console.log("Login exitoso con Laravel");
          
          // Guardar token y datos del usuario
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            role: tipo_usuario
          }));
          
          return {
            success: true,
            token: response.data.token,
            user: {
              ...response.data.user,
              role: tipo_usuario
            },
            message: "Login exitoso"
          };
        }
      } catch (error) {
        console.log("Error con Laravel:", error.response?.data || error.message);
        
        // Si es error de validación, mostrar el mensaje específico
        if (error.response?.status === 401) {
          return {
            success: false,
            message: error.response.data.message || "Credenciales incorrectas"
          };
        }
      }
      
      // Fallback a modo local/demo
      return await this.localLogin(email, password);
      
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error al iniciar sesión"
      };
    }
  }

  static async localLogin(email, password) {
    // Credenciales demo basadas en la base de datos real
    const demoCredentials = [
      { email: "admin@sistema.com", password: "admin123", role: "admin", name: "Super Administrador" },
      { email: "Wilmer.Morales@hospital.com", password: "medico123", role: "medico", name: "Dr. Wylmer Morales" },
      { email: "juan.pineda@email.com", password: "paciente123", role: "paciente", name: "Juan Pineda" }
    ];
    
    const demoCreds = demoCredentials.find(cred => cred.email === email);
    if (demoCreds && demoCreds.password === password) {
      console.log("Login exitoso en modo demo");
      
      const demoToken = `demo_token_${Date.now()}`;
      const demoUser = {
        id: 1,
        email: email,
        name: demoCreds.name,
        role: demoCreds.role
      };
      
      await AsyncStorage.setItem("userToken", demoToken);
      await AsyncStorage.setItem("userData", JSON.stringify(demoUser));
      
      return { 
        success: true, 
        token: demoToken,
        user: demoUser,
        message: "Login exitoso (modo demo)"
      };
    }
    
    // Buscar en usuarios locales
    const localUsers = await this.getLocalUsers();
    const localUser = localUsers.find(user => user.email === email);
    
    if (localUser && localUser.password === password) {
      const loginToken = `local_token_${Date.now()}`;
      const loginUser = {
        id: localUser.id,
        email: localUser.email,
        name: `${localUser.nombre} ${localUser.apellido}`,
        role: localUser.rol,
        nombre: localUser.nombre,
        apellido: localUser.apellido,
        telefono: localUser.telefono,
        usuario: localUser.usuario
      };
      
      await AsyncStorage.setItem("userToken", loginToken);
      await AsyncStorage.setItem("userData", JSON.stringify(loginUser));
      
      return { 
        success: true, 
        token: loginToken,
        user: loginUser,
        message: "Login exitoso (usuario local)"
      };
    }
    
    return {
      success: false,
      message: "Credenciales incorrectas"
    };
  }

  static async logoutUser() {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      console.log("Logout exitoso");
      return { success: true };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return { success: false, message: "Error al cerrar sesión" };
    }
  }

  static async getStoredUser() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      
      return {
        token,
        user: userData ? JSON.parse(userData) : null
      };
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return { token: null, user: null };
    }
  }

  static async isLoggedIn() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      return !!token;
    } catch (error) {
      console.error("Error al verificar login:", error);
      return false;
    }
  }

  // Métodos para almacenamiento local
  static async saveUserLocally(userData) {
    try {
      const users = await this.getLocalUsers();
      
      const newUser = {
        id: Date.now(),
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        fecha_nacimiento: userData.fecha_nacimiento,
        email: userData.email,
        telefono: userData.telefono,
        usuario: userData.usuario,
        password: userData.password,
        direccion: userData.direccion,
        eps_id: userData.eps_id,
        tipo_afiliacion: userData.tipo_afiliacion,
        numero_afiliacion: userData.numero_afiliacion,
        grupo_sanguineo: userData.grupo_sanguineo,
        alergias: userData.alergias,
        medicamentos_actuales: userData.medicamentos_actuales,
        contacto_emergencia_nombre: userData.contacto_emergencia_nombre,
        contacto_emergencia_telefono: userData.contacto_emergencia_telefono,
        rol: userData.rol || 'paciente',
        fechaRegistro: new Date().toISOString()
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('localUsers', JSON.stringify(users));
      
      console.log("Usuario guardado localmente:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error al guardar usuario localmente:", error);
      throw error;
    }
  }

  static async getLocalUsers() {
    try {
      const users = await AsyncStorage.getItem('localUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error al obtener usuarios locales:", error);
      return [];
    }
  }

  static async getUserByEmail(email) {
    try {
      const users = await this.getLocalUsers();
      return users.find(user => user.email === email);
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      return null;
    }
  }

  // Métodos para otras entidades
  static async getEps() {
    try {
      const response = await api.get('/public/eps');
      return response.data;
    } catch (error) {
      console.error("Error al obtener EPS:", error);
      return [];
    }
  }

  static async getEspecialidades() {
    try {
      const response = await api.get('/public/especialidades');
      return response.data;
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
      return [];
    }
  }

  static async getMedicos() {
    try {
      const response = await api.get('/public/medicos');
      return response.data;
    } catch (error) {
      console.error("Error al obtener médicos:", error);
      return [];
    }
  }

  static async getConsultorios() {
    try {
      const response = await api.get('/public/consultorios');
      return response.data;
    } catch (error) {
      console.error("Error al obtener consultorios:", error);
      
      // Si hay error, devolver datos de ejemplo para que la app funcione
      return [
        { id: 1, nombre: 'Consultorio Cardiología 1', numero: '101' },
        { id: 2, nombre: 'Consultorio Dermatología 1', numero: '205' },
        { id: 3, nombre: 'Consultorio Ortopedia 1', numero: '310' },
        { id: 4, nombre: 'Consultorio Ginecología 1', numero: '415' },
        { id: 5, nombre: 'Consultorio Neurología 1', numero: '520' },
        { id: 6, nombre: 'Consultorio Pediatría 1', numero: '301' },
        { id: 7, nombre: 'Consultorio Psiquiatría 1', numero: '405' }
      ];
    }
  }

  // Método para crear médico (solo administradores)
  static async crearMedico(medicoData) {
    try {
      console.log("ApiService: Creando médico:", medicoData);
      
      const response = await api.post('/crear-medico', medicoData);
      
      if (response.data.success) {
        console.log("✅ Médico creado exitosamente:", response.data);
        return {
          success: true,
          message: response.data.message,
          medico: response.data.medico
        };
      }
      
      return {
        success: false,
        message: response.data.message || "Error al crear médico"
      };
      
    } catch (error) {
      console.error("❌ Error creando médico:", error.response?.data || error.message);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        return {
          success: false,
          message: `Errores de validación: ${errorMessages.join(', ')}`,
          errors: validationErrors
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No tienes permisos para crear médicos"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear médico en el servidor"
      };
    }
  }
}

export default ApiService;
