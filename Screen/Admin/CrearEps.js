import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EpsService from '../../src/service/EpsService';

export default function CrearEps() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showTipoEpsModal, setShowTipoEpsModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  
  const tipoEpsOptions = ['Contributiva', 'Subsidiada', 'Mixta'];
  const estadoOptions = ['Activa', 'Inactiva', 'Suspendida', 'En Proceso'];
  
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    sitio_web: '',
    representante_legal: '',
    telefono_representante: '',
    email_representante: '',
    tipo_eps: 'Contributiva',
    estado: 'Activa',
    fecha_afiliacion: '',
    total_afiliados: '',
    total_medicos: '',
    total_consultorios: '',
    calificacion: '',
    observaciones: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectTipoEps = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tipo_eps: tipo,
    }));
    setShowTipoEpsModal(false);
  };

  const handleSelectEstado = (estado) => {
    setFormData(prev => ({
      ...prev,
      estado: estado,
    }));
    setShowEstadoModal(false);
  };

  const validateForm = () => {
    // Campos requeridos según la estructura de la BD
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la EPS es requerido');
      return false;
    }
    if (!formData.nit.trim()) {
      Alert.alert('Error', 'El NIT es requerido');
      return false;
    }
    if (!formData.tipo_eps) {
      Alert.alert('Error', 'El tipo de EPS es requerido');
      return false;
    }
    if (!formData.estado) {
      Alert.alert('Error', 'El estado es requerido');
      return false;
    }

    // Validar formato del NIT (debe tener al menos 8 dígitos)
    if (formData.nit.length < 8) {
      Alert.alert('Error', 'El NIT debe tener al menos 8 dígitos');
      return false;
    }

    // Validar email si se proporciona
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'El formato del email no es válido');
        return false;
      }
    }

    // Validar email del representante si se proporciona
    if (formData.email_representante.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email_representante)) {
        Alert.alert('Error', 'El formato del email del representante no es válido');
        return false;
      }
    }

    // Validar URL del sitio web si se proporciona
    if (formData.sitio_web.trim()) {
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(formData.sitio_web)) {
        Alert.alert('Error', 'El sitio web debe ser una URL válida (ej: https://www.eps.com)');
        return false;
      }
    }

    // Validar calificación si se proporciona (debe ser entre 0.0 y 5.0)
    if (formData.calificacion && (isNaN(formData.calificacion) || formData.calificacion < 0 || formData.calificacion > 5)) {
      Alert.alert('Error', 'La calificación debe ser un número entre 0.0 y 5.0');
      return false;
    }

    // Validar números si se proporcionan
    if (formData.total_afiliados && (isNaN(formData.total_afiliados) || formData.total_afiliados < 0)) {
      Alert.alert('Error', 'El total de afiliados debe ser un número válido');
      return false;
    }

    if (formData.total_medicos && (isNaN(formData.total_medicos) || formData.total_medicos < 0)) {
      Alert.alert('Error', 'El total de médicos debe ser un número válido');
      return false;
    }

    if (formData.total_consultorios && (isNaN(formData.total_consultorios) || formData.total_consultorios < 0)) {
      Alert.alert('Error', 'El total de consultorios debe ser un número válido');
      return false;
    }

    return true;
  };

  const handleCrearEps = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const epsData = {
        nombre: formData.nombre.trim(),
        nit: formData.nit.trim(),
        direccion: formData.direccion.trim() || null,
        telefono: formData.telefono.trim() || null,
        email: formData.email.trim() || null,
        sitio_web: formData.sitio_web.trim() || null,
        representante_legal: formData.representante_legal.trim() || null,
        telefono_representante: formData.telefono_representante.trim() || null,
        email_representante: formData.email_representante.trim() || null,
        tipo_eps: formData.tipo_eps,
        estado: formData.estado,
        fecha_afiliacion: formData.fecha_afiliacion || null,
        total_afiliados: formData.total_afiliados ? parseInt(formData.total_afiliados) : 0,
        total_medicos: formData.total_medicos ? parseInt(formData.total_medicos) : 0,
        total_consultorios: formData.total_consultorios ? parseInt(formData.total_consultorios) : 0,
        calificacion: formData.calificacion ? parseFloat(formData.calificacion) : 0.0,
        observaciones: formData.observaciones.trim() || null,
      };

      console.log('Creando EPS:', epsData);
      
      const result = await EpsService.crearEps(epsData);
      
      if (result.success) {
        console.log('✅ EPS creada exitosamente');
        Alert.alert(
          'Éxito',
          'EPS creada correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ Error al crear EPS:', result.message);
        console.log('📋 Detalles del error:', result.details);
        
        // Mostrar mensaje de error más detallado
        let errorMessage = result.message || 'No se pudo crear la EPS';
        if (result.details?.errors) {
          // Si hay errores de validación específicos, mostrarlos
          const validationErrors = Object.values(result.details.errors).flat();
          errorMessage = `Errores de validación:\n${validationErrors.join('\n')}`;
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error inesperado al crear EPS:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo crear la EPS.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirmar cancelación',
      '¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear EPS</Text>
        <TouchableOpacity onPress={handleCrearEps} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de la EPS *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ej: Compensar EPS"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NIT *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nit}
              onChangeText={(value) => handleInputChange('nit', value)}
              placeholder="Ej: 900123456-1"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Dirección completa"
            />
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.textInput}
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              placeholder="Ej: (601) 234-5678"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Ej: contacto@eps.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sitio Web</Text>
            <TextInput
              style={styles.textInput}
              value={formData.sitio_web}
              onChangeText={(value) => handleInputChange('sitio_web', value)}
              placeholder="Ej: https://www.eps.com"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Información del Representante Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Representante Legal</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Representante</Text>
            <TextInput
              style={styles.textInput}
              value={formData.representante_legal}
              onChangeText={(value) => handleInputChange('representante_legal', value)}
              placeholder="Nombre completo del representante"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono del Representante</Text>
            <TextInput
              style={styles.textInput}
              value={formData.telefono_representante}
              onChangeText={(value) => handleInputChange('telefono_representante', value)}
              placeholder="Ej: (601) 987-6543"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email del Representante</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email_representante}
              onChangeText={(value) => handleInputChange('email_representante', value)}
              placeholder="Ej: representante@eps.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo de EPS *</Text>
            <TouchableOpacity 
              style={styles.selectorInput}
              onPress={() => setShowTipoEpsModal(true)}
            >
              <Text style={styles.selectorText}>{formData.tipo_eps}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Estado *</Text>
            <TouchableOpacity 
              style={styles.selectorInput}
              onPress={() => setShowEstadoModal(true)}
            >
              <Text style={styles.selectorText}>{formData.estado}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fecha de Afiliación</Text>
            <TextInput
              style={styles.textInput}
              value={formData.fecha_afiliacion}
              onChangeText={(value) => handleInputChange('fecha_afiliacion', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Total Afiliados</Text>
            <TextInput
              style={styles.textInput}
              value={formData.total_afiliados}
              onChangeText={(value) => handleInputChange('total_afiliados', value)}
              placeholder="Ej: 1000000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Total Médicos</Text>
            <TextInput
              style={styles.textInput}
              value={formData.total_medicos}
              onChangeText={(value) => handleInputChange('total_medicos', value)}
              placeholder="Ej: 5000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Total Consultorios</Text>
            <TextInput
              style={styles.textInput}
              value={formData.total_consultorios}
              onChangeText={(value) => handleInputChange('total_consultorios', value)}
              placeholder="Ej: 250"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calificación (0.0-5.0)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.calificacion}
              onChangeText={(value) => handleInputChange('calificacion', value)}
              placeholder="Ej: 4.5"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Observaciones</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.observaciones}
              onChangeText={(value) => handleInputChange('observaciones', value)}
              placeholder="Observaciones adicionales"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButtonLarge, loading && styles.saveButtonDisabled]} 
            onPress={handleCrearEps}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Creando...' : 'Crear EPS'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para seleccionar Tipo de EPS */}
      <Modal
        visible={showTipoEpsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTipoEpsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Tipo de EPS</Text>
              <TouchableOpacity onPress={() => setShowTipoEpsModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={tipoEpsOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSelectTipoEps(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {formData.tipo_eps === item && (
                    <Ionicons name="checkmark" size={20} color="#1976D2" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar Estado */}
      <Modal
        visible={showEstadoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={estadoOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSelectEstado(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {formData.estado === item && (
                    <Ionicons name="checkmark" size={20} color="#1976D2" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  saveButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selectorInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonLarge: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1976D2',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
});
