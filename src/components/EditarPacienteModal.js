import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { pacientesService } from '../service/ApiService';

const EditarPacienteModal = ({ visible, onClose, paciente, onPacienteUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    tipo_documento: '',
    numero_documento: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && paciente) {
      setFormData({
        nombre: paciente.nombre || '',
        apellido: paciente.apellido || '',
        email: paciente.email || '',
        telefono: paciente.telefono || '',
        fecha_nacimiento: paciente.fecha_nacimiento || '',
        tipo_documento: paciente.tipo_documento || '',
        numero_documento: paciente.numero_documento || '',
        direccion: paciente.direccion || ''
      });
    }
  }, [visible, paciente]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio');
      return;
    }
    if (!formData.fecha_nacimiento.trim()) {
      Alert.alert('Error', 'La fecha de nacimiento es obligatoria');
      return;
    }
    if (!formData.tipo_documento.trim()) {
      Alert.alert('Error', 'El tipo de documento es obligatorio');
      return;
    }
    if (!formData.numero_documento.trim()) {
      Alert.alert('Error', 'El número de documento es obligatorio');
      return;
    }
    if (!formData.direccion.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return;
    }

    setLoading(true);
    try {
      const response = await pacientesService.update(paciente.id, formData);
      if (response.success) {
        Alert.alert('Éxito', 'Paciente actualizado exitosamente');
        onPacienteUpdated();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar paciente');
      }
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      Alert.alert('Error', 'Error al actualizar paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Paciente</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                placeholder="Ej: María"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido *</Text>
              <TextInput
                style={styles.input}
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
                placeholder="Ej: García"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Ej: maria.garcia@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={styles.input}
                value={formData.telefono}
                onChangeText={(value) => handleInputChange('telefono', value)}
                placeholder="Ej: 300-123-4567"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de Nacimiento *</Text>
              <TextInput
                style={styles.input}
                value={formData.fecha_nacimiento}
                onChangeText={(value) => handleInputChange('fecha_nacimiento', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Documento *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.documentTypeContainer}>
                {['CC', 'TI', 'CE', 'RC', 'PA'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.documentTypeButton,
                      formData.tipo_documento === tipo && styles.documentTypeButtonSelected
                    ]}
                    onPress={() => handleInputChange('tipo_documento', tipo)}
                  >
                    <Text style={[
                      styles.documentTypeButtonText,
                      formData.tipo_documento === tipo && styles.documentTypeButtonTextSelected
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de Documento *</Text>
              <TextInput
                style={styles.input}
                value={formData.numero_documento}
                onChangeText={(value) => handleInputChange('numero_documento', value)}
                placeholder="Ej: 12345678"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.direccion}
                onChangeText={(value) => handleInputChange('direccion', value)}
                placeholder="Ej: Calle 123 #45-67"
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Actualizar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  documentTypeContainer: {
    flexDirection: 'row',
  },
  documentTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  documentTypeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  documentTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  documentTypeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditarPacienteModal;