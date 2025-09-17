import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";

export default function Inicio() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Citas Médicas</Text>
      </View>

      {/* Botones de Login y Registro */}
      <View style={styles.authButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Pacientes"
          description="Gestión de pacientes"
          icon="people-outline"
          onPress={() => navigation.navigate("PacientesFlow")}
        />
        <CardComponent
          title="Citas"
          description="Gestión de citas médicas"
          icon="calendar-outline"
          onPress={() => navigation.navigate("CitasFlow")}
        />
        <CardComponent
          title="Médicos"
          description="Gestión de médicos"
          icon="medkit-outline"
          onPress={() => navigation.navigate("Medico")}
        />
        <CardComponent
          title="Especialidades"
          description="Gestión de especialidades"
          icon="library-outline"
          onPress={() => navigation.navigate("Especialidades")}
        />
        <CardComponent
          title="EPS"
          description="Gestión de EPS"
          icon="business-outline"
          onPress={() => navigation.navigate("EpsFlow")}
        />
      </View>

      {/* Próxima Cita */}
      <Text style={styles.sectionTitle}>Próxima Cita</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Dr. Carlos Mendoza</Text>
        <Text style={styles.cardSubText}>17 Dic 2024 - 10:30 AM</Text>
        <Text style={styles.cardStatus}>Confirmado</Text>
      </View>

      {/* Resumen */}
      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={28} color="#0d6efd" />
          <Text style={styles.summaryNumber}>120</Text>
          <Text>Pacientes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="alert-circle-outline" size={28} color="#dc3545" />
          <Text style={styles.summaryNumber}>15</Text>
          <Text>Urgencias</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="pulse-outline" size={28} color="#198754" />
          <Text style={styles.summaryNumber}>8</Text>
          <Text>Consultas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="document-text-outline" size={28} color="#fd7e14" />
          <Text style={styles.summaryNumber}>32</Text>
          <Text>Reportes</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  header: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubText: {
    color: "#6c757d",
  },
  cardStatus: {
    color: "#198754",
    fontWeight: "bold",
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    width: "47%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
