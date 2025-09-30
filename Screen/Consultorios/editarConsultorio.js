import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import ConsultoriosService from '../../src/service/ConsultoriosService';

export default function EditarConsultorio() {
  const navigation = useNavigation();
  const route = useRoute();
  const { consultorio } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [consultoriosExistentes, setConsultoriosExistentes] = useState([]);
  
  const estadoOptions = ['disponible', 'ocupado', 'mantenimiento'];
  
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    piso: '',
    edificio: '',
    direccion: '',
    telefono: '',
    capacidad_pacientes: '1',
    equipos_medicos: '',
    estado: 'disponible',
  });

  // Cargar datos del consultorio y consultorios existentes
  useEffect(() => {
    if (consultorio) {
      setFormData({
        nombre: consultorio.nombre || '',
        numero: consultorio.numero || '',
        piso: consultorio.piso || '',
        edificio: consultorio.edificio || '',
        direccion: consultorio.direccion || '',
        telefono: consultorio.telefono || '',
        capacidad_pacientes: consultorio.capacidad_pacientes?.toString() || '1',
        equipos_medicos: consultorio.equipos_medicos || '',
        estado: consultorio.estado || 'disponible',
      });
    }
    cargarConsultoriosExistentes();
  }, [consultorio]);

  const cargarConsultoriosExistentes = async () => {
    try {
      const result = await ConsultoriosService.obtenerConsultorios();
      if (result.success) {
        // Filtrar el consultorio actual para evitar conflictos de validación
        const otrosConsultorios = result.data.filter(c => c.id !== consultorio?.id);
        setConsultoriosExistentes(otrosConsultorios);
      }
    } catch (error) {
      console.error('Error al cargar consultorios existentes:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
      Alert.alert('Error', 'El nombre del consultorio es requerido');
      return false;
    }
    if (!formData.numero.trim()) {
      Alert.alert('Error', 'El número del consultorio es requerido');
      return false;
    }

    // Validar capacidad numérica
    if (isNaN(formData.capacidad_pacientes) || parseInt(formData.capacidad_pacientes) <= 0) {
      Alert.alert('Error', 'La capacidad debe ser un número mayor a 0');
      return false;
    }

    // Validar que el número no esté duplicado (excluyendo el consultorio actual)
    const numeroExiste = consultoriosExistentes.some(c => c.numero === formData.numero.trim());
    if (numeroExiste) {
      Alert.alert('Error', 'El número del consultorio ya existe. Por favor, elige un número diferente.');
      return false;
    }

    return true;
  };

  const handleActualizarConsultorio = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Preparar datos para enviar al servidor
      const consultorioData = {
        nombre: formData.nombre.trim(),
        numero: formData.numero.trim(),
        piso: formData.piso.trim() || null,
        edificio: formData.edificio.trim() || null,
        direccion: formData.direccion.trim() || null,
        telefono: formData.telefono.trim() || null,
        capacidad_pacientes: parseInt(formData.capacidad_pacientes),
        equipos_medicos: formData.equipos_medicos.trim() || null,
        estado: formData.estado,
      };

      console.log('=== ACTUALIZANDO CONSULTORIO ===');
      console.log('ID del consultorio:', consultorio.id);
      console.log('Datos a enviar:', consultorioData);

      const result = await ConsultoriosService.actualizarConsultorio(consultorio.id, consultorioData);
      
      if (result.success) {
        console.log('✅ Consultorio actualizado exitosamente');
        Alert.alert(
          'Éxito',
          'Consultorio actualizado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ Error al actualizar consultorio:', result.message);
        Alert.alert('Error', result.message || 'No se pudo actualizar el consultorio');
      }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar consultorio:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo actualizar el consultorio.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirmar cancelación',
      '¿Estás seguro de que deseas cancelar los cambios?',
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

  const renderEstadoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectEstado(item)}
    >
      <Text style={styles.modalItemTitle}>{item}</Text>
      {formData.estado === item && (
        <Ionicons name="checkmark" size={20} color="#1976D2" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Consultorio</Text>
        <TouchableOpacity onPress={handleActualizarConsultorio} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Consultorio *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ej: Consultorio Cardiología 1"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Número del Consultorio *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.numero}
              onChangeText={(value) => handleInputChange('numero', value)}
              placeholder="Ej: 101"
              keyboardType="numeric"
            />
            <Text style={styles.helpText}>
              Número único que identifica el consultorio
            </Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Piso</Text>
              <TextInput
                style={styles.textInput}
                value={formData.piso}
                onChangeText={(value) => handleInputChange('piso', value)}
                placeholder="Ej: 1"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Edificio</Text>
              <TextInput
                style={styles.textInput}
                value={formData.edificio}
                onChangeText={(value) => handleInputChange('edificio', value)}
                placeholder="Ej: Norte"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección</Text>
            <TextInput
              style={styles.textInput}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Dirección completa del consultorio"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.textInput}
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Capacidad y Equipos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capacidad y Equipos</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Capacidad de Pacientes *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.capacidad_pacientes}
              onChangeText={(value) => handleInputChange('capacidad_pacientes', value)}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Equipos Médicos</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.equipos_medicos}
              onChangeText={(value) => handleInputChange('equipos_medicos', value)}
              placeholder="Describa los equipos disponibles"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Consultorio</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowEstadoModal(true)}
            >
              <Text style={styles.selectorText}>{formData.estado}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButtonLarge, loading && styles.saveButtonDisabled]} 
            onPress={handleActualizarConsultorio}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Actualizando...' : 'Actualizar Consultorio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Estados */}
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
              renderItem={renderEstadoItem}
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
