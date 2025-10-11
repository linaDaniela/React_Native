import React, { useState, useEffect } from 'react';
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
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { citasService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es'; // Import Spanish locale
import CrearCitaModal from '../../src/components/CrearCitaModal';
import EditarCitaModal from '../../src/components/EditarCitaModal';

moment.locale('es'); // Set locale to Spanish

export default function CitasScreen({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);

  // Función para asegurar que citas siempre sea un array
  const getCitasArray = () => {
    return Array.isArray(citas) ? citas : [];
  };

  useEffect(() => {
    loadUserDataAndRole();
    loadCitas();
  }, []);

  const loadUserDataAndRole = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setUserRole(parsedData.tipo || 'paciente');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadCitas = async () => {
    try {
      setLoading(true);
      console.log('🔍 CitasScreen - Cargando citas...');
      
      const response = await citasService.getAll();
      
      console.log('📅 CitasScreen - Respuesta completa:', response);
      
      if (response.success) {
        console.log('📅 CitasScreen - Citas obtenidas:', response.data?.length || 0);
        setCitas(response.data || []);
      } else {
        console.error('❌ CitasScreen - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar citas');
        setCitas([]);
      }
    } catch (error) {
      console.error('❌ CitasScreen - Error al cargar citas:', error);
      Alert.alert('Error', 'Error al cargar las citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCitas();
    setRefreshing(false);
  };

  const handleAddCita = () => {
    setShowCrearModal(true);
  };

  const handleEditCita = (cita) => {
    setCitaEditando(cita);
    setShowEditarModal(true);
  };

  const handleDeleteCita = (citaId) => {
    Alert.alert(
      'Eliminar Cita',
      '¿Estás seguro de que quieres eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await citasService.delete(citaId);
              if (response.success) {
                Alert.alert('Éxito', 'Cita eliminada correctamente');
                loadCitas();
              } else {
                Alert.alert('Error', response.message || 'Error al eliminar cita');
              }
            } catch (error) {
              console.error('Error al eliminar cita:', error);
              Alert.alert('Error', 'Error al eliminar la cita');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'programada': return '#FF9800';
      case 'confirmada': return '#2196F3';
      case 'cancelada': return '#F44336';
      case 'completada': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'programada': return 'time';
      case 'confirmada': return 'checkmark';
      case 'cancelada': return 'close-circle';
      case 'completada': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const renderCitaCard = (cita) => (
    <View key={cita.id} style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.citaInfo}>
          <Text style={styles.citaDoctor}>
            Dr. {cita.medico_nombre || 'N/A'} {cita.medico_apellido || ''}
          </Text>
          <Text style={styles.citaSpecialty}>
            {cita.especialidad_nombre || 'Sin especialidad'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) }]}>
          <Ionicons name={getStatusIcon(cita.estado)} size={16} color="#fff" />
          <Text style={styles.statusText}>
            {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.citaContent}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {moment(cita.fecha).format('DD/MM/YYYY')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {moment(cita.hora, 'HH:mm:ss').format('HH:mm')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.detailText}>
            {cita.paciente_nombre || 'N/A'} {cita.paciente_apellido || ''}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="document-text" size={16} color="#666" />
          <Text style={styles.detailText}>
            {cita.motivo || 'Sin motivo especificado'}
          </Text>
        </View>
      </View>
      
      {(userRole === 'admin' || userRole === 'medico') && (
        <View style={styles.citaActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditCita(cita)}
          >
            <Ionicons name="create-outline" size={16} color="#4CAF50" />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCita(cita.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#F44336" />
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
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
          <Text style={styles.headerTitle}>Citas Médicas</Text>
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
        <Text style={styles.headerTitle}>Citas Médicas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCita}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gestión de Citas</Text>
          <Text style={styles.subtitle}>
            {getCitasArray().length} citas encontradas
          </Text>
        </View>

        {getCitasArray().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay citas</Text>
            <Text style={styles.emptyText}>No tienes citas agendadas en este momento</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddCita}
            >
              <Text style={styles.emptyButtonText}>Agendar Nueva Cita</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.citasList}>
            {getCitasArray().map(renderCitaCard)}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <CrearCitaModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onSuccess={() => {
          setShowCrearModal(false);
          loadCitas();
        }}
      />

      <EditarCitaModal
        visible={showEditarModal}
        cita={citaEditando}
        onClose={() => {
          setShowEditarModal(false);
          setCitaEditando(null);
        }}
        onSuccess={() => {
          setShowEditarModal(false);
          setCitaEditando(null);
          loadCitas();
        }}
      />
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
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  citasList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  citaInfo: {
    flex: 1,
  },
  citaDoctor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  citaSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  citaContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  citaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  editButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff0f0',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});