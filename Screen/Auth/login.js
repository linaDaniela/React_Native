import React, { useState } from "react";
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
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState("paciente");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, tipo);
      
      if (result.success) {
        Alert.alert("✅ Éxito", `Bienvenido, ${result.userType === 'admin' ? 'Administrador' : result.userType === 'medico' ? 'Doctor' : 'Paciente'}`);
        // La navegación se maneja automáticamente por el AuthContext
        // No necesitamos navegar manualmente aquí
      } else {
        Alert.alert("❌ Error", result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("❌ Error", "Error inesperado al iniciar sesión");
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
              <Ionicons name="medical" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>AppEPS</Text>
            <Text style={styles.subtitle}>Sistema de Gestión Médica</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {/* Selector de tipo de usuario */}
          <View style={styles.tipoSection}>
            <Text style={styles.tipoLabel}>Tipo de usuario:</Text>
            <View style={styles.tipoButtons}>
              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipo === 'paciente' && styles.tipoButtonSelected
                ]}
                onPress={() => setTipo('paciente')}
              >
                <Text style={[
                  styles.tipoButtonText,
                  tipo === 'paciente' && styles.tipoButtonTextSelected
                ]}>
                  Paciente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipo === 'medico' && styles.tipoButtonSelected
                ]}
                onPress={() => setTipo('medico')}
              >
                <Text style={[
                  styles.tipoButtonText,
                  tipo === 'medico' && styles.tipoButtonTextSelected
                ]}>
                  Médico
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipo === 'admin' && styles.tipoButtonSelected
                ]}
                onPress={() => setTipo('admin')}
              >
                <Text style={[
                  styles.tipoButtonText,
                  tipo === 'admin' && styles.tipoButtonTextSelected
                ]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
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

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>
              ¿No tienes cuenta? Regístrate
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
  tipoSection: {
    marginBottom: 24,
  },
  tipoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipoButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tipoButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  tipoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tipoButtonTextSelected: {
    color: '#fff',
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
  loginButton: {
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
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  registerButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});