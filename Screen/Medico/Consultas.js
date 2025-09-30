import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Consultas() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Consultas Médicas</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-circle" size={24} color="#198754" />
          <Text style={styles.quickActionText}>Nueva Consulta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="search" size={24} color="#1976D2" />
          <Text style={styles.quickActionText}>Buscar Paciente</Text>
        </TouchableOpacity>
      </View>

      {/* Consultas del Día */}
      <View style={styles.consultationsContainer}>
        <Text style={styles.sectionTitle}>Consultas de Hoy</Text>
        
        <View style={styles.consultationCard}>
          <View style={styles.consultationHeader}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Juan Pérez</Text>
              <Text style={styles.consultationTime}>09:00 AM</Text>
            </View>
            <View style={styles.consultationStatus}>
              <Text style={styles.statusText}>En Progreso</Text>
            </View>
          </View>
          <View style={styles.consultationDetails}>
            <Text style={styles.consultationType}>Consulta General</Text>
            <Text style={styles.consultationReason}>Dolor de cabeza persistente</Text>
          </View>
          <View style={styles.consultationActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ver Historia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medical" size={16} color="#198754" />
              <Text style={styles.actionText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.consultationCard}>
          <View style={styles.consultationHeader}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>María López</Text>
              <Text style={styles.consultationTime}>10:30 AM</Text>
            </View>
            <View style={styles.consultationStatus}>
              <Text style={styles.statusText}>Completada</Text>
            </View>
          </View>
          <View style={styles.consultationDetails}>
            <Text style={styles.consultationType}>Seguimiento</Text>
            <Text style={styles.consultationReason}>Control de diabetes</Text>
          </View>
          <View style={styles.consultationActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ver Resultado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="receipt" size={16} color="#198754" />
              <Text style={styles.actionText}>Receta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.consultationCard}>
          <View style={styles.consultationHeader}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Pedro García</Text>
              <Text style={styles.consultationTime}>14:00 PM</Text>
            </View>
            <View style={styles.consultationStatus}>
              <Text style={styles.statusText}>Pendiente</Text>
            </View>
          </View>
          <View style={styles.consultationDetails}>
            <Text style={styles.consultationType}>Consulta Especializada</Text>
            <Text style={styles.consultationReason}>Evaluación cardiológica</Text>
          </View>
          <View style={styles.consultationActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text" size={16} color="#1976D2" />
              <Text style={styles.actionText}>Ver Historia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medical" size={16} color="#198754" />
              <Text style={styles.actionText}>Preparar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Plantillas de Consulta */}
      <View style={styles.templatesContainer}>
        <Text style={styles.sectionTitle}>Plantillas de Consulta</Text>
        <View style={styles.templatesRow}>
          <TouchableOpacity style={styles.templateCard}>
            <Ionicons name="heart" size={24} color="#dc3545" />
            <Text style={styles.templateText}>Cardiología</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.templateCard}>
            <Ionicons name="lungs" size={24} color="#198754" />
            <Text style={styles.templateText}>Neumología</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.templateCard}>
            <Ionicons name="medical" size={24} color="#1976D2" />
            <Text style={styles.templateText}>General</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estadísticas del Día</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="medical-outline" size={24} color="#198754" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#1976D2" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Completadas</Text>
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
  quickActionsContainer: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-around",
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
  consultationsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  consultationCard: {
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
  consultationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  consultationTime: {
    fontSize: 14,
    color: "#198754",
    fontWeight: "600",
  },
  consultationStatus: {
    alignItems: "flex-end",
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
  consultationDetails: {
    marginBottom: 15,
  },
  consultationType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  consultationReason: {
    fontSize: 12,
    color: "#666",
  },
  consultationActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  templatesContainer: {
    padding: 15,
  },
  templatesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  templateCard: {
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
  templateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
    textAlign: "center",
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
