import api from './conexion';

export const pacienteService = {
  // Obtener citas del paciente logueado
  getMisCitas: async (pacienteId = 1) => {
    try {
      const response = await api.get(`/paciente/mis-citas?paciente_id=${pacienteId}`);
      console.log('🔍 getMisCitas - Respuesta completa:', response.data);
      
      // El backend devuelve { success: true, data: [...] }
      if (response.data.success) {
        return { success: true, data: response.data.data || [] };
      } else {
        return { success: false, message: response.data.message || 'Error al obtener citas' };
      }
    } catch (error) {
      console.error('Error al obtener mis citas:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mis citas' 
      };
    }
  },

  // Agendar nueva cita
  agendarCita: async (citaData) => {
    try {
      const response = await api.post('/paciente/agendar-cita', citaData);
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
  cancelarCita: async (citaId) => {
    try {
      const response = await api.put(`/paciente/citas/${citaId}/cancelar`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al cancelar cita' 
      };
    }
  },

  // Obtener próxima cita del paciente
  getProximaCita: async (pacienteId = 1) => {
    try {
      const response = await api.get(`/paciente/proxima-cita?paciente_id=${pacienteId}`);
      console.log('🔍 getProximaCita - Respuesta completa:', response.data);
      
      // El backend devuelve { success: true, data: {...} }
      if (response.data.success) {
        return { success: true, data: response.data.data || null };
      } else {
        return { success: false, message: response.data.message || 'Error al obtener próxima cita' };
      }
    } catch (error) {
      console.error('Error al obtener próxima cita:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener próxima cita' 
      };
    }
  },

  // Obtener historial médico
  getMiHistorial: async (pacienteId = 1) => {
    try {
      const response = await api.get(`/paciente/mi-historial?paciente_id=${pacienteId}`);
      console.log('🔍 getMiHistorial - Respuesta completa:', response.data);
      
      // El backend devuelve { success: true, data: [...] }
      if (response.data.success) {
        return { success: true, data: response.data.data || [] };
      } else {
        return { success: false, message: response.data.message || 'Error al obtener historial' };
      }
    } catch (error) {
      console.error('Error al obtener mi historial:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener mi historial' 
      };
    }
  },

  // Obtener médicos disponibles
  getMedicosDisponibles: async () => {
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
