import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MisCitas() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Próximas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Canceladas</Text>
        </TouchableOpacity>
      </View>

      {/* Próxima Cita */}
      <View style={styles.nextAppointmentContainer}>
        <Text style={styles.sectionTitle}>Próxima Cita</Text>
        <View style={styles.nextAppointmentCard}>
          <View style={styles.appointmentHeader}>
            <Ionicons name="calendar" size={24} color="#1976D2" />
            <Text style={styles.appointmentTitle}>Consulta General</Text>
          </View>
          <Text style={styles.doctorName}>Dr. Carlos Mendoza</Text>
          <Text style={styles.appointmentDate}>17 Dic 2024 - 10:30 AM</Text>
          <Text style={styles.appointmentLocation}>📍 Clínica San Rafael</Text>
          <View style={styles.appointmentStatus}>
            <Text style={styles.statusText}>Confirmada</Text>
          </View>
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="location" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ubicación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call" size={16} color="#198754" />
              <Text style={styles.actionText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="close-circle" size={16} color="#dc3545" />
              <Text style={styles.actionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Historial de Citas */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Historial de Citas</Text>
        
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentType}>Consulta General</Text>
              <Text style={styles.appointmentDate}>15 Dic 2024 - 09:00 AM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Completada</Text>
            </View>
          </View>
          <Text style={styles.doctorName}>Dr. Ana García</Text>
          <Text style={styles.appointmentLocation}>📍 Clínica San Rafael</Text>
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ver Resultado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="receipt" size={16} color="#198754" />
              <Text style={styles.actionText}>Receta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentType}>Seguimiento</Text>
              <Text style={styles.appointmentDate}>10 Dic 2024 - 14:30 PM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Completada</Text>
            </View>
          </View>
          <Text style={styles.doctorName}>Dr. Luis Rodríguez</Text>
          <Text style={styles.appointmentLocation}>📍 Clínica San Rafael</Text>
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ver Resultado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="receipt" size={16} color="#198754" />
              <Text style={styles.actionText}>Receta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentType}>Consulta Especializada</Text>
              <Text style={styles.appointmentDate}>05 Dic 2024 - 11:00 AM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Cancelada</Text>
            </View>
          </View>
          <Text style={styles.doctorName}>Dr. María López</Text>
          <Text style={styles.appointmentLocation}>📍 Clínica San Rafael</Text>
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="refresh" size={16} color="#198754" />
              <Text style={styles.actionText}>Reprogramar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsRow}>
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
    backgroundColor: "#1976D2",
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
  nextAppointmentContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  nextAppointmentCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
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
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorName: {
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
  appointmentLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },
  appointmentStatus: {
    alignItems: "flex-end",
    marginBottom: 15,
  },
  statusText: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "600",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  historyContainer: {
    padding: 15,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  quickActionsContainer: {
    padding: 15,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
