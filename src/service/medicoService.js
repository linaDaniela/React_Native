import api from './conexion';

export const medicoService = {
  // Obtener citas del médico logueado
  getMisCitas: async () => {
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

  // Obtener pacientes del médico logueado
  getMisPacientes: async () => {
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

  // Obtener agenda del médico
  getMiAgenda: async () => {
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

  // Actualizar estado de una cita
  actualizarEstadoCita: async (citaId, estado) => {
    try {
      const response = await api.put(`/medico/citas/${citaId}/estado`, { estado });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al actualizar estado de cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar estado de cita' 
      };
    }
  },

  // Agregar observaciones a una cita
  agregarObservaciones: async (citaId, observaciones) => {
    try {
      const response = await api.put(`/medico/citas/${citaId}/observaciones`, { observaciones });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al agregar observaciones:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al agregar observaciones' 
      };
    }
  },

  // Obtener reportes del médico
  getReportes: async (periodo = 'hoy') => {
    try {
      const response = await api.get(`/medico/reportes?periodo=${periodo}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener reportes' 
      };
    }
  }
};
