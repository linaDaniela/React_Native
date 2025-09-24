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
import { registerUser } from "../../src/Services/RegisterService";
import { testAsyncStorage, debugDatabase } from "../../src/Services/TestService";
import { debugDatabase as debugDB, listAllUsers, verifyUserExists } from "../../src/Services/DatabaseDebugService";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("paciente");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug AsyncStorage al cargar el componente
  React.useEffect(() => {
    const runDebug = async () => {
      console.log("RegisterScreen: Ejecutando debug de AsyncStorage...");
      await testAsyncStorage();
      await debugDatabase();
      await debugDB(); // Debug de la base de datos
    };
    runDebug();
  }, []);

  // Funciones de debug
  const handleDebugDatabase = async () => {
    console.log("=== DEBUG DE BASE DE DATOS ===");
    const result = await debugDB();
    Alert.alert("Debug BD", `Total usuarios: ${result.totalUsers}\nVer consola para detalles`);
  };

  const handleListUsers = async () => {
    console.log("=== LISTANDO USUARIOS ===");
    const result = await listAllUsers();
    if (result.success) {
      const userList = result.users.map(user => `${user.name} (${user.email})`).join('\n');
      Alert.alert("Usuarios en BD", `Total: ${result.totalUsers}\n\n${userList}`);
    } else {
      Alert.alert("Error", "No se pudieron listar los usuarios");
    }
  };

  const handleVerifyUser = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresa un email para verificar");
      return;
    }
    console.log("=== VERIFICANDO USUARIO ===");
    const result = await verifyUserExists(email);
    if (result.exists) {
      Alert.alert("Usuario Encontrado", `✅ ${result.user.name} existe en la BD`);
    } else {
      Alert.alert("Usuario No Encontrado", `❌ ${email} no existe en la BD`);
    }
  };



  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !telefono || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      console.log("Registrando usuario:", { nombre, apellido, email, telefono, rol, password });
      
      // Preparar datos del usuario para la base de datos
      const userData = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        telefono: telefono,
        rol: rol,
        password: password, // En una app real, esto debería estar hasheado
        name: `${nombre} ${apellido}`
      };

      // Registrar en la base de datos
      const result = await registerUser(userData);
      
      if (result.success) {
        console.log("Usuario registrado exitosamente en BD:", result.user);
        console.log("Registro exitoso, navegando al login...");
        
        // Limpiar formulario
        setNombre("");
        setApellido("");
        setEmail("");
        setTelefono("");
        setRol("paciente");
        setPassword("");
        
        // Pequeño delay para asegurar que la navegación funcione
        setTimeout(() => {
          navigation.navigate("Login");
        }, 500);
      } else {
        console.error("Error en registro:", result.message);
        Alert.alert("Error", result.message);
      }
      
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      Alert.alert("Error", "Ocurrió un error al registrar el usuario");
    } finally {
      setLoading(false);
    }
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
              placeholder="Rol (paciente o medico)"
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

            <TouchableOpacity 
              onPress={handleRegister} 
              activeOpacity={0.8}
              disabled={loading}
              style={loading ? styles.registerButtonDisabled : null}
            >
              <LinearGradient
                colors={loading ? ["#ccc", "#ddd"] : ["#f48fb1", "#ce93d8"]}
                style={styles.registerButton}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.registerButtonText}>Registrando...</Text>
                  </View>
                ) : (
                  <Text style={styles.registerButtonText}>Registrar</Text>
                )}
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

               {/* Botones de Debug */}
               <View style={styles.debugContainer}>
                 <Text style={styles.debugTitle}>🔧 Herramientas de Debug</Text>
                 
                 <TouchableOpacity style={styles.debugButton} onPress={handleDebugDatabase}>
                   <Text style={styles.debugButtonText}>📊 Debug Base de Datos</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity style={styles.debugButton} onPress={handleListUsers}>
                   <Text style={styles.debugButtonText}>👥 Listar Usuarios</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity style={styles.debugButton} onPress={handleVerifyUser}>
                   <Text style={styles.debugButtonText}>🔍 Verificar Usuario</Text>
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 10,
    textAlign: "center",
  },
  debugButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
