import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";
import DirectLogoutButton from "../../components/DirectLogoutButton";

export default function PanelUsuario() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Panel de Paciente</Text>
            <Text style={styles.subtitle}>Gestiona tu información médica</Text>
          </View>
          <DirectLogoutButton style={styles.logoutButton} />
        </View>
      </View>

      {/* Información del Usuario */}
      <View style={styles.userInfoCard}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={40} color="#1976D2" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Juan Pérez</Text>
          <Text style={styles.userEmail}>paciente@eps.com</Text>
          <Text style={styles.userRole}>Paciente</Text>
        </View>
      </View>

      {/* Acciones Principales */}
      <Text style={styles.sectionTitle}>Acciones Principales</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Mis Citas"
          description="Ver y gestionar mis citas"
          icon="calendar-outline"
          onPress={() => navigation.navigate("MisCitasPaciente")}
        />
        <CardComponent
          title="Mi Perfil"
          description="Actualizar información personal"
          icon="person-outline"
          onPress={() => navigation.navigate("MiPerfilPaciente")}
        />
        <CardComponent
          title="Historial Médico"
          description="Ver mi historial de consultas"
          icon="document-text-outline"
          onPress={() => navigation.navigate("HistorialMedico")}
        />
        <CardComponent
          title="Médicos"
          description="Buscar y contactar médicos"
          icon="medical-outline"
          onPress={() => navigation.navigate("BuscarMedicos")}
        />
        <CardComponent
          title="Recetas"
          description="Ver mis recetas médicas"
          icon="receipt-outline"
          onPress={() => navigation.navigate("MisRecetas")}
        />
        <CardComponent
          title="Emergencias"
          description="Contacto de emergencia"
          icon="call-outline"
          onPress={() => navigation.navigate("Emergencias")}
        />
        <CardComponent
          title="Especialidades"
          description="Ver especialidades médicas"
          icon="library-outline"
          onPress={() => navigation.navigate("Especialidades")}
        />
        <CardComponent
          title="EPS"
          description="Información de mi EPS"
          icon="business-outline"
          onPress={() => navigation.navigate("EpsFlow")}
        />
      </View>

      {/* Próxima Cita */}
      <Text style={styles.sectionTitle}>Próxima Cita</Text>
      <View style={styles.card}>
        <View style={styles.appointmentHeader}>
          <Ionicons name="calendar" size={24} color="#1976D2" />
          <Text style={styles.appointmentTitle}>Consulta General</Text>
        </View>
        <Text style={styles.appointmentDoctor}>Dr. Carlos Mendoza</Text>
        <Text style={styles.appointmentDate}>17 Dic 2024 - 10:30 AM</Text>
        <Text style={styles.appointmentStatus}>Confirmado</Text>
        <TouchableOpacity style={styles.appointmentButton}>
          <Text style={styles.appointmentButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>

      {/* Acciones Rápidas */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="calendar-outline" size={24} color="#1976D2" />
          <Text style={styles.quickActionText}>Nueva Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="search-outline" size={24} color="#198754" />
          <Text style={styles.quickActionText}>Buscar Médico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="call-outline" size={24} color="#dc3545" />
          <Text style={styles.quickActionText}>Emergencia</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen de Salud */}
      <Text style={styles.sectionTitle}>Resumen de Salud</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="heart-outline" size={28} color="#dc3545" />
          <Text style={styles.summaryNumber}>120/80</Text>
          <Text>Presión Arterial</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="thermometer-outline" size={28} color="#fd7e14" />
          <Text style={styles.summaryNumber}>36.5°C</Text>
          <Text>Temperatura</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="fitness-outline" size={28} color="#198754" />
          <Text style={styles.summaryNumber}>70 kg</Text>
          <Text>Peso</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="pulse-outline" size={28} color="#6f42c1" />
          <Text style={styles.summaryNumber}>72 bpm</Text>
          <Text>Frecuencia Cardíaca</Text>
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
    backgroundColor: "#1976D2",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.9,
  },
  userInfoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  listContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  appointmentDoctor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  appointmentDate: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
    marginBottom: 5,
  },
  appointmentStatus: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "bold",
    marginBottom: 15,
  },
  appointmentButton: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  appointmentButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
});
