import api from './conexion';

// Servicio para manejar especialidades
export const EspecialidadesService = {
  // Obtener todas las especialidades
  async obtenerEspecialidades() {
    try {
      // Primero intentar con autenticación
      const response = await api.get('/especialidades');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.log('Error con autenticación, intentando ruta pública...');
      try {
        // Si falla, intentar con ruta pública
        const response = await api.get('/public/especialidades');
        return {
          success: true,
          data: response.data
        };
      } catch (publicError) {
        console.error('Error al obtener especialidades:', publicError);
        return {
          success: false,
          message: publicError.response?.data?.message || 'Error al obtener especialidades',
          data: []
        };
      }
    }
  },

  // Obtener especialidades públicas (sin autenticación)
  async obtenerEspecialidadesPublicas() {
    try {
      const response = await api.get('/public/especialidades');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener especialidades públicas:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener especialidades',
        data: []
      };
    }
  },

  // Crear nueva especialidad
  async crearEspecialidad(especialidadData) {
    try {
      const response = await api.post('/especialidades', especialidadData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear especialidad'
      };
    }
  },

  // Actualizar especialidad
  async actualizarEspecialidad(id, especialidadData) {
    try {
      const response = await api.put(`/especialidades/${id}`, especialidadData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar especialidad'
      };
    }
  },

  // Eliminar especialidad
  async eliminarEspecialidad(id) {
    try {
      const response = await api.delete(`/especialidades/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar especialidad'
      };
    }
  },

  // Obtener médicos por especialidad
  async obtenerMedicosPorEspecialidad(especialidadId) {
    try {
      const response = await api.get(`/especialidades/${especialidadId}/medicos`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener médicos por especialidad:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener médicos',
        data: []
      };
    }
  }
};

export default EspecialidadesService;
