import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { pacienteService } from "../../src/service/pacienteService";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export default function PacienteDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [proximaCita, setProximaCita] = useState(null);
  const [loadingCita, setLoadingCita] = useState(true);

  useEffect(() => {
    loadProximaCita();
  }, []);

  const loadProximaCita = useCallback(async () => {
    try {
      setLoadingCita(true);
      console.log('🔍 PacienteDashboard - Cargando próxima cita para paciente:', user?.id);
      
      const response = await pacienteService.getProximaCita(user?.id || 1);
      
      if (response.success && response.data) {
        console.log('📅 Próxima cita cargada:', response.data);
        setProximaCita(response.data);
      } else {
        console.log('📅 No hay próxima cita disponible');
        setProximaCita(null);
      }
    } catch (error) {
      console.error('❌ Error al cargar próxima cita:', error);
      setProximaCita(null);
    } finally {
      setLoadingCita(false);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              console.log('Sesión cerrada exitosamente');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'completada':
        return '#4CAF50';
      case 'confirmada':
        return '#2196F3';
      case 'programada':
        return '#FF9800';
      case 'cancelada':
        return '#F44336';
      default:
        return '#757575';
    }
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
          <Text style={styles.headerTitle}>Panel del Paciente</Text>
          <Text style={styles.headerSubtitle}>Gestiona tus citas médicas</Text>
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
              <Ionicons name="person" size={32} color="#4CAF50" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.nombre} {user?.apellido}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileRole}>Paciente</Text>
            </View>
          </View>
        </View>

        {/* Próxima Cita */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima Cita</Text>
          {loadingCita ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Cargando próxima cita...</Text>
            </View>
          ) : proximaCita ? (
            <View style={styles.citaCard}>
              <View style={styles.citaHeader}>
                <View style={styles.citaIcon}>
                  <Ionicons name="calendar" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.citaDate}>
                  {moment(proximaCita.fecha).format('DD MMM YYYY')}
                </Text>
              </View>
              <View style={styles.citaDetails}>
                <Text style={styles.citaDoctor}>
                  Dr. {proximaCita.medico_nombre} {proximaCita.medico_apellido}
                </Text>
                <Text style={styles.citaSpecialty}>
                  {proximaCita.especialidad_nombre || 'Sin especialidad'}
                </Text>
                <Text style={styles.citaTime}>
                  {moment(proximaCita.hora, 'HH:mm:ss').format('HH:mm')}
                </Text>
                <Text style={styles.citaMotivo}>
                  Motivo: {proximaCita.motivo || 'Sin motivo especificado'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proximaCita.estado) }]}>
                  <Text style={styles.statusText}>
                    {proximaCita.estado ? proximaCita.estado.charAt(0).toUpperCase() + proximaCita.estado.slice(1) : 'Sin estado'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noCitaCard}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.noCitaText}>No tienes citas programadas</Text>
            </View>
          )}
        </View>

        {/* Gestión de Citas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Citas</Text>
          {renderActionCard(
            "Mis Citas",
            "Ver todas tus citas médicas",
            "list-outline",
            () => navigation.navigate("MisCitas"),
            "#4CAF50"
          )}
          {renderActionCard(
            "Agendar Cita",
            "Reservar una nueva cita médica",
            "add-circle-outline",
            () => navigation.navigate("AgendarCita"),
            "#4CAF50"
          )}
          {renderActionCard(
            "Historial Médico",
            "Ver tu historial de citas",
            "document-text-outline",
            () => navigation.navigate("Historial"),
            "#4CAF50"
          )}
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          {renderActionCard(
            "Mi Perfil",
            "Ver y editar tu información personal",
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
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  citaIcon: {
    marginRight: 8,
  },
  citaDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  citaDetails: {
    marginBottom: 12,
  },
  citaDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  citaSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  citaTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  citaMotivo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  noCitaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noCitaText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
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