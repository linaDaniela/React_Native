import api from './conexion';

// Servicio para manejar pacientes
export const PacientesService = {
  // Obtener todos los pacientes
  async obtenerPacientes() {
    try {
      const response = await api.get('/pacientes');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener pacientes',
        data: []
      };
    }
  },

  // Crear nuevo paciente
  async crearPaciente(pacienteData) {
    try {
      const response = await api.post('/pacientes', pacienteData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear paciente:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear paciente'
      };
    }
  },

  // Actualizar paciente
  async actualizarPaciente(id, pacienteData) {
    try {
      const response = await api.put(`/pacientes/${id}`, pacienteData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar paciente'
      };
    }
  },

  // Eliminar paciente
  async eliminarPaciente(id) {
    try {
      const response = await api.delete(`/pacientes/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar paciente'
      };
    }
  },

  // Obtener citas de un paciente
  async obtenerCitasPaciente(pacienteId) {
    try {
      const response = await api.get(`/pacientes/${pacienteId}/citas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener citas del paciente:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Buscar pacientes
  async buscarPacientes(query) {
    try {
      const response = await api.get(`/buscar/pacientes?q=${query}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al buscar pacientes',
        data: []
      };
    }
  }
};

export default PacientesService;
