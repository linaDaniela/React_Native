import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../src/service/conexion";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !telefono || !password || !fechaNacimiento || !tipoDocumento || !numeroDocumento || !direccion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    const pacienteData = {
      nombre,
      apellido,
      email,
      telefono,
      password,
      fecha_nacimiento: fechaNacimiento,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
      direccion,
      activo: 1
    };

    try {
      console.log("Enviando datos del paciente:", pacienteData);
      const response = await api.post("/pacientes", pacienteData);
      
      if (response.data.success) {
        Alert.alert("✅ Éxito", "Paciente registrado correctamente", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]);
      } else {
        Alert.alert("❌ Error", response.data.message || "Error al registrar paciente");
      }
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      Alert.alert("❌ Error", "Error al registrar paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>Crea tu cuenta de paciente</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información Personal</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#999"
              value={apellido}
              onChangeText={setApellido}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tipo de documento (CC, TI, etc.)"
              placeholderTextColor="#999"
              value={tipoDocumento}
              onChangeText={setTipoDocumento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Número de documento"
              placeholderTextColor="#999"
              value={numeroDocumento}
              onChangeText={setNumeroDocumento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="#999"
              value={direccion}
              onChangeText={setDireccion}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
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
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});