import api from './conexion';

// Servicio para manejar citas médicas
export const CitasService = {
  // Método de prueba para verificar conexión
  async probarConexion() {
    try {
      console.log('🧪 Probando conexión básica...');
      console.log('🔗 URL base:', api.defaults.baseURL);
      console.log('🔑 Headers:', api.defaults.headers);
      
      // Probar con un endpoint simple primero
      const response = await api.get('/citas');
      console.log('✅ Conexión exitosa');
      console.log('📊 Status:', response.status);
      console.log('📈 Datos:', response.data);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      console.error('📋 Error completo:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Obtener todas las citas
  async obtenerCitas() {
    try {
      console.log('📤 Solicitando citas básicas...');
      console.log('🔗 URL:', api.defaults.baseURL + '/citas');
      console.log('🔑 Token:', api.defaults.headers.Authorization ? 'Presente' : 'Ausente');
      
      const response = await api.get('/citas');
      console.log('✅ Respuesta del servidor:', response.status);
      console.log('📊 Datos recibidos:', response.data);
      console.log('📈 Cantidad de citas:', response.data?.length || 0);
      
      if (response.data?.length > 0) {
        console.log('📋 Primera cita:', JSON.stringify(response.data[0], null, 2));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al obtener citas:', error);
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Si es un error 401, el token puede estar expirado
      if (error.response?.status === 401) {
        console.error('🔑 Error de autenticación - Token puede estar expirado');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Obtener todas las citas con relaciones
  async obtenerCitasConRelaciones() {
    try {
      const response = await api.get('/citas?with=paciente,medico,especialidad');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener citas con relaciones:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Obtener todas las citas con relaciones completas
  async obtenerCitasCompletas() {
    try {
      console.log('📤 Solicitando citas con relaciones completas...');
      const response = await api.get('/citas?with=paciente,medico,especialidad,consultorio');
      console.log('✅ Citas completas obtenidas:', response.data?.length || 0);
      if (response.data?.length > 0) {
        console.log('📋 Primera cita:', JSON.stringify(response.data[0], null, 2));
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al obtener citas completas:', error);
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Crear nueva cita
  async crearCita(citaData) {
    try {
      const response = await api.post('/citas', citaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear cita:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear cita'
      };
    }
  },

  // Actualizar cita
  async actualizarCita(id, citaData) {
    try {
      console.log('=== CITAS SERVICE - ACTUALIZAR CITA ===');
      console.log('🆔 ID de cita:', id);
      console.log('📤 Datos enviados:', JSON.stringify(citaData, null, 2));
      console.log('🔗 URL:', api.defaults.baseURL + `/citas/${id}`);
      console.log('🔑 Token:', api.defaults.headers.Authorization ? 'Presente' : 'Ausente');
      
      // Validar que tenemos datos para enviar
      if (!citaData || Object.keys(citaData).length === 0) {
        console.error('❌ No hay datos para actualizar');
        return {
          success: false,
          message: 'No hay datos para actualizar'
        };
      }
      
      // Usar PATCH para actualizaciones parciales (más apropiado)
      let response;
      try {
        console.log('📤 Enviando PATCH request (actualización parcial)...');
        response = await api.patch(`/citas/${id}`, citaData);
        console.log('✅ PATCH exitoso - Status:', response.status);
      } catch (patchError) {
        console.log('⚠️ PATCH falló, intentando con PUT');
        console.log('📋 Error PATCH:', patchError.response?.status, patchError.response?.data);
        
        try {
          response = await api.put(`/citas/${id}`, citaData);
          console.log('✅ PUT exitoso - Status:', response.status);
        } catch (putError) {
          console.error('❌ Tanto PATCH como PUT fallaron');
          throw putError;
        }
      }
      
      console.log('📊 Respuesta del servidor:', response.data);
      console.log('📈 Status HTTP:', response.status);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('=== ERROR AL ACTUALIZAR CITA ===');
      console.error('❌ Error completo:', error);
      console.error('📋 Error response:', error.response);
      console.error('📋 Error data:', error.response?.data);
      console.error('📋 Error status:', error.response?.status);
      console.error('📋 Error message:', error.message);
      
      // Obtener mensaje de error más específico
      let errorMessage = 'Error al actualizar cita';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        console.log('📋 Errores de validación específicos:', error.response.data.errors);
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = `Errores de validación:\n${validationErrors.join('\n')}`;
      } else if (error.response?.status === 422) {
        errorMessage = 'Los datos enviados no son válidos. Verifica que todos los campos estén correctos.';
        console.log('📋 Datos que causaron error 422:', citaData);
      } else if (error.response?.status === 404) {
        errorMessage = 'La cita no fue encontrada.';
      } else if (error.response?.status === 401) {
        errorMessage = 'No tienes permisos para actualizar esta cita.';
      }
      
      return {
        success: false,
        message: errorMessage,
        details: error.response?.data
      };
    }
  },

  // Eliminar cita
  async eliminarCita(id) {
    try {
      const response = await api.delete(`/citas/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar cita'
      };
    }
  },

  // Obtener cita por ID
  async obtenerCita(id) {
    try {
      const response = await api.get(`/citas/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener cita:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener cita'
      };
    }
  },

  // Obtener citas por médico
  async obtenerCitasPorMedico(medicoId) {
    try {
      const response = await api.get(`/medicos/${medicoId}/citas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener citas por médico:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Obtener citas por paciente
  async obtenerCitasPorPaciente(pacienteId) {
    try {
      const response = await api.get(`/pacientes/${pacienteId}/citas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener citas por paciente:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener citas',
        data: []
      };
    }
  },

  // Cargar nombres de pacientes y médicos para citas
  async cargarNombresParaCitas(citas) {
    try {
      console.log('🔄 Cargando nombres para', citas.length, 'citas...');
      
      const citasConNombres = await Promise.all(
        citas.map(async (cita, index) => {
          console.log(`📋 Procesando cita ${index + 1}/${citas.length} - ID: ${cita.id}`);
          const nuevaCita = { ...cita };
          
          // Cargar nombre del paciente si no está disponible
          if (!cita.paciente_nombre && cita.paciente_id) {
            try {
              console.log(`👤 Cargando paciente ID: ${cita.paciente_id}`);
              const pacienteResponse = await api.get(`/pacientes/${cita.paciente_id}`);
              if (pacienteResponse.data) {
                nuevaCita.paciente_nombre = `${pacienteResponse.data.nombre} ${pacienteResponse.data.apellido || ''}`.trim();
                console.log(`✅ Paciente cargado: ${nuevaCita.paciente_nombre}`);
              }
            } catch (error) {
              console.error(`❌ Error cargando paciente ${cita.paciente_id}:`, error);
              nuevaCita.paciente_nombre = `Paciente ID: ${cita.paciente_id}`;
            }
          }
          
          // Cargar nombre del médico si no está disponible
          if (!cita.medico_nombre && cita.medico_id) {
            try {
              console.log(`👨‍⚕️ Cargando médico ID: ${cita.medico_id}`);
              const medicoResponse = await api.get(`/medicos/${cita.medico_id}`);
              if (medicoResponse.data) {
                nuevaCita.medico_nombre = `Dr. ${medicoResponse.data.nombre} ${medicoResponse.data.apellido || ''}`.trim();
                console.log(`✅ Médico cargado: ${nuevaCita.medico_nombre}`);
              }
            } catch (error) {
              console.error(`❌ Error cargando médico ${cita.medico_id}:`, error);
              nuevaCita.medico_nombre = `Médico ID: ${cita.medico_id}`;
            }
          }
          
          // Cargar nombre de especialidad si no está disponible
          if (!cita.especialidad_nombre && cita.especialidad_id) {
            try {
              console.log(`🏥 Cargando especialidad ID: ${cita.especialidad_id}`);
              const especialidadResponse = await api.get(`/especialidades/${cita.especialidad_id}`);
              if (especialidadResponse.data) {
                nuevaCita.especialidad_nombre = especialidadResponse.data.nombre;
                console.log(`✅ Especialidad cargada: ${nuevaCita.especialidad_nombre}`);
              }
            } catch (error) {
              console.error(`❌ Error cargando especialidad ${cita.especialidad_id}:`, error);
              nuevaCita.especialidad_nombre = 'Sin especialidad';
            }
          }
          
          console.log(`✅ Cita ${index + 1} procesada:`, {
            paciente: nuevaCita.paciente_nombre,
            medico: nuevaCita.medico_nombre,
            especialidad: nuevaCita.especialidad_nombre
          });
          
          return nuevaCita;
        })
      );
      
      console.log('✅ Todas las citas procesadas con nombres');
      return {
        success: true,
        data: citasConNombres
      };
    } catch (error) {
      console.error('❌ Error cargando nombres para citas:', error);
      return {
        success: false,
        message: 'Error al cargar nombres',
        data: citas
      };
    }
  }
};

export default CitasService;
