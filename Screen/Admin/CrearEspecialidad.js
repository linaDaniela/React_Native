import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EspecialidadesService from '../../src/service/EspecialidadesService';

export default function CrearEspecialidad() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activa',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la especialidad es requerido');
      return false;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return false;
    }
    return true;
  };

  const handleCrearEspecialidad = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const especialidadData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estado: formData.estado,
      };

      console.log('Creando especialidad:', especialidadData);
      
      const result = await EspecialidadesService.crearEspecialidad(especialidadData);
      
      if (result.success) {
        console.log('✅ Especialidad creada exitosamente');
        Alert.alert(
          'Éxito',
          'Especialidad creada correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.log('❌ Error al crear especialidad:', result.message);
        Alert.alert('Error', result.message || 'No se pudo crear la especialidad');
      }
    } catch (error) {
      console.error('❌ Error inesperado al crear especialidad:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo crear la especialidad.');
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
        <Text style={styles.headerTitle}>Crear Especialidad</Text>
        <TouchableOpacity onPress={handleCrearEspecialidad} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información de la Especialidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Especialidad</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de la Especialidad *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ej: Cardiología"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descripción *</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              placeholder="Descripción detallada de la especialidad"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Estado</Text>
            <View style={styles.selectorInput}>
              <Text style={styles.selectorText}>{formData.estado}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButtonLarge, loading && styles.saveButtonDisabled]} 
            onPress={handleCrearEspecialidad}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Creando...' : 'Crear Especialidad'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    height: 100,
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
});
