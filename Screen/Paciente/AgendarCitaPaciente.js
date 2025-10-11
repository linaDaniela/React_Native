import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/service/conexion';

const { width } = Dimensions.get('window');

export default function AgendarCitaPaciente({ navigation }) {
  const { user } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    medico_id: null,
    especialidad_id: null,
    fecha: '',
    hora: '',
    motivo: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar médicos y especialidades en paralelo
      const [medicosResponse, especialidadesResponse] = await Promise.all([
        api.get('/medicos'),
        api.get('/especialidades')
      ]);

      console.log('Cargando médicos...');
      console.log('Resultado de médicos:', medicosResponse.data);
      
      if (medicosResponse.data.success) {
        setMedicos(medicosResponse.data.data || []);
        console.log('Médicos activos cargados desde API:', medicosResponse.data.data?.length || 0);
      } else {
        console.error('Error al obtener médicos:', medicosResponse.data.message);
        setMedicos([]);
      }

      if (especialidadesResponse.data.success) {
        setEspecialidades(especialidadesResponse.data.data || []);
      } else {
        console.error('Error al obtener especialidades:', especialidadesResponse.data.message);
        setEspecialidades([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'Error al cargar los datos necesarios');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const { medico_id, especialidad_id, fecha, hora, motivo } = formData;

    if (!medico_id) {
      Alert.alert('Error', 'Por favor selecciona un médico');
      return false;
    }

    if (!especialidad_id) {
      Alert.alert('Error', 'Por favor selecciona una especialidad');
      return false;
    }

    if (!fecha) {
      Alert.alert('Error', 'Por favor ingresa la fecha');
      return false;
    }

    if (!hora) {
      Alert.alert('Error', 'Por favor ingresa la hora');
      return false;
    }

    if (!motivo) {
      Alert.alert('Error', 'Por favor ingresa el motivo de la consulta');
      return false;
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      Alert.alert('Error', 'La fecha debe estar en formato YYYY-MM-DD');
      return false;
    }

    // Validar formato de hora (HH:MM o HH:MM:SS)
    const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!horaRegex.test(hora)) {
      Alert.alert('Error', 'La hora debe estar en formato HH:MM o HH:MM:SS');
      return false;
    }

    // Si es HH:MM, convertir a HH:MM:SS
    if (hora.length === 5) {
      formData.hora = hora + ':00';
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Debug: Verificar el objeto user
      console.log('🔍 Debug - Objeto user completo:', user);
      console.log('🔍 Debug - user.id:', user?.id);
      console.log('🔍 Debug - formData completo:', formData);
      
      const citaData = {
        paciente_id: user?.id || 1, // Usar ID 1 como fallback si user.id no existe
        medico_id: formData.medico_id,
        fecha: formData.fecha,
        hora: formData.hora,
        motivo: formData.motivo,
        estado: 'programada'
      };

      console.log('📤 Enviando datos de la cita:', citaData);

      const response = await api.post('/citas', citaData);
      
      if (response.data.success) {
        Alert.alert(
          '✅ Cita Agendada',
          'Tu cita ha sido agendada exitosamente. Te contactaremos pronto.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Error al agendar la cita');
      }
    } catch (error) {
      console.error('❌ Error al agendar cita:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 422) {
        Alert.alert('Error', 'Datos inválidos: ' + (error.response.data?.message || 'Verifica los campos'));
      } else if (error.response?.status === 500) {
        Alert.alert('Error', 'Error del servidor: ' + (error.response.data?.message || 'Inténtalo más tarde.'));
      } else {
        Alert.alert('Error', 'Error inesperado: ' + (error.message || 'Error de conexión'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderSelector = (title, data, selectedId, onSelect, keyField = 'id', nameField = 'nombre') => (
    <View style={styles.selectorSection}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.selectorScrollView}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item[keyField]}
            style={[
              styles.selectorItem,
              selectedId === item[keyField] && styles.selectorItemSelected
            ]}
            onPress={() => onSelect(item[keyField])}
          >
            <Text style={[
              styles.selectorItemText,
              selectedId === item[keyField] && styles.selectorItemTextSelected
            ]}>
              {item[nameField]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar Cita</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información de la Cita</Text>

          {/* Selector de Especialidad */}
          {renderSelector(
            'Especialidad',
            especialidades,
            formData.especialidad_id,
            (id) => setFormData({ ...formData, especialidad_id: id, medico_id: null })
          )}

          {/* Selector de Médico */}
          {renderSelector(
            'Médico',
            medicos.filter(medico => medico.especialidad_id === formData.especialidad_id),
            formData.medico_id,
            (id) => setFormData({ ...formData, medico_id: id })
          )}

          {/* Input de Fecha */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Fecha (YYYY-MM-DD)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="2024-01-15"
                placeholderTextColor="#999"
                value={formData.fecha}
                onChangeText={(text) => setFormData({ ...formData, fecha: text })}
              />
            </View>
          </View>

          {/* Input de Hora */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Hora (HH:MM)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="14:30"
                placeholderTextColor="#999"
                value={formData.hora}
                onChangeText={(text) => setFormData({ ...formData, hora: text })}
              />
            </View>
          </View>

          {/* Input de Motivo */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Motivo de la Consulta</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="document-text-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el motivo de tu consulta..."
                placeholderTextColor="#999"
                value={formData.motivo}
                onChangeText={(text) => setFormData({ ...formData, motivo: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Botón de Envío */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Agendar Cita</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  selectorSection: {
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectorScrollView: {
    flexDirection: 'row',
  },
  selectorItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorItemSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectorItemText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectorItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});