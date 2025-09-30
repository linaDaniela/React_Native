import api from './conexion';

// Servicio para manejar médicos
export const MedicosService = {
  // Obtener todos los médicos
  async obtenerMedicos() {
    try {
      const response = await api.get('/medicos');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener médicos',
        data: []
      };
    }
  },

  // Crear nuevo médico
  async crearMedico(medicoData) {
    try {
      const response = await api.post('/medicos', medicoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear médico:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear médico'
      };
    }
  },

  // Actualizar médico
  async actualizarMedico(id, medicoData) {
    try {
      const response = await api.put(`/medicos/${id}`, medicoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar médico:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar médico'
      };
    }
  },

  // Eliminar médico
  async eliminarMedico(id) {
    try {
      const response = await api.delete(`/medicos/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar médico:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar médico'
      };
    }
  },

  // Obtener médico por ID
  async obtenerMedico(id) {
    try {
      const response = await api.get(`/medicos/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener médico:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener médico'
      };
    }
  },

  // Buscar médicos
  async buscarMedicos(query) {
    try {
      const response = await api.get(`/buscar/medicos?q=${query}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al buscar médicos:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al buscar médicos',
        data: []
      };
    }
  }
};

export default MedicosService;

