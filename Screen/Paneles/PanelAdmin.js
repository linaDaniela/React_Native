import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";
import DirectLogoutButton from "../../components/DirectLogoutButton";
import { getStoredUser } from "../../src/service/AuthService";

export default function PanelAdmin() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { user: userData } = await getStoredUser();
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Panel Administrativo</Text>
            <Text style={styles.subtitle}>Gestión completa del sistema</Text>
          </View>
          <DirectLogoutButton style={styles.logoutButton} navigation={navigation} />
        </View>
      </View>

      {/* Información del Administrador */}
      <View style={styles.userInfoCard}>
        <View style={styles.userAvatar}>
          <Ionicons name="shield-checkmark" size={40} color="#dc3545" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user ? `${user.nombre || user.name || 'Usuario'} ${user.apellido || ''}` : 'Cargando...'}
          </Text>
          <Text style={styles.userEmail}>
            {user ? user.email : 'Cargando...'}
          </Text>
          <Text style={styles.userRole}>
            {user ? (user.role === 'admin' ? 'Administrador' : user.role) : 'Cargando...'}
          </Text>
        </View>
      </View>

      {/* Gestión de Usuarios */}
      <Text style={styles.sectionTitle}>Gestión de Usuarios</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Crear Médico"
          description="Registrar nuevo médico en el sistema"
          icon="medical-outline"
          onPress={() => navigation.navigate("CrearMedico")}
        />
        <CardComponent
          title="Crear Administrador"
          description="Registrar nuevo administrador"
          icon="person-add-outline"
          onPress={() => navigation.navigate("CrearAdmin")}
        />
        <CardComponent
          title="Lista de Usuarios"
          description="Ver todos los usuarios del sistema"
          icon="people-outline"
          onPress={() => navigation.navigate("ListaUsuarios")}
        />
      </View>

      {/* Gestión del Sistema */}
      <Text style={styles.sectionTitle}>Gestión del Sistema</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Pacientes"
          description="Gestión completa de pacientes"
          icon="people-outline"
          onPress={() => navigation.navigate("PacientesFlow")}
        />
        <CardComponent
          title="Médicos"
          description="Gestión de médicos y especialidades"
          icon="medkit-outline"
          onPress={() => navigation.navigate("Medico")}
        />
        <CardComponent
          title="Citas"
          description="Gestión de citas médicas"
          icon="calendar-outline"
          onPress={() => navigation.navigate("CitasFlow")}
        />
        <CardComponent
          title="Especialidades"
          description="Gestión de especialidades médicas"
          icon="library-outline"
          onPress={() => navigation.navigate("Especialidades")}
        />
        <CardComponent
          title="EPS"
          description="Gestión de EPS y afiliaciones"
          icon="business-outline"
          onPress={() => navigation.navigate("EpsFlow")}
        />
        <CardComponent
          title="Consultorios"
          description="Gestión de consultorios"
          icon="home-outline"
          onPress={() => navigation.navigate("Consultorios")}
        />
      </View>

      {/* Estadísticas del Sistema */}
      <Text style={styles.sectionTitle}>Estadísticas del Sistema</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={28} color="#1976D2" />
          <Text style={styles.summaryNumber}>1,250</Text>
          <Text>Pacientes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="medical-outline" size={28} color="#198754" />
          <Text style={styles.summaryNumber}>45</Text>
          <Text>Médicos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="calendar-outline" size={28} color="#fd7e14" />
          <Text style={styles.summaryNumber}>3,200</Text>
          <Text>Citas Totales</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="business-outline" size={28} color="#6f42c1" />
          <Text style={styles.summaryNumber}>5</Text>
          <Text>EPS</Text>
        </View>
      </View>


      {/* Acciones Rápidas */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="person-add-outline" size={24} color="#198754" />
          <Text style={styles.quickActionText}>Nuevo Médico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="people-outline" size={24} color="#1976D2" />
          <Text style={styles.quickActionText}>Ver Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="calendar-outline" size={24} color="#fd7e14" />
          <Text style={styles.quickActionText}>Ver Citas</Text>
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
    backgroundColor: "#dc3545",
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
    backgroundColor: "#FFEBEE",
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
    color: "#dc3545",
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
