import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";
import DirectLogoutButton from "../../components/DirectLogoutButton";
import { getStoredUser } from "../../src/service/AuthService";
import EstadisticasService from "../../src/service/EstadisticasService";

export default function PanelAdmin() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total_pacientes: 0,
    total_medicos: 0,
    total_citas: 0,
    total_eps: 0,
    total_consultorios: 0,
    total_especialidades: 0
  });
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(true);

  useEffect(() => {
    loadUserData();
    loadEstadisticas();
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

  const loadEstadisticas = async () => {
    try {
      console.log('📊 Cargando estadísticas del sistema...');
      setCargandoEstadisticas(true);
      
      const result = await EstadisticasService.obtenerEstadisticasGenerales();
      
      if (result.success) {
        console.log('✅ Estadísticas cargadas:', result.data);
        setEstadisticas(result.data);
      } else {
        console.log('⚠️ Error al cargar estadísticas:', result.message);
        // Mantener valores por defecto en caso de error
      }
    } catch (error) {
      console.error('❌ Error inesperado al cargar estadísticas:', error);
    } finally {
      setCargandoEstadisticas(false);
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
          title="Crear Pacientes"
          description="Registrar nuevo paciente en el sistema"
          icon="person-add-outline"
          onPress={() => navigation.navigate("CrearPaciente")}
        />
      </View>

      {/* Gestión de Entidades del Sistema */}
      <Text style={styles.sectionTitle}>Gestión de Entidades</Text>
      <View style={styles.listContainer}>
        <CardComponent
          title="Crear EPS"
          description="Registrar nueva EPS en el sistema"
          icon="business-outline"
          onPress={() => navigation.navigate("CrearEps")}
        />
        <CardComponent
          title="Crear Especialidad"
          description="Registrar nueva especialidad médica"
          icon="library-outline"
          onPress={() => navigation.navigate("CrearEspecialidad")}
        />
        <CardComponent
          title="Crear Consultorio"
          description="Registrar nuevo consultorio"
          icon="home-outline"
          onPress={() => navigation.navigate("CrearConsultorio")}
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Estadísticas del Sistema</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadEstadisticas}
          disabled={cargandoEstadisticas}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={cargandoEstadisticas ? "#ccc" : "#1976D2"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={28} color="#1976D2" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#1976D2" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_pacientes}</Text>
          )}
          <Text>Pacientes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="medical-outline" size={28} color="#198754" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#198754" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_medicos}</Text>
          )}
          <Text>Médicos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="calendar-outline" size={28} color="#fd7e14" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#fd7e14" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_citas}</Text>
          )}
          <Text>Citas Totales</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="business-outline" size={28} color="#6f42c1" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#6f42c1" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_eps}</Text>
          )}
          <Text>EPS</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="home-outline" size={28} color="#20c997" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#20c997" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_consultorios}</Text>
          )}
          <Text>Consultorios</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="library-outline" size={28} color="#e83e8c" />
          {cargandoEstadisticas ? (
            <ActivityIndicator size="small" color="#e83e8c" />
          ) : (
            <Text style={styles.summaryNumber}>{estadisticas.total_especialidades}</Text>
          )}
          <Text>Especialidades</Text>
        </View>
      </View>


      {/* Acciones Rápidas */}
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CrearMedico")}
        >
          <Ionicons name="person-add-outline" size={24} color="#198754" />
          <Text style={styles.quickActionText}>Nuevo Médico</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("PacientesFlow")}
        >
          <Ionicons name="people-outline" size={24} color="#1976D2" />
          <Text style={styles.quickActionText}>Ver Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CitasFlow")}
        >
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
