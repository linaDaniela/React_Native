import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";
import DirectLogoutButton from "../../components/DirectLogoutButton";

export default function PanelMedico() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Panel Médico</Text>
            <Text style={styles.subtitle}>Gestiona tu práctica médica</Text>
          </View>
          <DirectLogoutButton style={styles.logoutButton} />
        </View>
      </View>

      {/* Información del Médico */}
      <View style={styles.userInfoCard}>
        <View style={styles.userAvatar}>
          <Ionicons name="medical" size={40} color="#198754" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Dr. Carlos Rodríguez</Text>
          <Text style={styles.userEmail}>medico@eps.com</Text>
          <Text style={styles.userRole}>Cardiólogo</Text>
        </View>
      </View>

      {/* Acciones Principales */}
      <Text style={styles.sectionTitle}>Acciones Principales</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Mi Agenda"
          description="Gestionar citas del día"
          icon="calendar-outline"
          onPress={() => navigation.navigate("MiAgenda")}
        />
        <CardComponent
          title="Pacientes"
          description="Ver lista de pacientes"
          icon="people-outline"
          onPress={() => navigation.navigate("MisPacientes")}
        />
        <CardComponent
          title="Consultas"
          description="Realizar consultas médicas"
          icon="medical-outline"
          onPress={() => navigation.navigate("Consultas")}
        />
        <CardComponent
          title="Recetas"
          description="Emitir recetas médicas"
          icon="receipt-outline"
          onPress={() => navigation.navigate("EmitirRecetas")}
        />
        <CardComponent
          title="Historiales"
          description="Ver historiales médicos"
          icon="document-text-outline"
          onPress={() => navigation.navigate("HistorialesMedicos")}
        />
        <CardComponent
          title="Reportes"
          description="Generar reportes médicos"
          icon="bar-chart-outline"
          onPress={() => navigation.navigate("ReportesMedicos")}
        />
      </View>

      {/* Agenda del Día */}
      <Text style={styles.sectionTitle}>Agenda de Hoy</Text>
      <View style={styles.card}>
        <View style={styles.appointmentHeader}>
          <Ionicons name="time" size={24} color="#198754" />
          <Text style={styles.appointmentTitle}>Citas Programadas</Text>
        </View>
        
        {/* Lista de citas */}
        <View style={styles.appointmentList}>
          <View style={styles.appointmentItem}>
            <View style={styles.appointmentTime}>
              <Text style={styles.timeText}>09:00</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.patientName}>Juan Pérez</Text>
              <Text style={styles.appointmentType}>Consulta General</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Pendiente</Text>
            </View>
          </View>

          <View style={styles.appointmentItem}>
            <View style={styles.appointmentTime}>
              <Text style={styles.timeText}>10:30</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.patientName}>María López</Text>
              <Text style={styles.appointmentType}>Seguimiento</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Confirmada</Text>
            </View>
          </View>

          <View style={styles.appointmentItem}>
            <View style={styles.appointmentTime}>
              <Text style={styles.timeText}>14:00</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.patientName}>Pedro García</Text>
              <Text style={styles.appointmentType}>Consulta Especializada</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Pendiente</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.appointmentButton}>
          <Text style={styles.appointmentButtonText}>Ver Agenda Completa</Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas del Médico */}
      <Text style={styles.sectionTitle}>Estadísticas</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={28} color="#1976D2" />
          <Text style={styles.summaryNumber}>45</Text>
          <Text>Pacientes Hoy</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="calendar-outline" size={28} color="#198754" />
          <Text style={styles.summaryNumber}>8</Text>
          <Text>Citas Completadas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="time-outline" size={28} color="#fd7e14" />
          <Text style={styles.summaryNumber}>3</Text>
          <Text>Citas Pendientes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="document-outline" size={28} color="#6f42c1" />
          <Text style={styles.summaryNumber}>12</Text>
          <Text>Recetas Emitidas</Text>
        </View>
      </View>

      {/* Gestión Administrativa */}
      <Text style={styles.sectionTitle}>Gestión Administrativa</Text>
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

      {/* Acciones Rápidas */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-circle-outline" size={24} color="#198754" />
          <Text style={styles.quickActionText}>Nueva Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="document-outline" size={24} color="#1976D2" />
          <Text style={styles.quickActionText}>Nueva Receta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="search-outline" size={24} color="#fd7e14" />
          <Text style={styles.quickActionText}>Buscar Paciente</Text>
        </TouchableOpacity>
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
    backgroundColor: "#198754",
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
    backgroundColor: "#E8F5E8",
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
    color: "#198754",
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
    marginBottom: 15,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  appointmentList: {
    marginBottom: 15,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentTime: {
    width: 60,
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#198754",
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: "#666",
  },
  appointmentStatus: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "600",
  },
  appointmentButton: {
    backgroundColor: "#198754",
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
