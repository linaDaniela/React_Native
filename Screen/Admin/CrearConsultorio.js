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
import { useNavigation } from '@react-navigation/native';
import ConsultoriosService from '../../src/service/ConsultoriosService';

export default function CrearConsultorio() {
  const navigation = useNavigation();
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

  // Cargar consultorios existentes al montar el componente
  useEffect(() => {
    cargarConsultoriosExistentes();
  }, []);

  const cargarConsultoriosExistentes = async () => {
    try {
      const result = await ConsultoriosService.obtenerConsultorios();
      if (result.success) {
        setConsultoriosExistentes(result.data);
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

  const sugerirNumeroDisponible = () => {
    const numerosExistentes = consultoriosExistentes.map(c => c.numero);
    let numeroSugerido = 1;
    
    // Buscar el primer número disponible
    while (numerosExistentes.includes(numeroSugerido.toString())) {
      numeroSugerido++;
    }
    
    return numeroSugerido.toString();
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

    // Validar que el número no esté duplicado
    const numeroExiste = consultoriosExistentes.some(c => c.numero === formData.numero.trim());
    if (numeroExiste) {
      const numeroSugerido = sugerirNumeroDisponible();
      Alert.alert(
        'Número Duplicado', 
        `El número ${formData.numero} ya existe. ¿Te gustaría usar el número ${numeroSugerido}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Usar Sugerido', 
            onPress: () => {
              setFormData(prev => ({ ...prev, numero: numeroSugerido }));
            }
          }
        ]
      );
      return false;
    }

    return true;
  };

  const handleCrearConsultorio = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
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

      console.log('Creando consultorio:', consultorioData);
      
      const result = await ConsultoriosService.crearConsultorio(consultorioData);
      
      if (result.success) {
        console.log('✅ Consultorio creado exitosamente');
        Alert.alert(
          'Éxito',
          'Consultorio creado correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ Error al crear consultorio:', result.message);
        console.log('📋 Detalles del error:', result.details);
        
        // Mostrar mensaje de error más detallado
        let errorMessage = result.message || 'No se pudo crear el consultorio';
        if (result.details?.errors) {
          // Si hay errores de validación específicos, mostrarlos
          const validationErrors = Object.values(result.details.errors).flat();
          errorMessage = `Errores de validación:\n${validationErrors.join('\n')}`;
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error inesperado al crear consultorio:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo crear el consultorio.');
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
        <Text style={styles.headerTitle}>Crear Consultorio</Text>
        <TouchableOpacity onPress={handleCrearConsultorio} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información del Consultorio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Consultorio</Text>
          
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
              placeholder={`Ej: ${sugerirNumeroDisponible()}`}
            />
            <Text style={styles.helpText}>
              Sugerencia: {sugerirNumeroDisponible()} (primer número disponible)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Piso</Text>
            <TextInput
              style={styles.textInput}
              value={formData.piso}
              onChangeText={(value) => handleInputChange('piso', value)}
              placeholder="Ej: 1"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Edificio</Text>
            <TextInput
              style={styles.textInput}
              value={formData.edificio}
              onChangeText={(value) => handleInputChange('edificio', value)}
              placeholder="Ej: Torre A"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección</Text>
            <TextInput
              style={styles.textInput}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Ej: Hospital Central - Torre A, Piso 1"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.textInput}
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              placeholder="Ej: (601) 101-1001"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Capacidad de Pacientes *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.capacidad_pacientes}
              onChangeText={(value) => handleInputChange('capacidad_pacientes', value)}
              placeholder="Ej: 1"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Equipos Médicos</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.equipos_medicos}
              onChangeText={(value) => handleInputChange('equipos_medicos', value)}
              placeholder="Ej: Electrocardiógrafo, Ecógrafo cardiaco"
              multiline
              numberOfLines={3}
            />
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
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButtonLarge, loading && styles.saveButtonDisabled]} 
            onPress={handleCrearConsultorio}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Creando...' : 'Crear Consultorio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
