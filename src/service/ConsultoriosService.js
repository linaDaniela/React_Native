import api from './conexion';

// Servicio para manejar consultorios
export const ConsultoriosService = {
  // Probar conexión básica
  async probarConexion() {
    try {
      console.log('🧪 Probando conexión básica para Consultorios...');
      console.log('🔗 URL base:', api.defaults.baseURL);
      console.log('🔑 Headers:', api.defaults.headers);
      
      const response = await api.get('/consultorios');
      console.log('✅ Conexión exitosa para Consultorios');
      console.log('📊 Status:', response.status);
      console.log('📈 Datos:', response.data);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Error de conexión para Consultorios:', error);
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

  // Obtener todos los consultorios
  async obtenerConsultorios() {
    try {
      const response = await api.get('/consultorios');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener consultorios:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener consultorios',
        data: []
      };
    }
  },

  // Crear nuevo consultorio
  async crearConsultorio(consultorioData) {
    try {
      console.log('📤 Datos que se envían al servidor:', JSON.stringify(consultorioData, null, 2));
      const response = await api.post('/consultorios', consultorioData);
      console.log('✅ Respuesta del servidor:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error al crear consultorio:', error);
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Obtener mensajes de error más específicos
      let errorMessage = 'Error al crear consultorio';
      if (error.response?.data?.errors) {
        // Manejar errores específicos de validación
        const errors = error.response.data.errors;
        
        if (errors.numero && errors.numero.includes('The numero has already been taken.')) {
          errorMessage = 'El número del consultorio ya existe. Por favor, elige un número diferente.';
        } else if (errors.nombre && errors.nombre.includes('The nombre has already been taken.')) {
          errorMessage = 'El nombre del consultorio ya existe. Por favor, elige un nombre diferente.';
        } else {
          // Si hay otros errores de validación específicos
          const validationErrors = Object.values(errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  // Actualizar consultorio
  async actualizarConsultorio(id, consultorioData) {
    try {
      const response = await api.put(`/consultorios/${id}`, consultorioData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar consultorio'
      };
    }
  },

  // Eliminar consultorio
  async eliminarConsultorio(id) {
    try {
      const response = await api.delete(`/consultorios/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar consultorio:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar consultorio'
      };
    }
  },

  // Obtener consultorio por ID
  async obtenerConsultorio(id) {
    try {
      const response = await api.get(`/consultorios/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener consultorio:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener consultorio'
      };
    }
  }
};

export default ConsultoriosService;

