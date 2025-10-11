import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { pacienteService } from '../../src/service/pacienteService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function MisCitasPaciente({ navigation }) {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMisCitas();
  }, []);

  const loadMisCitas = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 MisCitasPaciente - Usuario actual:', user);
      console.log('🔍 MisCitasPaciente - user.id:', user?.id);
      
      const response = await pacienteService.getMisCitas(user?.id || 1);
      console.log('📅 MisCitasPaciente - Respuesta completa:', response);
      
      if (response.success) {
        console.log('📅 MisCitasPaciente - Citas obtenidas:', response.data);
        setCitas(response.data || []);
      } else {
        console.log('❌ MisCitasPaciente - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar citas');
        setCitas([]);
      }
    } catch (error) {
      console.error('❌ MisCitasPaciente - Error al cargar mis citas:', error);
      Alert.alert('Error', 'Error al cargar las citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMisCitas();
    setRefreshing(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('dddd, DD [de] MMMM [de] YYYY');
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

  const getStatusText = (estado) => {
    switch (estado) {
      case 'programada': return 'Programada';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return 'Programada';
    }
  };

  const handleCancelarCita = async (citaId) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que quieres cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await pacienteService.cancelarCita(citaId);
              if (response.success) {
                Alert.alert('Éxito', 'Cita cancelada correctamente');
                loadMisCitas(); // Recargar las citas
              } else {
                Alert.alert('Error', response.message || 'Error al cancelar cita');
              }
            } catch (error) {
              console.error('Error al cancelar cita:', error);
              Alert.alert('Error', 'Error al cancelar la cita');
            }
          }
        }
      ]
    );
  };

  const renderCita = ({ item: cita }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={20} color="#4CAF50" />
          <Text style={styles.timeText}>{formatTime(cita.hora)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) }]}>
          <Text style={styles.statusText}>{getStatusText(cita.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.citaContent}>
        <Text style={styles.fechaText}>
          {formatDate(cita.fecha)}
        </Text>
        
        <View style={styles.citaDetails}>
          <Text style={styles.doctorName}>
            Dr. {cita.medico_nombre} {cita.medico_apellido}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="medical" size={16} color="#666" />
            <Text style={styles.detailText}>
              {cita.especialidad_nombre || 'Sin especialidad'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.detailText}>
              Consultorio General
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#666" />
            <Text style={styles.detailText}>
              {cita.motivo || 'Sin motivo especificado'}
            </Text>
          </View>
        </View>
      </View>
      
      {cita.estado === 'programada' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelarCita(cita.id)}
        >
          <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No tienes citas</Text>
      <Text style={styles.emptyStateText}>
        No tienes citas programadas en este momento
      </Text>
      <TouchableOpacity
        style={styles.agendarButton}
        onPress={() => navigation.navigate('AgendarCita')}
      >
        <Text style={styles.agendarButtonText}>Agendar Nueva Cita</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando citas...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AgendarCita')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {citas.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={citas}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  addButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  citaContent: {
    padding: 16,
  },
  fechaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  citaDetails: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 12,
    margin: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  agendarButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  agendarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});