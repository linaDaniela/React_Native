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

export default function CrearMedico({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    especialidad_id: '',
    telefono: '',
    email: '',
    direccion: '',
    experiencia_anos: '',
    consultorio_id: '',
    horario_inicio: '',
    horario_fin: '',
    dias_trabajo: '',
    tarifa_consulta: '',
    usuario: '',
    password: '',
    confirmar_password: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [especialidadesData, consultoriosData] = await Promise.all([
        ApiService.getEspecialidades(),
        ApiService.getConsultorios()
      ]);
      
      setEspecialidades(especialidadesData);
      setConsultorios(consultoriosData);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  const handleInputChange = (field, value) => {
    // Validación especial para campos de hora
    if (field === 'horario_inicio' || field === 'horario_fin') {
      // Permitir solo números y dos puntos
      const cleanValue = value.replace(/[^0-9:]/g, '');
      
      // Permitir hasta 5 caracteres (HH:MM)
      if (cleanValue.length <= 5) {
        setFormData(prev => ({
          ...prev,
          [field]: cleanValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'nombre', 'apellido', 'cedula', 'especialidad_id', 
      'email', 'experiencia_anos', 'usuario', 'password'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Error', `El campo ${field} es obligatorio`);
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

    // Validar formato de horarios
    if (formData.horario_inicio && !isValidTimeFormat(formData.horario_inicio)) {
      Alert.alert('Error', 'El horario de inicio debe tener el formato HH:MM (ej: 08:00)');
      return false;
    }
    
    if (formData.horario_fin && !isValidTimeFormat(formData.horario_fin)) {
      Alert.alert('Error', 'El horario de fin debe tener el formato HH:MM (ej: 17:00)');
      return false;
    }

    return true;
  };

  const isValidTimeFormat = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleCrearMedico = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const medicoData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        especialidad_id: parseInt(formData.especialidad_id),
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        experiencia_anos: parseInt(formData.experiencia_anos),
        consultorio_id: formData.consultorio_id ? parseInt(formData.consultorio_id) : null,
        horario_inicio: formData.horario_inicio,
        horario_fin: formData.horario_fin,
        dias_trabajo: formData.dias_trabajo,
        tarifa_consulta: formData.tarifa_consulta ? parseFloat(formData.tarifa_consulta) : null,
        usuario: formData.usuario,
        password: formData.password
      };

      console.log('Enviando datos del médico:', medicoData);

      const result = await ApiService.crearMedico(medicoData);
      
      if (result.success) {
        Alert.alert(
          '¡Éxito!', 
          result.message || 'Médico creado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear el médico');
      }

    } catch (error) {
      console.error('Error creando médico:', error);
      Alert.alert('Error', 'No se pudo crear el médico. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#fce4ec", "#fff1f8"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Nuevo Médico</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Información Personal */}
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(value) => handleInputChange('nombre', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(value) => handleInputChange('apellido', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Cédula"
            value={formData.cedula}
            onChangeText={(value) => handleInputChange('cedula', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(value) => handleInputChange('telefono', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={formData.direccion}
            onChangeText={(value) => handleInputChange('direccion', value)}
          />

          {/* Información Médica */}
          <Text style={styles.sectionTitle}>Información Médica</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Especialidad *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {especialidades.map((esp) => (
                <TouchableOpacity
                  key={esp.id}
                  style={[
                    styles.pickerOption,
                    formData.especialidad_id === esp.id.toString() && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('especialidad_id', esp.id.toString())}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.especialidad_id === esp.id.toString() && styles.pickerOptionTextSelected
                  ]}>
                    {esp.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Años de experiencia"
            keyboardType="numeric"
            value={formData.experiencia_anos}
            onChangeText={(value) => handleInputChange('experiencia_anos', value)}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Consultorio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.consultorio_id === '' && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('consultorio_id', '')}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.consultorio_id === '' && styles.pickerOptionTextSelected
                ]}>
                  Sin asignar
                </Text>
              </TouchableOpacity>
              {consultorios.map((consultorio) => (
                <TouchableOpacity
                  key={consultorio.id}
                  style={[
                    styles.pickerOption,
                    formData.consultorio_id === consultorio.id.toString() && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('consultorio_id', consultorio.id.toString())}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.consultorio_id === consultorio.id.toString() && styles.pickerOptionTextSelected
                  ]}>
                    {consultorio.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Horarios */}
          <Text style={styles.sectionTitle}>Horarios</Text>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Hora de inicio</Text>
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="08:00"
                value={formData.horario_inicio}
                onChangeText={(value) => handleInputChange('horario_inicio', value)}
                keyboardType="default"
                maxLength={5}
              />
            </View>
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Hora de fin</Text>
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="17:00"
                value={formData.horario_fin}
                onChangeText={(value) => handleInputChange('horario_fin', value)}
                keyboardType="default"
                maxLength={5}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Días de trabajo (ej: lunes,martes,miércoles)"
            value={formData.dias_trabajo}
            onChangeText={(value) => handleInputChange('dias_trabajo', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Tarifa consulta"
            keyboardType="numeric"
            value={formData.tarifa_consulta}
            onChangeText={(value) => handleInputChange('tarifa_consulta', value)}
          />

          {/* Credenciales */}
          <Text style={styles.sectionTitle}>Credenciales de Acceso</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={formData.usuario}
            onChangeText={(value) => handleInputChange('usuario', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={formData.confirmar_password}
            onChangeText={(value) => handleInputChange('confirmar_password', value)}
          />

          {/* Botón Crear */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCrearMedico}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ["#cccccc", "#999999"] : ["#dc3545", "#c82333"]}
              style={styles.createButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Crear Médico</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#dc3545",
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc3545",
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  pickerOption: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerOptionSelected: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  pickerOptionText: {
    color: "#666",
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeInputGroup: {
    width: '48%',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  timeInput: {
    width: '100%',
  },
  createButton: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
  createButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
