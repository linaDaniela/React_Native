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
// import { LinearGradient } from "expo-linear-gradient"; // Comentado temporalmente
import ApiService from "../../src/service/ApiService";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [epsId, setEpsId] = useState("");
  const [tipoAfiliacion, setTipoAfiliacion] = useState("Cotizante");
  const [numeroAfiliacion, setNumeroAfiliacion] = useState("");
  const [grupoSanguineo, setGrupoSanguineo] = useState("");
  const [alergias, setAlergias] = useState("");
  const [medicamentosActuales, setMedicamentosActuales] = useState("");
  const [contactoEmergenciaNombre, setContactoEmergenciaNombre] = useState("");
  const [contactoEmergenciaTelefono, setContactoEmergenciaTelefono] = useState("");
  const [loading, setLoading] = useState(false);




  const handleRegister = async () => {
    if (!nombre || !apellido || !cedula || !fechaNacimiento || !email || !telefono || !usuario || !password) {
      Alert.alert("Error", "Los campos marcados con * son obligatorios");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      console.log("Registrando paciente:", { 
        nombre, apellido, cedula, fechaNacimiento, email, telefono, usuario, password,
        direccion, epsId, tipoAfiliacion, numeroAfiliacion, grupoSanguineo, alergias,
        medicamentosActuales, contactoEmergenciaNombre, contactoEmergenciaTelefono
      });
      
      // Preparar datos del paciente para la base de datos
      const userData = {
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
        fecha_nacimiento: fechaNacimiento,
        email: email,
        telefono: telefono,
        usuario: usuario,
        password: password,
        direccion: direccion || null,
        eps_id: epsId || null,
        tipo_afiliacion: tipoAfiliacion,
        numero_afiliacion: numeroAfiliacion || null,
        grupo_sanguineo: grupoSanguineo || null,
        alergias: alergias || null,
        medicamentos_actuales: medicamentosActuales || null,
        contacto_emergencia_nombre: contactoEmergenciaNombre || null,
        contacto_emergencia_telefono: contactoEmergenciaTelefono || null,
        rol: 'paciente'
      };

      // Registrar en la base de datos
      const result = await ApiService.registerUser(userData);
      
      if (result.success) {
        console.log("Paciente registrado exitosamente:", result.message);
        console.log("Registro exitoso, navegando al login...");
        
        // Limpiar formulario
        setNombre("");
        setApellido("");
        setCedula("");
        setFechaNacimiento("");
        setEmail("");
        setTelefono("");
        setUsuario("");
        setPassword("");
        setDireccion("");
        setEpsId("");
        setTipoAfiliacion("Cotizante");
        setNumeroAfiliacion("");
        setGrupoSanguineo("");
        setAlergias("");
        setMedicamentosActuales("");
        setContactoEmergenciaNombre("");
        setContactoEmergenciaTelefono("");
        
        Alert.alert("Éxito", "Paciente registrado correctamente");
        
        // Pequeño delay para asegurar que la navegación funcione
        setTimeout(() => {
          navigation.navigate("Login");
        }, 500);
      } else {
        console.error("Error en registro:", result.message);
        Alert.alert("Error", result.message);
      }
      
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      Alert.alert("Error", "Ocurrió un error al registrar el paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fce4ec" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}> Crear Cuenta </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              placeholderTextColor="#b78fa2"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido *"
              placeholderTextColor="#b78fa2"
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInput
              style={styles.input}
              placeholder="Cédula *"
              placeholderTextColor="#b78fa2"
              value={cedula}
              onChangeText={setCedula}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de Nacimiento * (YYYY-MM-DD)"
              placeholderTextColor="#b78fa2"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico *"
              placeholderTextColor="#b78fa2"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono *"
              placeholderTextColor="#b78fa2"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario *"
              placeholderTextColor="#b78fa2"
              value={usuario}
              onChangeText={setUsuario}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña *"
              placeholderTextColor="#b78fa2"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              onPress={handleRegister} 
              activeOpacity={0.8}
              disabled={loading}
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled
              ]}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.registerButtonText}>Registrando...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Campos Opcionales */}
          <View style={styles.optionalSection}>
            <Text style={styles.sectionTitle}>Información Adicional (Opcional)</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="#b78fa2"
              value={direccion}
              onChangeText={setDireccion}
            />
            
            <TextInput
              style={styles.input}
              placeholder="EPS ID (número)"
              placeholderTextColor="#b78fa2"
              keyboardType="numeric"
              value={epsId}
              onChangeText={setEpsId}
            />
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Tipo de Afiliación:</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    "Tipo de Afiliación",
                    "Selecciona el tipo de afiliación",
                    [
                      { text: "Cotizante", onPress: () => setTipoAfiliacion("Cotizante") },
                      { text: "Beneficiario", onPress: () => setTipoAfiliacion("Beneficiario") }
                    ]
                  );
                }}
              >
                <Text style={styles.pickerText}>{tipoAfiliacion}</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Número de Afiliación"
              placeholderTextColor="#b78fa2"
              value={numeroAfiliacion}
              onChangeText={setNumeroAfiliacion}
            />
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Grupo Sanguíneo:</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    "Grupo Sanguíneo",
                    "Selecciona tu grupo sanguíneo",
                    [
                      { text: "A+", onPress: () => setGrupoSanguineo("A+") },
                      { text: "A-", onPress: () => setGrupoSanguineo("A-") },
                      { text: "B+", onPress: () => setGrupoSanguineo("B+") },
                      { text: "B-", onPress: () => setGrupoSanguineo("B-") },
                      { text: "AB+", onPress: () => setGrupoSanguineo("AB+") },
                      { text: "AB-", onPress: () => setGrupoSanguineo("AB-") },
                      { text: "O+", onPress: () => setGrupoSanguineo("O+") },
                      { text: "O-", onPress: () => setGrupoSanguineo("O-") }
                    ]
                  );
                }}
              >
                <Text style={styles.pickerText}>{grupoSanguineo || "Seleccionar"}</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Alergias conocidas"
              placeholderTextColor="#b78fa2"
              multiline
              numberOfLines={3}
              value={alergias}
              onChangeText={setAlergias}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Medicamentos actuales"
              placeholderTextColor="#b78fa2"
              multiline
              numberOfLines={3}
              value={medicamentosActuales}
              onChangeText={setMedicamentosActuales}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contacto de Emergencia - Nombre"
              placeholderTextColor="#b78fa2"
              value={contactoEmergenciaNombre}
              onChangeText={setContactoEmergenciaNombre}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contacto de Emergencia - Teléfono"
              placeholderTextColor="#b78fa2"
              keyboardType="phone-pad"
              value={contactoEmergenciaTelefono}
              onChangeText={setContactoEmergenciaTelefono}
            />
          </View>
        </View>

               <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                 <Text style={styles.loginLink}>
                   ¿Ya tienes cuenta?{" "}
                   <Text style={styles.loginLinkHighlight}>Inicia sesión</Text>
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
    backgroundColor: "#f48fb1",
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
  optionalSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 15,
    textAlign: "center",
  },
  pickerContainer: {
    marginTop: 15,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  pickerButton: {
    backgroundColor: "#fff0f6",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f8bbd0",
  },
  pickerText: {
    fontSize: 16,
    color: "#4a2c3a",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});
