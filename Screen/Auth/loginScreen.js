import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import ApiService from "../../src/service/ApiService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para detectar el tipo de usuario basado en el email
  const detectUserType = (email) => {
    console.log("🔍 Detectando tipo de usuario para email:", email);
    
    // Lista de emails/usuarios de médicos conocidos
    const medicosEmails = [
      'Wilmer.Morales@hospital.com',
      'wmorales',
      'asaavedra',
      'medico@hospital.com',
      '@hospital.com'
    ];
    
    // Lista de emails/usuarios de administradores conocidos
    const adminEmails = [
      '@sistema.com',
      'admin@',
      'wilmer@gmail.com',
      'maria.gonzalez@sistema.com',
      'powbs@gmail.com'
    ];
    
    // Detectar administradores
    if (adminEmails.some(adminEmail => email.includes(adminEmail))) {
      console.log("✅ Detectado como administrador");
      return 'administrador';
    } 
    // Detectar médicos
    else if (medicosEmails.some(medicoEmail => email.includes(medicoEmail))) {
      console.log("✅ Detectado como médico");
      return 'medico';
    } 
    // Por defecto, paciente
    else {
      console.log("✅ Detectado como paciente");
      return 'paciente';
    }
  };

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Intentando login con ApiService...");
      console.log("📧 Email:", email);
      console.log("🔑 Password:", password);
      
      const tipo_usuario = detectUserType(email);
      console.log("👤 Tipo de usuario detectado:", tipo_usuario);
      
      const result = await ApiService.loginUser(email, password, tipo_usuario);
      
      if (result.success) {
        console.log("✅ Login exitoso:", result.user.name);
        console.log("✅ Rol del usuario:", result.user.role);
        
        // Forzar recarga de la navegación para que detecte el nuevo token
        if (global.forceNavigationReload) {
          global.forceNavigationReload();
        }
        
        // No mostrar alerta, redirigir directamente
        console.log("Login exitoso, redirigiendo automáticamente...");
      } else {
        console.error("❌ Error en login:", result.message);
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}> Bienvenido💖
          </Text>
          <Text style={styles.subheading}>
            Inicia sesión para continuar 
          </Text>

          <View style={styles.form}>
            <TextInput 
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#404f60ff"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#6899a7ff"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() =>
                Alert.alert("Olvidaste tu contraseña", "Próximamente 💌")
              }
            >
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogin} 
              activeOpacity={0.8}
              disabled={loading}
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Ingresar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registerLinkHighlight}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>



      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    shadowColor: "#e91e63",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heading: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 34,
    color: "#d81b60",
    marginBottom: 8,
  },
  subheading: {
    textAlign: "center",
    fontSize: 16,
    color: "#8e5a7d",
    marginBottom: 25,
  },
  form: {
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff0f6",
    padding: 15,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#f8bbd0",
    fontSize: 16,
    color: "#4a2c3a",
  },
  forgotPasswordContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#ad1457",
    textAlign: "right",
    fontWeight: "600",
  },
  loginButton: {
    padding: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#728da8ff",
    shadowColor: "#d81b60",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerLink: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 25,
    color: "#7b445e",
  },
  registerLinkHighlight: {
    color: "#d81b60",
    fontWeight: "bold",
  },
});
