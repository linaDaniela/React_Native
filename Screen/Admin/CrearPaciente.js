import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../src/service/ApiService';

export default function CrearPaciente({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [epsList, setEpsList] = useState([]);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    eps_id: '',
    tipo_afiliacion: '',
    numero_afiliacion: '',
    grupo_sanguineo: '',
    alergias: '',
    medicamentos_actuales: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    usuario: '',
    password: '',
    confirmar_password: ''
  });

  useEffect(() => {
    loadEpsData();
  }, []);

  const loadEpsData = async () => {
    try {
      console.log('Cargando EPS disponibles...');
      const result = await ApiService.getEps();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ EPS cargadas:', result.data.length);
        setEpsList(result.data);
      } else {
        console.log('❌ No se pudieron cargar las EPS:', result.message);
        // Mostrar EPS de ejemplo si no se pueden cargar
        setEpsList([
          { id: 1, nombre: 'EPS Sura' },
          { id: 2, nombre: 'EPS Sanitas' },
          { id: 3, nombre: 'EPS Compensar' },
          { id: 4, nombre: 'EPS Famisanar' },
          { id: 5, nombre: 'EPS Coomeva' }
        ]);
        Alert.alert(
          'Advertencia', 
          'No se pudieron cargar las EPS desde el servidor. Se muestran EPS de ejemplo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error cargando EPS:', error);
      // Mostrar EPS de ejemplo en caso de error
      setEpsList([
        { id: 1, nombre: 'EPS Sura' },
        { id: 2, nombre: 'EPS Sanitas' },
        { id: 3, nombre: 'EPS Compensar' },
        { id: 4, nombre: 'EPS Famisanar' },
        { id: 5, nombre: 'EPS Coomeva' }
      ]);
      Alert.alert(
        'Advertencia', 
        'Error de conexión. Se muestran EPS de ejemplo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'nombre', 'apellido', 'cedula', 'fecha_nacimiento', 
      'email', 'eps_id', 'tipo_afiliacion', 'usuario', 'password'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        Alert.alert('Error', `El campo ${field} es requerido`);
        return false;
      }
    }
    
    if (formData.password !== formData.confirmar_password) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const pacienteData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        fecha_nacimiento: formData.fecha_nacimiento,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        eps_id: parseInt(formData.eps_id),
        tipo_afiliacion: formData.tipo_afiliacion,
        numero_afiliacion: formData.numero_afiliacion,
        grupo_sanguineo: formData.grupo_sanguineo,
        alergias: formData.alergias,
        medicamentos_actuales: formData.medicamentos_actuales,
        contacto_emergencia_nombre: formData.contacto_emergencia_nombre,
        contacto_emergencia_telefono: formData.contacto_emergencia_telefono,
        usuario: formData.usuario,
        password: formData.password
      };

      console.log('Enviando datos del paciente:', pacienteData);

      const result = await ApiService.registerUser(pacienteData);
      
      if (result.success) {
        Alert.alert(
          'Éxito',
          'Paciente creado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error al crear paciente');
      }
    } catch (error) {
      console.error('Error al crear paciente:', error);
      Alert.alert('Error', 'Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1976D2', '#42A5F5']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Paciente</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ingrese el nombre"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={styles.input}
              value={formData.apellido}
              onChangeText={(value) => handleInputChange('apellido', value)}
              placeholder="Ingrese el apellido"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula *</Text>
            <TextInput
              style={styles.input}
              value={formData.cedula}
              onChangeText={(value) => handleInputChange('cedula', value)}
              placeholder="Ingrese la cédula"
              placeholderTextColor="#999"
              keyboardType="numeric"
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
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.telefono}
              onChangeText={(value) => handleInputChange('telefono', value)}
              placeholder="Ingrese el teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Ingrese el email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
              placeholder="Ingrese la dirección"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Información de EPS</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>EPS *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {epsList.map((eps) => (
                <TouchableOpacity
                  key={eps.id}
                  style={[
                    styles.pickerOption,
                    formData.eps_id === eps.id.toString() && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('eps_id', eps.id.toString())}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.eps_id === eps.id.toString() && styles.pickerOptionTextSelected
                  ]}>
                    {eps.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tipo de Afiliación *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.tipo_afiliacion === 'Cotizante' && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('tipo_afiliacion', 'Cotizante')}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.tipo_afiliacion === 'Cotizante' && styles.pickerOptionTextSelected
                ]}>
                  Cotizante
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.tipo_afiliacion === 'Beneficiario' && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('tipo_afiliacion', 'Beneficiario')}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.tipo_afiliacion === 'Beneficiario' && styles.pickerOptionTextSelected
                ]}>
                  Beneficiario
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Afiliación</Text>
            <TextInput
              style={styles.input}
              value={formData.numero_afiliacion}
              onChangeText={(value) => handleInputChange('numero_afiliacion', value)}
              placeholder="Ingrese el número de afiliación"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Información Médica</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Grupo Sanguíneo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grupo) => (
                <TouchableOpacity
                  key={grupo}
                  style={[
                    styles.pickerOption,
                    formData.grupo_sanguineo === grupo && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('grupo_sanguineo', grupo)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.grupo_sanguineo === grupo && styles.pickerOptionTextSelected
                  ]}>
                    {grupo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alergias</Text>
            <TextInput
              style={styles.input}
              value={formData.alergias}
              onChangeText={(value) => handleInputChange('alergias', value)}
              placeholder="Ingrese las alergias conocidas"
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medicamentos Actuales</Text>
            <TextInput
              style={styles.input}
              value={formData.medicamentos_actuales}
              onChangeText={(value) => handleInputChange('medicamentos_actuales', value)}
              placeholder="Ingrese medicamentos que toma actualmente"
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
          </View>

          <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Contacto</Text>
            <TextInput
              style={styles.input}
              value={formData.contacto_emergencia_nombre}
              onChangeText={(value) => handleInputChange('contacto_emergencia_nombre', value)}
              placeholder="Nombre del contacto de emergencia"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono del Contacto</Text>
            <TextInput
              style={styles.input}
              value={formData.contacto_emergencia_telefono}
              onChangeText={(value) => handleInputChange('contacto_emergencia_telefono', value)}
              placeholder="Teléfono del contacto de emergencia"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.sectionTitle}>Credenciales de Acceso</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario *</Text>
            <TextInput
              style={styles.input}
              value={formData.usuario}
              onChangeText={(value) => handleInputChange('usuario', value)}
              placeholder="Ingrese el usuario"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Ingrese la contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmar_password}
              onChangeText={(value) => handleInputChange('confirmar_password', value)}
              placeholder="Confirme la contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Crear Paciente</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 15,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  pickerOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerOptionSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  pickerOptionText: {
    color: '#666',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
