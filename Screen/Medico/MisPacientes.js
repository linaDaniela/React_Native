import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MisPacientes() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Pacientes</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Recientes</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Pacientes */}
      <View style={styles.patientsContainer}>
        <Text style={styles.sectionTitle}>Lista de Pacientes</Text>
        
        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={24} color="#198754" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>Juan Pérez</Text>
            <Text style={styles.patientInfo}>📧 juan.perez@email.com</Text>
            <Text style={styles.patientInfo}>📞 300-123-4567</Text>
            <Text style={styles.lastVisit}>Última visita: 15 Dic 2024</Text>
          </View>
          <View style={styles.patientActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#1976D2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={16} color="#198754" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={24} color="#198754" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>María López</Text>
            <Text style={styles.patientInfo}>📧 maria.lopez@email.com</Text>
            <Text style={styles.patientInfo}>📞 300-987-6543</Text>
            <Text style={styles.lastVisit}>Última visita: 12 Dic 2024</Text>
          </View>
          <View style={styles.patientActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#1976D2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={16} color="#198754" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={24} color="#198754" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>Pedro García</Text>
            <Text style={styles.patientInfo}>📧 pedro.garcia@email.com</Text>
            <Text style={styles.patientInfo}>📞 300-555-7890</Text>
            <Text style={styles.lastVisit}>Última visita: 10 Dic 2024</Text>
          </View>
          <View style={styles.patientActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#1976D2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={16} color="#198754" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#198754" />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Total Pacientes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#1976D2" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Citas Esta Semana</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={24} color="#dc3545" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pacientes Nuevos</Text>
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
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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
  patientsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  patientCard: {
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
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  lastVisit: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "600",
  },
  patientActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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
