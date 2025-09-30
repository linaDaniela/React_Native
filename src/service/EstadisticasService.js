import api from './conexion';

const EstadisticasService = {
  // Obtener estadísticas generales del sistema
  async obtenerEstadisticasGenerales() {
    try {
      console.log('📊 Calculando estadísticas generales del sistema...');
      
      // Usar directamente el cálculo manual ya que no hay endpoint dedicado
      return await this.calcularEstadisticasManuales();
    } catch (error) {
      console.error('❌ Error al calcular estadísticas generales:', error);
      
      return {
        success: false,
        message: 'Error al calcular estadísticas',
        data: {
          total_pacientes: 0,
          total_medicos: 0,
          total_citas: 0,
          total_eps: 0,
          total_consultorios: 0,
          total_especialidades: 0
        }
      };
    }
  },

  // Calcular estadísticas manualmente
  async calcularEstadisticasManuales() {
    try {
      console.log('🔢 Calculando estadísticas manualmente...');
      
      const [
        pacientesResult,
        medicosResult,
        citasResult,
        epsResult,
        consultoriosResult,
        especialidadesResult
      ] = await Promise.allSettled([
        api.get('/pacientes'),
        api.get('/medicos'),
        api.get('/citas'),
        api.get('/eps'),
        api.get('/consultorios'),
        api.get('/especialidades')
      ]);

      // Función auxiliar para obtener el conteo de forma segura
      const getCount = (result, entityName) => {
        if (result.status === 'fulfilled' && result.value?.data) {
          const count = Array.isArray(result.value.data) ? result.value.data.length : 0;
          console.log(`✅ ${entityName}: ${count}`);
          return count;
        } else {
          console.log(`⚠️ ${entityName}: Error - usando 0`);
          return 0;
        }
      };

      const estadisticas = {
        total_pacientes: getCount(pacientesResult, 'Pacientes'),
        total_medicos: getCount(medicosResult, 'Médicos'),
        total_citas: getCount(citasResult, 'Citas'),
        total_eps: getCount(epsResult, 'EPS'),
        total_consultorios: getCount(consultoriosResult, 'Consultorios'),
        total_especialidades: getCount(especialidadesResult, 'Especialidades')
      };

      console.log('✅ Estadísticas calculadas exitosamente:', estadisticas);

      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      console.error('❌ Error inesperado al calcular estadísticas:', error);
      
      return {
        success: false,
        message: 'Error al calcular estadísticas',
        data: {
          total_pacientes: 0,
          total_medicos: 0,
          total_citas: 0,
          total_eps: 0,
          total_consultorios: 0,
          total_especialidades: 0
        }
      };
    }
  },

  // Obtener estadísticas de citas por estado
  async obtenerEstadisticasCitas() {
    try {
      console.log('📅 Obteniendo estadísticas de citas...');
      
      const response = await api.get('/citas');
      const citas = response.data;
      
      const estadisticas = {
        total: citas.length,
        programadas: citas.filter(cita => cita.estado === 'programada').length,
        completadas: citas.filter(cita => cita.estado === 'completada').length,
        canceladas: citas.filter(cita => cita.estado === 'cancelada').length,
        en_progreso: citas.filter(cita => cita.estado === 'en_progreso').length
      };

      console.log('✅ Estadísticas de citas:', estadisticas);

      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de citas:', error);
      
      return {
        success: false,
        message: 'Error al obtener estadísticas de citas',
        data: {
          total: 0,
          programadas: 0,
          completadas: 0,
          canceladas: 0,
          en_progreso: 0
        }
      };
    }
  },

  // Obtener estadísticas de pacientes por EPS
  async obtenerEstadisticasPacientesPorEps() {
    try {
      console.log('👥 Obteniendo estadísticas de pacientes por EPS...');
      
      const [pacientesResult, epsResult] = await Promise.allSettled([
        api.get('/pacientes'),
        api.get('/eps')
      ]);

      if (pacientesResult.status === 'rejected' || epsResult.status === 'rejected') {
        throw new Error('Error al obtener datos de pacientes o EPS');
      }

      const pacientes = pacientesResult.value.data;
      const eps = epsResult.value.data;

      const estadisticas = eps.map(epsItem => ({
        eps_id: epsItem.id,
        eps_nombre: epsItem.nombre,
        total_pacientes: pacientes.filter(paciente => paciente.eps_id === epsItem.id).length
      }));

      console.log('✅ Estadísticas de pacientes por EPS:', estadisticas);

      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de pacientes por EPS:', error);
      
      return {
        success: false,
        message: 'Error al obtener estadísticas de pacientes por EPS',
        data: []
      };
    }
  },

  // Obtener estadísticas de médicos por especialidad
  async obtenerEstadisticasMedicosPorEspecialidad() {
    try {
      console.log('👨‍⚕️ Obteniendo estadísticas de médicos por especialidad...');
      
      const [medicosResult, especialidadesResult] = await Promise.allSettled([
        api.get('/medicos'),
        api.get('/especialidades')
      ]);

      if (medicosResult.status === 'rejected' || especialidadesResult.status === 'rejected') {
        throw new Error('Error al obtener datos de médicos o especialidades');
      }

      const medicos = medicosResult.value.data;
      const especialidades = especialidadesResult.value.data;

      const estadisticas = especialidades.map(especialidad => ({
        especialidad_id: especialidad.id,
        especialidad_nombre: especialidad.nombre,
        total_medicos: medicos.filter(medico => medico.especialidad_id === especialidad.id).length
      }));

      console.log('✅ Estadísticas de médicos por especialidad:', estadisticas);

      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de médicos por especialidad:', error);
      
      return {
        success: false,
        message: 'Error al obtener estadísticas de médicos por especialidad',
        data: []
      };
    }
  }
};

export default EstadisticasService;
