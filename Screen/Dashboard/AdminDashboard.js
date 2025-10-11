import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import EstadisticasDashboard from "../../src/components/EstadisticasDashboard";

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para forzar actualización de estadísticas
  const triggerStatsRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: async () => {
            await logout();
            // No navegar manualmente, el AuthContext maneja la navegación
            // navigation.replace("Login");
          }
        }
      ]
    );
  };

  const renderActionCard = (title, description, icon, onPress, iconColor = '#4CAF50') => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionCardContent}>
        <View style={[styles.actionIcon, { backgroundColor: '#f0f0f0' }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Panel Administrativo</Text>
          <Text style={styles.headerSubtitle}>Gestión completa del sistema</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Perfil del Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.profileIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.nombre} {user?.apellido}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileRole}>Super Administrador</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas del Sistema</Text>
          <EstadisticasDashboard refreshTrigger={refreshTrigger} />
        </View>

        {/* Gestión de Usuarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Usuarios</Text>
          {renderActionCard(
            "Crear Médico",
            "Registrar nuevo médico en el sistema",
            "medical-outline",
            () => navigation.navigate("Medicos"),
            "#4CAF50"
          )}
          {renderActionCard(
            "Crear Administrador",
            "Registrar nuevo administrador",
            "person-add-outline",
            () => navigation.navigate("Administradores"),
            "#4CAF50"
          )}
          {renderActionCard(
            "Crear Pacientes",
            "Registrar nuevo paciente en el sistema",
            "people-outline",
            () => navigation.navigate("Pacientes"),
            "#4CAF50"
          )}
        </View>

        {/* Gestión de Entidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Entidades</Text>
          {renderActionCard(
            "Crear Especialidad",
            "Registrar nueva especialidad médica",
            "library-outline",
            () => navigation.navigate("Especialidades"),
            "#4CAF50"
          )}
        </View>

        {/* Gestión de Citas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Citas</Text>
          {renderActionCard(
            "Ver Todas las Citas",
            "Gestionar todas las citas del sistema",
            "calendar-outline",
            () => navigation.navigate("Citas"),
            "#4CAF50"
          )}
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          {renderActionCard(
            "Mi Perfil",
            "Ver y editar mi información personal",
            "person-outline",
            () => navigation.navigate("Perfil"),
            "#4CAF50"
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});