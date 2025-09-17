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

export default function EditarEps() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eps } = route.params || {};

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    representanteLegal: '',
    telefonoRepresentante: '',
    emailRepresentante: '',
    tipoEps: '',
    estado: 'Activa',
    fechaAfiliacion: '',
    observaciones: '',
  });

  // Estados para modales
  const [showTipoEpsModal, setShowTipoEpsModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // Datos de ejemplo
  const tiposEps = [
    'Contributiva',
    'Subsidiada',
    'Mixta',
    'Regimen Especial',
  ];

  const estados = ['Activa', 'Inactiva', 'Suspendida', 'En Proceso'];

  useEffect(() => {
    if (eps) {
      setFormData({
        nombre: eps.nombre || '',
        nit: eps.nit || '',
        direccion: eps.direccion || '',
        telefono: eps.telefono || '',
        email: eps.email || '',
        sitioWeb: eps.sitioWeb || '',
        representanteLegal: eps.representanteLegal || '',
        telefonoRepresentante: eps.telefonoRepresentante || '',
        emailRepresentante: eps.emailRepresentante || '',
        tipoEps: eps.tipoEps || '',
        estado: eps.estado || 'Activa',
        fechaAfiliacion: eps.fechaAfiliacion || '',
        observaciones: eps.observaciones || '',
      });
    }
  }, [eps]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la EPS es requerido');
      return;
    }
    if (!formData.nit.trim()) {
      Alert.alert('Error', 'El NIT es requerido');
      return;
    }
    if (!formData.direccion.trim()) {
      Alert.alert('Error', 'La dirección es requerida');
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
    if (!formData.representanteLegal.trim()) {
      Alert.alert('Error', 'El representante legal es requerido');
      return;
    }
    if (!formData.tipoEps.trim()) {
      Alert.alert('Error', 'Debe seleccionar el tipo de EPS');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Ingrese un email válido');
      return;
    }

    if (formData.emailRepresentante && !emailRegex.test(formData.emailRepresentante)) {
      Alert.alert('Error', 'Ingrese un email válido para el representante');
      return;
    }

    // Simular guardado
    Alert.alert(
      'Éxito',
      'Información de la EPS actualizada correctamente',
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

  const renderTipoEpsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleInputChange('tipoEps', item);
        setShowTipoEpsModal(false);
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
        setShowEstadoModal(false);
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
        <Text style={styles.headerTitle}>Editar EPS</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información de la EPS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la EPS</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de la EPS *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Nombre de la entidad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NIT *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nit}
              onChangeText={(value) => handleInputChange('nit', value)}
              placeholder="Número de identificación tributaria"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección *</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Dirección principal"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.telefono}
                onChangeText={(value) => handleInputChange('telefono', value)}
                placeholder="Teléfono principal"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="correo@eps.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sitio Web</Text>
            <TextInput
              style={styles.textInput}
              value={formData.sitioWeb}
              onChangeText={(value) => handleInputChange('sitioWeb', value)}
              placeholder="https://www.eps.com"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Información del Representante Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Representante Legal</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Representante *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.representanteLegal}
              onChangeText={(value) => handleInputChange('representanteLegal', value)}
              placeholder="Nombre completo del representante"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.textInput}
                value={formData.telefonoRepresentante}
                onChangeText={(value) => handleInputChange('telefonoRepresentante', value)}
                placeholder="Teléfono del representante"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.emailRepresentante}
                onChangeText={(value) => handleInputChange('emailRepresentante', value)}
                placeholder="correo@representante.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Clasificación y Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clasificación y Estado</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo de EPS *</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={() => setShowTipoEpsModal(true)}
            >
              <Text style={[styles.selectorText, !formData.tipoEps && styles.placeholderText]}>
                {formData.tipoEps || 'Seleccionar tipo'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Estado</Text>
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
              value={formData.fechaAfiliacion}
              onChangeText={(value) => handleInputChange('fechaAfiliacion', value)}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
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
              placeholder="Información adicional sobre la EPS"
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

      {/* Modal de Tipo de EPS */}
      <Modal
        visible={showTipoEpsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTipoEpsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Tipo de EPS</Text>
              <TouchableOpacity onPress={() => setShowTipoEpsModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={tiposEps}
              renderItem={renderTipoEpsItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Estados */}
      <Modal
        visible={showEstadoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Estado</Text>
              <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
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
});
