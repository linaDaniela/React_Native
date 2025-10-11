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
  RefreshControl,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/service/conexion';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function MisCitasMedico({ navigation }) {
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
      console.log('🔍 MisCitasMedico - Cargando citas para médico:', user?.id);
      
      // Obtener todas las citas (el médico puede ver todas las citas)
      const response = await api.get('/citas');
      
      if (response.data.success) {
        console.log('📅 MisCitasMedico - Citas obtenidas:', response.data.data?.length || 0);
        setCitas(response.data.data || []);
      } else {
        console.error('❌ MisCitasMedico - Error en respuesta:', response.data.message);
        Alert.alert('Error', response.data.message || 'Error al cargar citas');
        setCitas([]);
      }
    } catch (error) {
      console.error('❌ MisCitasMedico - Error al cargar citas:', error);
      Alert.alert('Error', 'Error al cargar las citas médicas');
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

  const handleConfirmarCita = async (citaId) => {
    Alert.alert(
      'Confirmar Cita',
      '¿Estás seguro de que quieres confirmar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const response = await api.put(`/medico/citas/${citaId}/estado`, { estado: 'confirmada' });
              if (response.data.success) {
                Alert.alert('Éxito', 'Cita confirmada correctamente');
                loadMisCitas();
              } else {
                Alert.alert('Error', response.data.message || 'Error al confirmar cita');
              }
            } catch (error) {
              console.error('Error al confirmar cita:', error);
              Alert.alert('Error', 'Error al confirmar la cita');
            }
          }
        }
      ]
    );
  };

  const handleCompletarCita = async (citaId) => {
    Alert.alert(
      'Completar Cita',
      '¿Estás seguro de que quieres marcar esta cita como completada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async () => {
            try {
              const response = await api.put(`/medico/citas/${citaId}/estado`, { estado: 'completada' });
              if (response.data.success) {
                Alert.alert('Éxito', 'Cita completada correctamente');
                loadMisCitas();
              } else {
                Alert.alert('Error', response.data.message || 'Error al completar cita');
              }
            } catch (error) {
              console.error('Error al completar cita:', error);
              Alert.alert('Error', 'Error al completar la cita');
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
          <Text style={styles.pacienteName}>
            {cita.paciente_nombre} {cita.paciente_apellido}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.detailText}>
              {cita.paciente_telefono || 'Sin teléfono'}
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
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirmarCita(cita.id)}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {cita.estado === 'confirmada' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompletarCita(cita.id)}
          >
            <Text style={styles.completeButtonText}>Completar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No tienes citas</Text>
      <Text style={styles.emptyStateText}>
        No tienes citas asignadas en este momento
      </Text>
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
          style={styles.refreshButton}
          onPress={loadMisCitas}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
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
  refreshButton: {
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
  pacienteName: {
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  completeButtonText: {
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
  },
});