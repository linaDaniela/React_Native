import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EspecialidadesService from '../../src/service/EspecialidadesService';

const EditarEspecialidad = ({ route, navigation }) => {
  const { especialidad } = route.params;
  const [formData, setFormData] = useState({
    nombre: especialidad.nombre || '',
    descripcion: especialidad.descripcion || '',
    estado: especialidad.estado || 'activa',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const especialidadData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        estado: formData.estado,
      };

      console.log('Actualizando especialidad:', especialidad.id, 'con datos:', especialidadData);
      
      // Llamada real al API para actualizar
      const result = await EspecialidadesService.actualizarEspecialidad(especialidad.id, especialidadData);
      
      if (result.success) {
        console.log('✅ Especialidad actualizada exitosamente');
        Alert.alert(
          'Éxito',
          'Los datos de la especialidad han sido actualizados correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        console.log('❌ Error al actualizar especialidad:', result.message);
        Alert.alert('Error', result.message || 'No se pudo actualizar la especialidad');
      }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar especialidad:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo actualizar la especialidad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Editar Especialidad</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Información Básica */}
          <Text style={styles.sectionTitle}>Información de la Especialidad</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de la Especialidad *</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ingrese el nombre de la especialidad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              placeholder="Ingrese la descripción de la especialidad"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado</Text>
            <View style={styles.estadoContainer}>
              <TouchableOpacity
                style={[
                  styles.estadoButton,
                  formData.estado === 'activa' && styles.estadoButtonActive
                ]}
                onPress={() => handleInputChange('estado', 'activa')}
              >
                <Text style={[
                  styles.estadoButtonText,
                  formData.estado === 'activa' && styles.estadoButtonTextActive
                ]}>
                  Activa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.estadoButton,
                  formData.estado === 'inactiva' && styles.estadoButtonActive
                ]}
                onPress={() => handleInputChange('estado', 'inactiva')}
              >
                <Text style={[
                  styles.estadoButtonText,
                  formData.estado === 'inactiva' && styles.estadoButtonTextActive
                ]}>
                  Inactiva
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Información Adicional */}
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={20} color="#1976D2" />
              <Text style={styles.infoLabel}>Total de Médicos:</Text>
              <Text style={styles.infoValue}>{especialidad.totalMedicos || 0}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color="#1976D2" />
              <Text style={styles.infoLabel}>Total de Consultorios:</Text>
              <Text style={styles.infoValue}>{especialidad.totalConsultorios || 0}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#1976D2" />
              <Text style={styles.infoLabel}>ID de la Especialidad:</Text>
              <Text style={styles.infoValue}>{especialidad.id}</Text>
            </View>
          </View>

          {/* Botón de Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleGuardar}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 20,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  estadoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  estadoButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  estadoButtonActive: {
    backgroundColor: '#1976D2',
  },
  estadoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  estadoButtonTextActive: {
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditarEspecialidad;