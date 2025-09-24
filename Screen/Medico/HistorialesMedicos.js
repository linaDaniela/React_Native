import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function HistorialesMedicos() {
  const navigation = useNavigation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    { 
      id: 1, 
      name: "Juan Pérez", 
      document: "12345678",
      lastVisit: "15 Dic 2024",
      totalVisits: 12,
      conditions: ["Hipertensión", "Diabetes Tipo 2"]
    },
    { 
      id: 2, 
      name: "María López", 
      document: "87654321",
      lastVisit: "12 Dic 2024",
      totalVisits: 8,
      conditions: ["Asma", "Alergias"]
    },
    { 
      id: 3, 
      name: "Pedro García", 
      document: "11223344",
      lastVisit: "10 Dic 2024",
      totalVisits: 15,
      conditions: ["Artritis", "Hipertensión"]
    },
  ];

  const medicalRecords = [
    {
      id: 1,
      date: "15 Dic 2024",
      type: "Consulta General",
      diagnosis: "Control de hipertensión",
      treatment: "Continuar con medicación actual",
      doctor: "Dr. Carlos Mendoza",
      notes: "Paciente estable, presión arterial controlada"
    },
    {
      id: 2,
      date: "10 Nov 2024",
      type: "Seguimiento",
      diagnosis: "Diabetes Tipo 2",
      treatment: "Ajustar dosis de metformina",
      doctor: "Dr. Ana García",
      notes: "Glicemia mejorada, continuar dieta"
    },
    {
      id: 3,
      date: "05 Oct 2024",
      type: "Consulta Especializada",
      diagnosis: "Evaluación cardiológica",
      treatment: "Ecocardiograma programado",
      doctor: "Dr. Luis Rodríguez",
      notes: "Función cardíaca normal"
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.document.includes(searchQuery)
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Historiales Médicos</Text>
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
            placeholder="Buscar paciente por nombre o documento..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Lista de Pacientes */}
      <View style={styles.patientsContainer}>
        <Text style={styles.sectionTitle}>Seleccionar Paciente</Text>
        {filteredPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={[
              styles.patientCard,
              selectedPatient?.id === patient.id && styles.selectedPatientCard
            ]}
            onPress={() => setSelectedPatient(patient)}
          >
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientDocument}>CC: {patient.document}</Text>
              <Text style={styles.patientLastVisit}>Última visita: {patient.lastVisit}</Text>
              <Text style={styles.patientVisits}>Total visitas: {patient.totalVisits}</Text>
            </View>
            <View style={styles.patientConditions}>
              {patient.conditions.map((condition, index) => (
                <View key={index} style={styles.conditionTag}>
                  <Text style={styles.conditionText}>{condition}</Text>
                </View>
              ))}
            </View>
            {selectedPatient?.id === patient.id && (
              <Ionicons name="checkmark-circle" size={24} color="#198754" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Historial del Paciente Seleccionado */}
      {selectedPatient && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Historial de {selectedPatient.name}</Text>
          
          {/* Resumen del Paciente */}
          <View style={styles.patientSummary}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="calendar-outline" size={20} color="#198754" />
                <Text style={styles.summaryNumber}>{selectedPatient.totalVisits}</Text>
                <Text style={styles.summaryLabel}>Visitas Totales</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="medical-outline" size={20} color="#1976D2" />
                <Text style={styles.summaryNumber}>{selectedPatient.conditions.length}</Text>
                <Text style={styles.summaryLabel}>Condiciones</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={20} color="#fd7e14" />
                <Text style={styles.summaryNumber}>30</Text>
                <Text style={styles.summaryLabel}>Días Última Visita</Text>
              </View>
            </View>
          </View>

          {/* Registros Médicos */}
          <View style={styles.recordsContainer}>
            <Text style={styles.recordsTitle}>Registros Médicos</Text>
            {medicalRecords.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <Text style={styles.recordType}>{record.type}</Text>
                </View>
                <Text style={styles.recordDoctor}>Dr. {record.doctor}</Text>
                <Text style={styles.recordDiagnosis}>
                  <Text style={styles.recordLabel}>Diagnóstico: </Text>
                  {record.diagnosis}
                </Text>
                <Text style={styles.recordTreatment}>
                  <Text style={styles.recordLabel}>Tratamiento: </Text>
                  {record.treatment}
                </Text>
                <Text style={styles.recordNotes}>
                  <Text style={styles.recordLabel}>Notas: </Text>
                  {record.notes}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Acciones Rápidas */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="document-text-outline" size={24} color="#1976D2" />
            <Text style={styles.quickActionText}>Exportar PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="print-outline" size={24} color="#198754" />
            <Text style={styles.quickActionText}>Imprimir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="share-outline" size={24} color="#fd7e14" />
            <Text style={styles.quickActionText}>Compartir</Text>
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
  selectedPatientCard: {
    borderWidth: 2,
    borderColor: "#198754",
    backgroundColor: "#E8F5E8",
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
  patientDocument: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  patientLastVisit: {
    fontSize: 12,
    color: "#198754",
    fontWeight: "600",
    marginBottom: 2,
  },
  patientVisits: {
    fontSize: 12,
    color: "#666",
  },
  patientConditions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 10,
  },
  conditionTag: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  conditionText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
  },
  historyContainer: {
    padding: 15,
  },
  patientSummary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  recordsContainer: {
    marginBottom: 20,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#198754",
  },
  recordType: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordDoctor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recordDiagnosis: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  recordTreatment: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
  },
  recordLabel: {
    fontWeight: "bold",
    color: "#333",
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
