import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function ReportesMedico({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

  const renderInfoCard = (title, value, icon, color) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoValue}>{value}</Text>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil Médico</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil Principal */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileIcon}>
                <Ionicons name="medical" size={60} color="#4CAF50" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  Dr. {user?.nombre} {user?.apellido}
                </Text>
                <Text style={styles.profileRole}>Médico</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoGrid}>
            {renderInfoCard(
              'ID Médico',
              `#${user?.id || 'N/A'}`,
              'id-card',
              '#4CAF50'
            )}
            {renderInfoCard(
              'Teléfono',
              user?.telefono || 'No disponible',
              'call',
              '#2196F3'
            )}
            {renderInfoCard(
              'Email',
              user?.email || 'No disponible',
              'mail',
              '#FF9800'
            )}
            {renderInfoCard(
              'Tipo de Usuario',
              'Médico',
              'shield-checkmark',
              '#9C27B0'
            )}
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          {renderActionCard(
            "Ver Mi Agenda",
            "Consultar tu agenda médica",
            "calendar-outline",
            () => navigation.navigate("MiAgendaMedico"),
            "#4CAF50"
          )}
          
          {renderActionCard(
            "Ver Mis Citas",
            "Gestionar todas tus citas",
            "list-outline",
            () => navigation.navigate("MisCitasMedico"),
            "#4CAF50"
          )}
          
          {renderActionCard(
            "Ver Pacientes",
            "Consultar información de pacientes",
            "people-outline",
            () => navigation.navigate("Pacientes"),
            "#4CAF50"
          )}
          
          {renderActionCard(
            "Editar Perfil",
            "Modificar mi información personal",
            "person-outline",
            () => navigation.navigate("Perfil"),
            "#4CAF50"
          )}
        </View>

        {/* Información del Sistema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Sistema</Text>
          
          <View style={styles.systemCard}>
            <View style={styles.systemContent}>
              <Ionicons name="information-circle" size={24} color="#4CAF50" />
              <View style={styles.systemText}>
                <Text style={styles.systemTitle}>Sistema de Gestión Médica</Text>
                <Text style={styles.systemDescription}>
                  Bienvenido al sistema de gestión médica. Aquí puedes administrar tus citas, 
                  consultar tu agenda y gestionar la información de tus pacientes.
                </Text>
              </View>
            </View>
          </View>
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
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
  systemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  systemText: {
    flex: 1,
    marginLeft: 12,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  systemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});