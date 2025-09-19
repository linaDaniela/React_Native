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

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("user");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!nombre || !apellido || !email || !telefono || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    console.log({ nombre, apellido, email, telefono, rol, password });
    Alert.alert("✨ Éxito", "Usuario registrado correctamente ");
    navigation.replace("Login");
  };

  return (
    <LinearGradient colors={["#fce4ec", "#fff1f8"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}> Crear Cuenta </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#b78fa2"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#b78fa2"
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#b78fa2"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#b78fa2"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />
            <TextInput
              style={styles.input}
              placeholder="Rol (admin o user)"
              placeholderTextColor="#b78fa2"
              value={rol}
              onChangeText={setRol}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#b78fa2"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
              <LinearGradient
                colors={["#f48fb1", "#ce93d8"]}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>Registrar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>
            ¿Ya tienes cuenta?{" "}
            <Text style={styles.loginLinkHighlight}>Inicia sesión</Text>
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
    fontSize: 32,
    color: "#d81b60",
    marginBottom: 20,
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
  registerButton: {
    padding: 16,
    borderRadius: 25,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#d81b60",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginLink: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 25,
    color: "#7b445e",
  },
  loginLinkHighlight: {
    color: "#d81b60",
    fontWeight: "bold",
  },
});
