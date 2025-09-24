import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MiAgenda() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Agenda</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Esta Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Este Mes</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Citas */}
      <View style={styles.appointmentsContainer}>
        <Text style={styles.sectionTitle}>Citas de Hoy</Text>
        
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentTime}>
            <Text style={styles.timeText}>09:00</Text>
            <Text style={styles.timePeriod}>AM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.patientName}>Juan Pérez</Text>
            <Text style={styles.appointmentType}>Consulta General</Text>
            <Text style={styles.patientPhone}>📞 300-123-4567</Text>
          </View>
          <View style={styles.appointmentStatus}>
            <Text style={styles.statusText}>Pendiente</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="checkmark" size={16} color="#198754" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentTime}>
            <Text style={styles.timeText}>10:30</Text>
            <Text style={styles.timePeriod}>AM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.patientName}>María López</Text>
            <Text style={styles.appointmentType}>Seguimiento</Text>
            <Text style={styles.patientPhone}>📞 300-987-6543</Text>
          </View>
          <View style={styles.appointmentStatus}>
            <Text style={styles.statusText}>Confirmada</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#1976D2" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentTime}>
            <Text style={styles.timeText}>14:00</Text>
            <Text style={styles.timePeriod}>PM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.patientName}>Pedro García</Text>
            <Text style={styles.appointmentType}>Consulta Especializada</Text>
            <Text style={styles.patientPhone}>📞 300-555-7890</Text>
          </View>
          <View style={styles.appointmentStatus}>
            <Text style={styles.statusText}>Pendiente</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="checkmark" size={16} color="#198754" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Estadísticas Rápidas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estadísticas del Día</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#198754" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Citas Totales</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#1976D2" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#fd7e14" />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#198754",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  filtersContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  filterText: {
    color: "#666",
    fontWeight: "600",
  },
  appointmentsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  appointmentTime: {
    alignItems: "center",
    marginRight: 15,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#198754",
  },
  timePeriod: {
    fontSize: 12,
    color: "#666",
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  patientPhone: {
    fontSize: 12,
    color: "#198754",
  },
  appointmentStatus: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "600",
    marginBottom: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    padding: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
