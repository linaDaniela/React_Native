import React from "react";
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

export default function MedicoDashboard({ navigation }) {
  const { user, logout } = useAuth();

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
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Panel del Médico</Text>
          <Text style={styles.headerSubtitle}>Gestiona tu práctica médica</Text>
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
              <Ionicons name="medical" size={32} color="#4CAF50" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                Dr. {user?.nombre} {user?.apellido}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileRole}>Médico</Text>
            </View>
          </View>
        </View>

        {/* Gestión de Citas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Citas</Text>
          {renderActionCard(
            "Mis Citas",
            "Ver y gestionar mis citas médicas",
            "calendar-outline",
            () => navigation.navigate("MisCitasMedico"),
            "#4CAF50"
          )}
          {renderActionCard(
            "Mi Agenda",
            "Ver mi agenda y horarios",
            "time-outline",
            () => navigation.navigate("MiAgendaMedico"),
            "#4CAF50"
          )}
        </View>

        {/* Gestión de Pacientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Pacientes</Text>
          {renderActionCard(
            "Mis Pacientes",
            "Ver información de mis pacientes",
            "people-outline",
            () => navigation.navigate("Pacientes"),
            "#4CAF50"
          )}
        </View>

        {/* Reportes y Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reportes y Estadísticas</Text>
          {renderActionCard(
            "Reportes",
            "Ver reportes y estadísticas médicas",
            "bar-chart-outline",
            () => navigation.navigate("ReportesMedico"),
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
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