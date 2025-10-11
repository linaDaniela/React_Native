import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { pacienteService } from '../../src/service/pacienteService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const HistorialPaciente = ({ navigation }) => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // todos, completadas, canceladas
  const [filtroFecha, setFiltroFecha] = useState('todos'); // todos, hoy, semana, mes

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      console.log('🔍 HistorialPaciente - Cargando historial para paciente:', user?.id);
      
      // Obtener todas las citas del paciente (historial completo)
      const response = await pacienteService.getMiHistorial(user?.id || 1);
      console.log('📊 HistorialPaciente - Respuesta completa:', response);
      
      if (response.success) {
        console.log('📊 HistorialPaciente - Citas obtenidas:', response.data?.length || 0);
        // Asegurar que siempre sea un array
        const citasData = Array.isArray(response.data) ? response.data : [];
        setHistorial(citasData);
      } else {
        console.error('❌ HistorialPaciente - Error en respuesta:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar el historial');
        setHistorial([]); // Asegurar que sea un array vacío
      }
    } catch (error) {
      console.error('❌ HistorialPaciente - Error al cargar historial:', error);
      Alert.alert('Error', 'Error al cargar el historial médico');
      setHistorial([]); // Asegurar que sea un array vacío
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistorial();
    setRefreshing(false);
  };

  const filtrarCitas = (citas) => {
    // Validar que citas sea un array
    if (!Array.isArray(citas)) {
      console.warn('filtrarCitas: citas no es un array:', citas);
      return [];
    }

    let citasFiltradas = [...citas];

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtroEstado);
    }

    // Filtrar por fecha
    if (filtroFecha !== 'todos') {
      const ahora = moment();
      citasFiltradas = citasFiltradas.filter(cita => {
        const fechaCita = moment(cita.fecha);
        switch (filtroFecha) {
          case 'hoy':
            return fechaCita.isSame(ahora, 'day');
          case 'semana':
            return fechaCita.isSame(ahora, 'week');
          case 'mes':
            return fechaCita.isSame(ahora, 'month');
          default:
            return true;
        }
      });
    }

    // Ordenar por fecha más reciente primero
    return citasFiltradas.sort((a, b) => moment(b.fecha).diff(moment(a.fecha)));
  };

  const getEstadoColor = (estado) => {
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

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada':
        return 'checkmark-circle';
      case 'confirmada':
        return 'checkmark';
      case 'programada':
        return 'time';
      case 'cancelada':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return moment(timeString, 'HH:mm:ss').format('HH:mm');
  };

  const renderCitaItem = ({ item: cita }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.fechaContainer}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.fechaText}>{formatDate(cita.fecha)}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          <Ionicons name={getEstadoIcon(cita.estado)} size={16} color="#fff" />
          <Text style={styles.estadoText}>{cita.estado}</Text>
        </View>
      </View>
      
      <View style={styles.citaContent}>
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
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatTime(cita.hora)}
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
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No hay historial</Text>
      <Text style={styles.emptyStateText}>
        No tienes citas registradas en tu historial médico
      </Text>
    </View>
  );

  const renderFiltros = () => (
    <View style={styles.filtrosContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtrosRow}>
          {/* Filtro por Estado */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Estado:</Text>
            <View style={styles.filtroButtons}>
              {['todos', 'programada', 'confirmada', 'completada', 'cancelada'].map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    styles.filtroButton,
                    filtroEstado === estado && styles.filtroButtonSelected
                  ]}
                  onPress={() => setFiltroEstado(estado)}
                >
                  <Text style={[
                    styles.filtroButtonText,
                    filtroEstado === estado && styles.filtroButtonTextSelected
                  ]}>
                    {estado === 'todos' ? 'Todos' : estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const citasFiltradas = filtrarCitas(historial);

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
          <Text style={styles.headerTitle}>Mi Historial</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
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
        <Text style={styles.headerTitle}>Mi Historial</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filtros */}
      {renderFiltros()}

      {/* Content */}
      <View style={styles.content}>
        {citasFiltradas.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={citasFiltradas}
            renderItem={renderCitaItem}
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
};

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
  filtrosContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtrosRow: {
    paddingHorizontal: 16,
  },
  filtroGroup: {
    marginBottom: 8,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filtroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filtroButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filtroButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  filtroButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filtroButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fechaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  citaContent: {
    padding: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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

export default HistorialPaciente;