import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../../src/service/ApiService';
import PacientesService from '../../src/service/PacientesService';

const EditarPaciente = ({ route, navigation }) => {
  const { paciente } = route.params;
  const [formData, setFormData] = useState({
    nombre: paciente.nombre || '',
    apellido: paciente.apellido || '',
    cedula: paciente.cedula || '',
    telefono: paciente.telefono || '',
    email: paciente.email || '',
    direccion: paciente.direccion || '',
    eps_id: paciente.eps_id || '',
    fecha_nacimiento: paciente.fecha_nacimiento || paciente.fechaNacimiento || '',
    tipo_afiliacion: paciente.tipo_afiliacion || '',
    numero_afiliacion: paciente.numero_afiliacion || '',
    grupo_sanguineo: paciente.grupo_sanguineo || '',
    alergias: paciente.alergias || '',
    medicamentos_actuales: paciente.medicamentos_actuales || '',
    contacto_emergencia_nombre: paciente.contacto_emergencia_nombre || '',
    contacto_emergencia_telefono: paciente.contacto_emergencia_telefono || '',
  });
  const [loading, setLoading] = useState(false);
  const [epsList, setEpsList] = useState([]);

  const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const tiposAfiliacion = ['Cotizante', 'Beneficiario'];

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
      'nombre', 'apellido', 'cedula', 'fecha_nacimiento', 'email',
      'tipo_afiliacion'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Error', `El campo ${field} es obligatorio`);
        return false;
      }
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return false;
    }

    // Validar formato de fecha de nacimiento (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.fecha_nacimiento)) {
      Alert.alert('Error', 'La fecha de nacimiento debe tener el formato YYYY-MM-DD');
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
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
        eps_id: formData.eps_id ? parseInt(formData.eps_id) : null,
        tipo_afiliacion: formData.tipo_afiliacion,
        numero_afiliacion: formData.numero_afiliacion,
        grupo_sanguineo: formData.grupo_sanguineo,
        alergias: formData.alergias,
        medicamentos_actuales: formData.medicamentos_actuales,
        contacto_emergencia_nombre: formData.contacto_emergencia_nombre,
        contacto_emergencia_telefono: formData.contacto_emergencia_telefono,
      };

      console.log('Actualizando paciente:', paciente.id, 'con datos:', pacienteData);
      
      // Llamada real al API para actualizar
      const result = await PacientesService.actualizarPaciente(paciente.id, pacienteData);
      
      if (result.success) {
        console.log('✅ Paciente actualizado exitosamente');
        Alert.alert(
          'Éxito',
          'Los datos del paciente han sido actualizados correctamente en la base de datos',
          [
            {
              text: 'OK',
              onPress: () => {
                // Pasar los datos actualizados de vuelta a la pantalla anterior
                navigation.navigate('ListarPacientes', { 
                  pacienteActualizado: { ...paciente, ...pacienteData }
                });
              }
            }
          ]
        );
      } else {
        console.log('❌ Error al actualizar paciente:', result.message);
        Alert.alert('Error', result.message || 'No se pudo actualizar el paciente');
      }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar paciente:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo actualizar el paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1976D2', '#6DD5FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Editar Paciente</Text>
        <Text style={styles.subtitle}>Actualiza la información del paciente</Text>

        <View style={styles.formCard}>
          {/* Información Personal */}
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre *"
            value={formData.nombre}
            onChangeText={(value) => handleInputChange('nombre', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Apellido *"
            value={formData.apellido}
            onChangeText={(value) => handleInputChange('apellido', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Cédula *"
            keyboardType="numeric"
            value={formData.cedula}
            onChangeText={(value) => handleInputChange('cedula', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Fecha de Nacimiento (YYYY-MM-DD) *"
            value={formData.fecha_nacimiento}
            onChangeText={(value) => handleInputChange('fecha_nacimiento', value)}
          />

          {/* Información de Contacto */}
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={formData.telefono}
            onChangeText={(value) => handleInputChange('telefono', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={formData.direccion}
            onChangeText={(value) => handleInputChange('direccion', value)}
          />

          {/* Información de EPS */}
          <Text style={styles.sectionTitle}>Información de EPS</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>EPS *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {epsList.length > 0 ? (
                epsList.map((eps) => (
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
                ))
              ) : (
                <Text style={styles.noDataText}>Cargando EPS...</Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tipo de Afiliación *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tiposAfiliacion.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.pickerOption,
                    formData.tipo_afiliacion === tipo && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('tipo_afiliacion', tipo)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.tipo_afiliacion === tipo && styles.pickerOptionTextSelected
                  ]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Número de Afiliación"
            value={formData.numero_afiliacion}
            onChangeText={(value) => handleInputChange('numero_afiliacion', value)}
          />

          {/* Información Médica Adicional */}
          <Text style={styles.sectionTitle}>Información Médica Adicional</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Grupo Sanguíneo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gruposSanguineos.map((grupo) => (
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

          <TextInput
            style={styles.input}
            placeholder="Alergias"
            value={formData.alergias}
            onChangeText={(value) => handleInputChange('alergias', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Medicamentos Actuales"
            value={formData.medicamentos_actuales}
            onChangeText={(value) => handleInputChange('medicamentos_actuales', value)}
          />

          {/* Contacto de Emergencia */}
          <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre Contacto de Emergencia"
            value={formData.contacto_emergencia_nombre}
            onChangeText={(value) => handleInputChange('contacto_emergencia_nombre', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono Contacto de Emergencia"
            keyboardType="phone-pad"
            value={formData.contacto_emergencia_telefono}
            onChangeText={(value) => handleInputChange('contacto_emergencia_telefono', value)}
          />

          {/* Botón de Guardar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleGuardar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 80,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 20,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerOption: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  pickerOptionSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditarPaciente;