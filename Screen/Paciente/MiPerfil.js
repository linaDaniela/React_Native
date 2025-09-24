import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MiPerfil() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos del usuario (en una app real vendrían de la base de datos)
  const [userData, setUserData] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    email: "paciente@eps.com",
    telefono: "300-123-4567",
    fechaNacimiento: "15/03/1985",
    documento: "12345678",
    eps: "Sanitas",
    tipoSangre: "O+",
    alergias: "Ninguna",
    medicamentos: "Metformina 500mg",
  });

  const handleSave = () => {
    Alert.alert("Éxito", "Perfil actualizado correctamente");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
          <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Foto de Perfil */}
      <View style={styles.profilePhotoContainer}>
        <View style={styles.profilePhoto}>
          <Ionicons name="person" size={60} color="#1976D2" />
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Ionicons name="camera" size={16} color="#1976D2" />
          <Text style={styles.changePhotoText}>Cambiar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Información Personal */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.nombre}
            onChangeText={(text) => setUserData({...userData, nombre: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Apellido</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.apellido}
            onChangeText={(text) => setUserData({...userData, apellido: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.email}
            onChangeText={(text) => setUserData({...userData, email: text})}
            editable={isEditing}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teléfono</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.telefono}
            onChangeText={(text) => setUserData({...userData, telefono: text})}
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.fechaNacimiento}
            onChangeText={(text) => setUserData({...userData, fechaNacimiento: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Documento de Identidad</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.documento}
            onChangeText={(text) => setUserData({...userData, documento: text})}
            editable={isEditing}
          />
        </View>
      </View>

      {/* Información Médica */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Información Médica</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EPS</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.eps}
            onChangeText={(text) => setUserData({...userData, eps: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tipo de Sangre</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.tipoSangre}
            onChangeText={(text) => setUserData({...userData, tipoSangre: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Alergias</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.alergias}
            onChangeText={(text) => setUserData({...userData, alergias: text})}
            editable={isEditing}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Medicamentos Actuales</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={userData.medicamentos}
            onChangeText={(text) => setUserData({...userData, medicamentos: text})}
            editable={isEditing}
            multiline
          />
        </View>
      </View>

      {/* Botones de Acción */}
      {isEditing && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Información de Contacto de Emergencia */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
        <View style={styles.emergencyContactCard}>
          <View style={styles.emergencyContactInfo}>
            <Text style={styles.emergencyContactName}>María Pérez</Text>
            <Text style={styles.emergencyContactRelation}>Madre</Text>
            <Text style={styles.emergencyContactPhone}>📞 300-987-6543</Text>
          </View>
          <TouchableOpacity style={styles.editEmergencyButton}>
            <Ionicons name="create" size={16} color="#1976D2" />
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
  profilePhotoContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
    marginLeft: 5,
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
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f8f9fa",
    color: "#666",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-around",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#198754",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  emergencyContactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  emergencyContactRelation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  emergencyContactPhone: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
  },
  editEmergencyButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
