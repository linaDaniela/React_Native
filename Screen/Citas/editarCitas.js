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

export default function EditarCitas() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cita } = route.params || {};

  // Estados del formulario
  const [formData, setFormData] = useState({
    paciente: '',
    medico: '',
    especialidad: '',
    fecha: '',
    hora: '',
    estado: 'Programada',
    motivo: '',
    observaciones: '',
  });

  // Estados para modales
  const [showMedicosModal, setShowMedicosModal] = useState(false);
  const [showEspecialidadesModal, setShowEspecialidadesModal] = useState(false);
  const [showEstadosModal, setShowEstadosModal] = useState(false);

  // Datos de ejemplo
  const medicos = [
    { id: '1', nombre: 'Dr. Carlos García', especialidad: 'Cardiología' },
    { id: '2', nombre: 'Dra. Ana Martínez', especialidad: 'Dermatología' },
    { id: '3', nombre: 'Dr. Luis Fernández', especialidad: 'Ortopedia' },
    { id: '4', nombre: 'Dra. Carmen Ruiz', especialidad: 'Ginecología' },
    { id: '5', nombre: 'Dr. Miguel Torres', especialidad: 'Neurología' },
  ];

  const especialidades = [
    'Cardiología',
    'Dermatología',
    'Ortopedia',
    'Ginecología',
    'Neurología',
  ];

  const estados = ['Programada', 'Completada', 'Cancelada', 'Reprogramada'];

  useEffect(() => {
    if (cita) {
      setFormData({
        paciente: cita.paciente || '',
        medico: cita.medico || '',
        especialidad: cita.especialidad || '',
        fecha: cita.fecha || '',
        hora: cita.hora || '',
        estado: cita.estado || 'Programada',
        motivo: cita.motivo || '',
        observaciones: cita.observaciones || '',
      });
    }
  }, [cita]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validaciones
    if (!formData.paciente.trim()) {
      Alert.alert('Error', 'El nombre del paciente es requerido');
      return;
    }
    if (!formData.medico.trim()) {
      Alert.alert('Error', 'Debe seleccionar un médico');
      return;
    }
    if (!formData.fecha.trim()) {
      Alert.alert('Error', 'La fecha es requerida');
      return;
    }
    if (!formData.hora.trim()) {
      Alert.alert('Error', 'La hora es requerida');
      return;
    }

    // Simular guardado
    Alert.alert(
      'Éxito',
      'Cita actualizada correctamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
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

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleInputChange('medico', item.nombre);
        handleInputChange('especialidad', item.especialidad);
        setShowMedicosModal(false);
      }}
    >
      <View>
        <Text style={styles.modalItemTitle}>{item.nombre}</Text>
        <Text style={styles.modalItemSubtitle}>{item.especialidad}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEspecialidadItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleInputChange('especialidad', item);
        setShowEspecialidadesModal(false);
      }}
    >
      <Text style={styles.modalItemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEstadoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleInputChange('estado', item);
        setShowEstadosModal(false);
      }}
    >
      <Text style={styles.modalItemTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Cita</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información del Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Paciente</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Paciente</Text>
            <TextInput
              style={styles.textInput}
              value={formData.paciente}
              onChangeText={(value) => handleInputChange('paciente', value)}
              placeholder="Ingrese el nombre del paciente"
            />
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Médica</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Médico</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowMedicosModal(true)}
            >
              <Text style={[styles.selectorText, !formData.medico && styles.placeholderText]}>
                {formData.medico || 'Seleccionar médico'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Especialidad</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowEspecialidadesModal(true)}
            >
              <Text style={[styles.selectorText, !formData.especialidad && styles.placeholderText]}>
                {formData.especialidad || 'Seleccionar especialidad'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha y Hora</Text>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Fecha</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fecha}
                onChangeText={(value) => handleInputChange('fecha', value)}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Hora</Text>
              <TextInput
                style={styles.textInput}
                value={formData.hora}
                onChangeText={(value) => handleInputChange('hora', value)}
                placeholder="HH:MM"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de la Cita</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowEstadosModal(true)}
            >
              <Text style={styles.selectorText}>{formData.estado}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivo y Observaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Cita</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Motivo de la Consulta</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.motivo}
              onChangeText={(value) => handleInputChange('motivo', value)}
              placeholder="Describa el motivo de la consulta"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Observaciones</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.observaciones}
              onChangeText={(value) => handleInputChange('observaciones', value)}
              placeholder="Observaciones adicionales (opcional)"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Médicos */}
      <Modal
        visible={showMedicosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedicosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Médico</Text>
              <TouchableOpacity onPress={() => setShowMedicosModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={medicos}
              renderItem={renderMedicoItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Especialidades */}
      <Modal
        visible={showEspecialidadesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEspecialidadesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
              <TouchableOpacity onPress={() => setShowEspecialidadesModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={especialidades}
              renderItem={renderEspecialidadItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Estados */}
      <Modal
        visible={showEstadosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEstadosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadosModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={estados}
              renderItem={renderEstadoItem}
              keyExtractor={(item) => item}
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
  placeholderText: {
    color: '#999',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
