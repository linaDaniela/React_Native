import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    console.log("Login con:", email, password);
    navigation.navigate("Inicio");
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

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
              <LinearGradient
                colors={["#728da8ff", "#598899ff"]}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Ingresar</Text>
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
