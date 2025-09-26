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
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../../src/service/AuthService";

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
    if (email.includes('@sistema.com')) {
      return 'administrador';
    } else if (email.includes('@hospital.com')) {
      return 'medico';
    } else {
      return 'paciente';
    }
  };

  const handleLogin = async () => {
    // Validaciones
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Detectar tipo de usuario automáticamente
      const tipo_usuario = detectUserType(email);
      console.log("Intentando login con:", email, "tipo:", tipo_usuario);
      
      const result = await loginUser(email, password, tipo_usuario);
      
      if (result.success) {
        console.log("Login exitoso, navegando al panel del usuario...");
        Alert.alert("¡Éxito!", `Bienvenido ${result.user?.name || result.user?.nombre || email}`, [
          {
            text: "Continuar",
            onPress: () => {
              // Navegar al PanelSelector que detectará el tipo de usuario
              navigation.navigate('InicioStack', { 
                screen: 'PanelSelector' 
              });
            }
          }
        ]);
      } else {
        console.error("Error en login:", result.message);
        Alert.alert("Error", result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <LinearGradient colors={["#fce4ec", "#fff1f8"]} style={{ flex: 1 }}>
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
            >
              <LinearGradient
                colors={loading ? ["#cccccc", "#999999"] : ["#728da8ff", "#598899ff"]}
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
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registerLinkHighlight}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>

        {/* Credenciales de demo */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🔧 Credenciales de prueba:</Text>
          <TouchableOpacity
            style={styles.demoCredential}
            onPress={() => {
              setEmail("admin@sistema.com");
              setPassword("admin123");
            }}
          >
            <Text style={styles.demoText}>
              <Text style={styles.demoRole}>admin:</Text> admin@sistema.com / admin123
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoCredential}
            onPress={() => {
              setEmail("Wilmer.Morales@hospital.com");
              setPassword("medico123");
            }}
          >
            <Text style={styles.demoText}>
              <Text style={styles.demoRole}>médico:</Text> Wilmer.Morales@hospital.com / medico123
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoCredential}
            onPress={() => {
              setEmail("juan.pineda@email.com");
              setPassword("paciente123");
            }}
          >
            <Text style={styles.demoText}>
              <Text style={styles.demoRole}>paciente:</Text> juan.pineda@email.com / paciente123
            </Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </LinearGradient>
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
  demoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 10,
    textAlign: "center",
  },
  demoCredential: {
    padding: 8,
    marginVertical: 2,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  demoText: {
    fontSize: 12,
    color: "#6c757d",
  },
  demoRole: {
    fontWeight: "bold",
    color: "#495057",
  },
});
