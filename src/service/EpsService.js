import api from './conexion';

// Servicio para manejar EPS
export const EpsService = {
  // Obtener todas las EPS
  async obtenerEps() {
    try {
      const response = await api.get('/eps');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener EPS:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener EPS',
        data: []
      };
    }
  },

  // Crear nueva EPS
  async crearEps(epsData) {
    try {
      console.log('📤 Datos que se envían al servidor:', JSON.stringify(epsData, null, 2));
      const response = await api.post('/eps', epsData);
      console.log('✅ Respuesta del servidor:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al crear EPS:', error);
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Obtener mensajes de error más específicos
      let errorMessage = 'Error al crear EPS';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Si hay errores de validación específicos
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (error.response?.status === 422) {
        errorMessage = 'Los datos enviados no son válidos. Verifica que todos los campos requeridos estén completos.';
      }
      
      return {
        success: false,
        message: errorMessage,
        details: error.response?.data
      };
    }
  },

  // Actualizar EPS
  async actualizarEps(id, epsData) {
    try {
      const response = await api.put(`/eps/${id}`, epsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar EPS:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar EPS'
      };
    }
  },

  // Eliminar EPS
  async eliminarEps(id) {
    try {
      const response = await api.delete(`/eps/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar EPS:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar EPS'
      };
    }
  },

  // Obtener EPS por ID
  async obtenerEps(id) {
    try {
      const response = await api.get(`/eps/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener EPS:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener EPS'
      };
    }
  },

  // Obtener estadísticas de EPS
  async obtenerEstadisticasEps(epsId) {
    try {
      const response = await api.get(`/eps/${epsId}/estadisticas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de EPS:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener estadísticas',
        data: {
          total_afiliados: 0,
          total_medicos: 0,
          total_consultorios: 0,
          calificacion: 0
        }
      };
    }
  },

  // Obtener todas las EPS con estadísticas
  async obtenerEpsConEstadisticas() {
    try {
      const response = await api.get('/eps');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener EPS con estadísticas:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener EPS',
        data: []
      };
    }
  }
};

export default EpsService;
