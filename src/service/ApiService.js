import api from './conexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Servicio general para operaciones CRUD
export class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll() {
    try {
      const response = await api.get(`/${this.endpoint}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al obtener ${this.endpoint}:`, error);
      
      // Manejo específico de errores de red
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        return { 
          success: false, 
          message: 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al obtener ${this.endpoint}` 
      };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/${this.endpoint}/${id}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al obtener ${this.endpoint} por ID:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al obtener ${this.endpoint} por ID` 
      };
    }
  }

  async create(data) {
    try {
      const response = await api.post(`/${this.endpoint}`, data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al crear ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al crear ${this.endpoint}` 
      };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/${this.endpoint}/${id}`, data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al actualizar ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al actualizar ${this.endpoint}` 
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/${this.endpoint}/${id}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error(`Error al eliminar ${this.endpoint}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Error al eliminar ${this.endpoint}` 
      };
    }
  }
}

// Servicios específicos para cada entidad según las rutas de Laravel
export const administradoresService = new ApiService('administradores');
export const citasService = new ApiService('citas');
export const medicosService = new ApiService('medicos');
export const pacientesService = new ApiService('pacientes');
export const especialidadesService = new ApiService('especialidades');


// Servicio para perfil de usuario
export const profileService = {
  // Actualizar perfil del usuario
  async updateProfile(data) {
    try {
      const response = await api.put('/profile/update', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil' 
      };
    }
  },

  // Cambiar contraseña
  async changePassword(data) {
    try {
      const response = await api.put('/profile/change-password', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cambiar contraseña' 
      };
    }
  }
};

// Servicio específico para médicos según los endpoints definidos
export const medicoService = {
  // Obtener mis citas
  async getMisCitas() {
    try {
      const response = await api.get('/medico/mis-citas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mis citas' 
      };
    }
  },

  // Obtener mis pacientes
  async getMisPacientes() {
    try {
      const response = await api.get('/medico/mis-pacientes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener mis pacientes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mis pacientes' 
      };
    }
  },

  // Obtener mi agenda
  async getMiAgenda() {
    try {
      const response = await api.get('/medico/mi-agenda');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener mi agenda:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mi agenda' 
      };
    }
  },

  // Obtener reportes
  async getReportes() {
    try {
      const response = await api.get('/medico/reportes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener reportes' 
      };
    }
  },

  // Actualizar estado de cita
  async actualizarEstadoCita(id, estado) {
    try {
      const response = await api.put(`/medico/citas/${id}/estado`, { estado });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar estado de cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar estado de cita' 
      };
    }
  },

  // Agregar observaciones a cita
  async agregarObservaciones(id, observaciones) {
    try {
      const response = await api.put(`/medico/citas/${id}/observaciones`, { observaciones });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al agregar observaciones:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al agregar observaciones' 
      };
    }
  }
};

// Servicio específico para pacientes según los endpoints definidos
export const pacienteService = {
  // Obtener mis citas
  async getMisCitas() {
    try {
      const response = await api.get('/paciente/mis-citas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mis citas' 
      };
    }
  },

  // Agendar cita
  async agendarCita(data) {
    try {
      const response = await api.post('/paciente/agendar-cita', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al agendar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al agendar cita' 
      };
    }
  },

  // Cancelar cita
  async cancelarCita(id) {
    try {
      const response = await api.put(`/paciente/citas/${id}/cancelar`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cancelar cita' 
      };
    }
  },

  // Obtener mi historial
  async getMiHistorial() {
    try {
      const response = await api.get('/paciente/mi-historial');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener mi historial:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mi historial' 
      };
    }
  },

  // Obtener médicos disponibles
  async getMedicosDisponibles() {
    try {
      const response = await api.get('/paciente/medicos-disponibles');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener médicos disponibles:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener médicos disponibles' 
      };
    }
  }
};

// Servicio específico para administradores según los endpoints definidos
export const administradorService = {
  // Obtener estadísticas
  async getEstadisticas() {
    try {
      const response = await api.get('/admin/estadisticas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener estadísticas' 
      };
    }
  },

  // Obtener citas (admin)
  async getCitas() {
    try {
      const response = await api.get('/admin/citas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener citas' 
      };
    }
  },

  // Obtener médicos (admin)
  async getMedicos() {
    try {
      const response = await api.get('/admin/medicos');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener médicos' 
      };
    }
  },

  // Obtener pacientes (admin)
  async getPacientes() {
    try {
      const response = await api.get('/admin/pacientes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener pacientes' 
      };
    }
  },

  // Obtener administradores (admin)
  async getAdministradores() {
    try {
      const response = await api.get('/admin/administradores');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener administradores:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener administradores' 
      };
    }
  }
};

// Servicio de autenticación según los endpoints definidos
export const authService = {
  // Login
  async login(email, password, tipo = 'paciente') {
    try {
      console.log('Enviando datos de login:', { email, password, tipo });
      const response = await api.post('/login', { email, password, tipo });
      console.log('Respuesta del backend:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejo específico de errores de red
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        return { 
          success: false, 
          message: 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el login' 
      };
    }
  },

  // Registro de paciente
  async registerPaciente(data) {
    try {
      const response = await api.post('/register/paciente', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en registro de paciente:', error);
      
      // Manejo específico de errores de red
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        return { 
          success: false, 
          message: 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    }
  },

  // Actualizar perfil
  async updateProfile(data) {
    try {
      const response = await api.put('/profile/update', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar perfil' 
      };
    }
  },

  // Cambiar contraseña
  async changePassword(data) {
    try {
      const response = await api.put('/profile/change-password', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cambiar contraseña' 
      };
    }
  }
};

