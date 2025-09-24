import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function EmitirRecetas() {
  const navigation = useNavigation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const patients = [
    { id: 1, name: "Juan Pérez", document: "12345678" },
    { id: 2, name: "María López", document: "87654321" },
    { id: 3, name: "Pedro García", document: "11223344" },
  ];

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency && newMedication.duration) {
      setMedications([...medications, { ...newMedication, id: Date.now() }]);
      setNewMedication({ name: "", dosage: "", frequency: "", duration: "" });
    } else {
      Alert.alert("Error", "Todos los campos del medicamento son obligatorios");
    }
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const generatePrescription = () => {
    if (!selectedPatient) {
      Alert.alert("Error", "Debe seleccionar un paciente");
      return;
    }
    if (medications.length === 0) {
      Alert.alert("Error", "Debe agregar al menos un medicamento");
      return;
    }
    Alert.alert("Éxito", "Receta generada correctamente");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Emitir Recetas</Text>
        <TouchableOpacity onPress={generatePrescription}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Selección de Paciente */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Seleccionar Paciente</Text>
        <View style={styles.patientSelector}>
          {patients.map((patient) => (
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
              </View>
              {selectedPatient?.id === patient.id && (
                <Ionicons name="checkmark-circle" size={24} color="#198754" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Información del Paciente Seleccionado */}
      {selectedPatient && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información del Paciente</Text>
          <View style={styles.patientDetailsCard}>
            <Text style={styles.patientDetailsName}>{selectedPatient.name}</Text>
            <Text style={styles.patientDetailsDocument}>Documento: {selectedPatient.document}</Text>
            <Text style={styles.patientDetailsDate}>Fecha: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      )}

      {/* Agregar Medicamentos */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Medicamentos</Text>
        
        <View style={styles.medicationForm}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del medicamento"
            value={newMedication.name}
            onChangeText={(text) => setNewMedication({...newMedication, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosis (ej: 500mg)"
            value={newMedication.dosage}
            onChangeText={(text) => setNewMedication({...newMedication, dosage: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Frecuencia (ej: Cada 8 horas)"
            value={newMedication.frequency}
            onChangeText={(text) => setNewMedication({...newMedication, frequency: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Duración (ej: 7 días)"
            value={newMedication.duration}
            onChangeText={(text) => setNewMedication({...newMedication, duration: text})}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMedication}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Agregar Medicamento</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Medicamentos */}
        {medications.length > 0 && (
          <View style={styles.medicationsList}>
            <Text style={styles.medicationsListTitle}>Medicamentos Prescritos:</Text>
            {medications.map((medication) => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {medication.dosage} - {medication.frequency} - {medication.duration}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMedication(medication.id)}
                >
                  <Ionicons name="close" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Instrucciones Generales */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Instrucciones Generales</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Instrucciones adicionales para el paciente..."
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Botón Generar Receta */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={generatePrescription}>
          <Ionicons name="document-text" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>Generar Receta</Text>
        </TouchableOpacity>
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
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  patientSelector: {
    marginBottom: 10,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  selectedPatientCard: {
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
    fontSize: 14,
    color: "#666",
  },
  patientDetailsCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  patientDetailsName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  patientDetailsDocument: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  patientDetailsDate: {
    fontSize: 14,
    color: "#198754",
    fontWeight: "600",
  },
  medicationForm: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  medicationsList: {
    marginTop: 15,
  },
  medicationsListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  medicationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionContainer: {
    padding: 20,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 8,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
