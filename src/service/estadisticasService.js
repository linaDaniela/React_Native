import api from './conexion';

export const estadisticasService = {
  // Obtener estadísticas generales del sistema (admin)
  getEstadisticas: async () => {
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

  // Obtener estadísticas específicas por entidad (métodos alternativos)
  getEstadisticasMedicos: async () => {
    try {
      const response = await api.get('/medicos');
      if (response.data.success) {
        const medicos = response.data.data || [];
        return {
          total: medicos.length,
          activos: medicos.filter(m => m.activo === 1 || m.activo === true).length,
          inactivos: medicos.filter(m => m.activo === 0 || m.activo === false).length
        };
      }
      return { total: 0, activos: 0, inactivos: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de médicos:', error);
      return { total: 0, activos: 0, inactivos: 0 };
    }
  },

  getEstadisticasPacientes: async () => {
    try {
      const response = await api.get('/pacientes');
      if (response.data.success) {
        const pacientes = response.data.data || [];
        return {
          total: pacientes.length,
          activos: pacientes.filter(p => p.activo === 1 || p.activo === true).length,
          inactivos: pacientes.filter(p => p.activo === 0 || p.activo === false).length
        };
      }
      return { total: 0, activos: 0, inactivos: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de pacientes:', error);
      return { total: 0, activos: 0, inactivos: 0 };
    }
  },

  getEstadisticasCitas: async () => {
    try {
      const response = await api.get('/citas');
      if (response.data.success) {
        const citas = response.data.data || [];
        const hoy = new Date().toISOString().split('T')[0];
        
        return {
          total: citas.length,
          hoy: citas.filter(c => c.fecha === hoy).length,
          programadas: citas.filter(c => c.estado === 'programada').length,
          confirmadas: citas.filter(c => c.estado === 'confirmada').length,
          completadas: citas.filter(c => c.estado === 'completada').length,
          canceladas: citas.filter(c => c.estado === 'cancelada').length
        };
      }
      return { total: 0, hoy: 0, programadas: 0, confirmadas: 0, completadas: 0, canceladas: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de citas:', error);
      return { total: 0, hoy: 0, programadas: 0, confirmadas: 0, completadas: 0, canceladas: 0 };
    }
  },

  getEstadisticasEspecialidades: async () => {
    try {
      const response = await api.get('/especialidades');
      if (response.data.success) {
        const especialidades = response.data.data || [];
        return {
          total: especialidades.length
        };
      }
      return { total: 0 };
    } catch (error) {
      console.error('Error al obtener estadísticas de especialidades:', error);
      return { total: 0 };
    }
  },

};
