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
import MedicosService from '../../src/service/MedicosService';

export default function EditarMedico() {
  const navigation = useNavigation();
  const route = useRoute();
  const { medico } = route.params || {};

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: '',
    horario: '',
    experiencia: '',
    consultorio: '',
    observaciones: '',
  });

  // Estados para modales
  const [showEspecialidadesModal, setShowEspecialidadesModal] = useState(false);
  const [showConsultoriosModal, setShowConsultoriosModal] = useState(false);
  const [consultoriosList, setConsultoriosList] = useState([]);

  // Datos de ejemplo
  const especialidades = [
    'Cardiología',
    'Dermatología',
    'Ortopedia',
    'Ginecología',
    'Neurología',
  ];

  const horarios = [
    'Lunes a Viernes: 8:00 AM - 5:00 PM',
    'Lunes a Viernes: 9:00 AM - 6:00 PM',
    'Lunes a Viernes: 7:00 AM - 4:00 PM',
    'Lunes a Sábado: 8:00 AM - 2:00 PM',
    'Lunes a Jueves: 8:00 AM - 5:00 PM, Viernes: 8:00 AM - 2:00 PM',
  ];

  useEffect(() => {
    loadConsultorios();
  }, []);

  const loadConsultorios = async () => {
    try {
      console.log('Cargando consultorios disponibles...');
      const result = await ConsultoriosService.obtenerConsultorios();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Consultorios cargados:', result.data.length);
        setConsultoriosList(result.data);
      } else {
        console.log('❌ No se pudieron cargar los consultorios:', result.message);
        // Mostrar consultorios de ejemplo si no se pueden cargar
        setConsultoriosList([
          { id: 1, nombre: 'Consultorio 101', ubicacion: 'Piso 1 - Ala Norte' },
          { id: 2, nombre: 'Consultorio 205', ubicacion: 'Piso 2 - Ala Sur' },
          { id: 3, nombre: 'Consultorio 310', ubicacion: 'Piso 3 - Ala Norte' },
          { id: 4, nombre: 'Consultorio 415', ubicacion: 'Piso 4 - Ala Sur' },
          { id: 5, nombre: 'Consultorio 520', ubicacion: 'Piso 5 - Ala Norte' }
        ]);
      }
    } catch (error) {
      console.error('Error cargando consultorios:', error);
      // Mostrar consultorios de ejemplo en caso de error
      setConsultoriosList([
        { id: 1, nombre: 'Consultorio 101', ubicacion: 'Piso 1 - Ala Norte' },
        { id: 2, nombre: 'Consultorio 205', ubicacion: 'Piso 2 - Ala Sur' },
        { id: 3, nombre: 'Consultorio 310', ubicacion: 'Piso 3 - Ala Norte' },
        { id: 4, nombre: 'Consultorio 415', ubicacion: 'Piso 4 - Ala Sur' },
        { id: 5, nombre: 'Consultorio 520', ubicacion: 'Piso 5 - Ala Norte' }
      ]);
    }
  };

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre || '',
        apellido: medico.apellido || '',
        especialidad: medico.especialidad?.nombre || medico.especialidad || '',
        cedula: medico.cedula || '',
        telefono: medico.telefono || '',
        email: medico.email || '',
        direccion: medico.direccion || '',
        horario: medico.horario || '',
        experiencia: medico.experiencia_anos || medico.experiencia || '',
        consultorio: medico.consultorio_id || medico.consultorio || '',
        observaciones: medico.observaciones || '',
      });
    }
  }, [medico]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return;
    }
    if (!formData.especialidad.trim()) {
      Alert.alert('Error', 'Debe seleccionar una especialidad');
      return;
    }
    if (!formData.cedula.trim()) {
      Alert.alert('Error', 'La cédula es requerida');
      return;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Ingrese un email válido');
      return;
    }

    try {
      const medicoData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        especialidad: formData.especialidad,
        cedula: formData.cedula,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        horario: formData.horario,
        experiencia_anos: formData.experiencia,
        consultorio: formData.consultorio,
        observaciones: formData.observaciones,
      };

      console.log('Actualizando médico:', medico.id, 'con datos:', medicoData);
      
      // Llamada real al API para actualizar
      const result = await MedicosService.actualizarMedico(medico.id, medicoData);
      
      if (result.success) {
        console.log('✅ Médico actualizado exitosamente');
        Alert.alert(
          'Éxito',
          'Información del médico actualizada correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ Error al actualizar médico:', result.message);
        Alert.alert('Error', result.message || 'No se pudo actualizar el médico');
      }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar médico:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo actualizar el médico.');
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

  const renderConsultorioItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleInputChange('consultorio', item.nombre);
        setShowConsultoriosModal(false);
      }}
    >
      <Text style={styles.modalItemTitle}>{item.nombre}</Text>
      <Text style={styles.modalItemSubtitle}>{item.ubicacion}</Text>
    </TouchableOpacity>
  );

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este médico?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await MedicosService.eliminarMedico(medico.id);
              if (result.success) {
                Alert.alert('Éxito', 'Médico eliminado correctamente', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error al eliminar médico:', error);
              Alert.alert('Error', 'No se pudo eliminar el médico');
            }
          },
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
        <Text style={styles.headerTitle}>Editar Médico</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Nombre *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                placeholder="Nombre"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Apellido *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
                placeholder="Apellido"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cédula *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.cedula}
              onChangeText={(value) => handleInputChange('cedula', value)}
              placeholder="Número de cédula"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Información Profesional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Profesional</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Especialidad *</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Años de Experiencia</Text>
            <TextInput
              style={styles.textInput}
              value={formData.experiencia}
              onChangeText={(value) => handleInputChange('experiencia', value)}
              placeholder="Ej: 5 años"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Consultorio</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowConsultoriosModal(true)}
            >
              <Text style={[styles.selectorText, !formData.consultorio && styles.placeholderText]}>
                {formData.consultorio || 'Seleccionar consultorio'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Dirección del consultorio"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de Atención</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horario de Trabajo</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.horario}
              onChangeText={(value) => handleInputChange('horario', value)}
              placeholder="Ej: Lunes a Viernes: 8:00 AM - 5:00 PM"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Observaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notas Adicionales</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.observaciones}
              onChangeText={(value) => handleInputChange('observaciones', value)}
              placeholder="Información adicional sobre el médico"
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

      {/* Modal de Consultorios */}
      <Modal
        visible={showConsultoriosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConsultoriosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Consultorio</Text>
              <TouchableOpacity onPress={() => setShowConsultoriosModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={consultoriosList}
              renderItem={renderConsultorioItem}
              keyExtractor={(item) => item.id.toString()}
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
    marginTop: 2,
  },
});
