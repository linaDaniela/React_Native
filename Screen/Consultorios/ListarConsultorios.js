import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ConsultoriosService from '../../src/service/ConsultoriosService';

export default function ListarConsultorios({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [consultorios, setConsultorios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedConsultorio, setSelectedConsultorio] = useState(null);

  // Datos de ejemplo para consultorios
  const consultoriosEjemplo = [
    {
      id: 1,
      nombre: 'Consultorio Cardiología 1',
      numero: '101',
      piso: '1',
      edificio: 'Norte',
      direccion: 'Ala Norte - Piso 1',
      telefono: '(601) 123-4567',
      capacidad_pacientes: 2,
      equipos_medicos: 'Electrocardiógrafo, Monitor de presión arterial',
      estado: 'disponible',
    },
    {
      id: 2,
      nombre: 'Consultorio Dermatología 1',
      numero: '102',
      piso: '1',
      edificio: 'Norte',
      direccion: 'Ala Norte - Piso 1',
      telefono: '(601) 123-4568',
      capacidad_pacientes: 1,
      equipos_medicos: 'Dermatoscopio, Lámpara de Wood',
      estado: 'ocupado',
    },
    {
      id: 3,
      nombre: 'Consultorio Ortopedia 1',
      numero: '201',
      piso: '2',
      edificio: 'Sur',
      direccion: 'Ala Sur - Piso 2',
      telefono: '(601) 123-4569',
      capacidad_pacientes: 2,
      equipos_medicos: 'Rayos X portátil, Mesa de exploración',
      estado: 'disponible',
    },
  ];

  useEffect(() => {
    loadConsultorios();
  }, []);

  // Escuchar cambios cuando se regresa de editar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar consultorios cuando la pantalla recibe foco
      loadConsultorios();
    });

    return unsubscribe;
  }, [navigation]);

  const loadConsultorios = async () => {
    try {
      console.log('🔄 Cargando consultorios desde la base de datos...');
      
      // Primero probar la conexión
      console.log('🧪 Probando conexión...');
      const pruebaConexion = await ConsultoriosService.probarConexion();
      
      if (pruebaConexion.success) {
        console.log('✅ Conexión exitosa, cargando consultorios...');
        setConsultorios(pruebaConexion.data || []);
      } else {
        console.log('⚠️ Error en la conexión:', pruebaConexion.error);
        console.log('📋 Usando datos de ejemplo');
        setConsultorios(consultoriosEjemplo);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar consultorios:', error);
      console.log('📋 Usando datos de ejemplo como fallback');
      setConsultorios(consultoriosEjemplo);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConsultorios();
    setRefreshing(false);
  };

  const handleConsultorioPress = (consultorio) => {
    navigation.navigate('DetalleConsultorio', { consultorio });
  };

  const handleOptionsPress = (consultorio) => {
    setSelectedConsultorio(consultorio);
    setShowOptionsModal(true);
  };

  const handleEditConsultorio = () => {
    setShowOptionsModal(false);
    // Navegar a la pantalla de editar consultorio
    navigation.navigate('EditarConsultorio', { consultorio: selectedConsultorio });
  };

  const handleDeleteConsultorio = () => {
    setShowOptionsModal(false);
    
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar el consultorio "${selectedConsultorio?.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmDeleteConsultorio(),
        },
      ]
    );
  };

  const confirmDeleteConsultorio = async () => {
    try {
      console.log('🗑️ Eliminando consultorio:', selectedConsultorio.id);
      const result = await ConsultoriosService.eliminarConsultorio(selectedConsultorio.id);
      
      if (result.success) {
        console.log('✅ Consultorio eliminado exitosamente');
        Alert.alert('Éxito', 'Consultorio eliminado correctamente');
        // Recargar la lista de consultorios
        loadConsultorios();
      } else {
        console.log('❌ Error al eliminar consultorio:', result.message);
        Alert.alert('Error', result.message || 'No se pudo eliminar el consultorio');
      }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar consultorio:', error);
      Alert.alert('Error', 'Error de conexión. No se pudo eliminar el consultorio.');
    }
  };

  const handleAddConsultorio = () => {
    navigation.navigate('CrearConsultorio');
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible':
        return '#4CAF50';
      case 'ocupado':
        return '#F44336';
      case 'mantenimiento':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'Disponible';
      case 'ocupado':
        return 'Ocupado';
      case 'mantenimiento':
        return 'Mantenimiento';
      default:
        return estado;
    }
  };

  const renderConsultorio = ({ item }) => (
    <TouchableOpacity
      style={styles.consultorioCard}
      onPress={() => handleConsultorioPress(item)}
    >
      <View style={styles.consultorioHeader}>
        <View style={styles.consultorioInfo}>
          <View style={styles.consultorioIcon}>
            <Ionicons name="home-outline" size={24} color="#1976D2" />
          </View>
          <View style={styles.consultorioDetails}>
            <Text style={styles.consultorioName}>{item.nombre}</Text>
            <Text style={styles.consultorioLocation}>
              {item.edificio && item.piso ? `${item.edificio} - Piso ${item.piso}` : 'Sin ubicación'}
            </Text>
            <Text style={styles.consultorioCapacity}>
              Capacidad: {item.capacidad_pacientes || 'N/A'} pacientes
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => handleOptionsPress(item)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#1976D2" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.consultorioFooter}>
        <View style={styles.estadoContainer}>
          <View style={[styles.estadoDot, { backgroundColor: getEstadoColor(item.estado) }]} />
          <Text style={[styles.estadoText, { color: getEstadoColor(item.estado) }]}>
            {getEstadoText(item.estado)}
          </Text>
        </View>
        <Text style={styles.consultorioNumber}>#{item.numero}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Cargando consultorios...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Consultorios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddConsultorio}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {/* Lista de Consultorios */}
      <FlatList
        data={consultorios}
        renderItem={renderConsultorio}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1976D2']}
            tintColor="#1976D2"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay consultorios registrados</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddConsultorio}>
              <Text style={styles.emptyButtonText}>Agregar Primer Consultorio</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal de Opciones */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Opciones del Consultorio</Text>
              <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.consultorioName}>{selectedConsultorio?.nombre}</Text>
              <Text style={styles.consultorioDetails}>
                {selectedConsultorio?.edificio && selectedConsultorio?.piso 
                  ? `${selectedConsultorio.edificio} - Piso ${selectedConsultorio.piso}` 
                  : 'Sin ubicación'} - Capacidad: {selectedConsultorio?.capacidad_pacientes || 'N/A'}
              </Text>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleEditConsultorio}
              >
                <Ionicons name="create-outline" size={24} color="#1976D2" />
                <Text style={styles.modalOptionText}>Editar Consultorio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, styles.deleteOption]}
                onPress={handleDeleteConsultorio}
              >
                <Ionicons name="trash-outline" size={24} color="#F44336" />
                <Text style={[styles.modalOptionText, styles.deleteText]}>Eliminar Consultorio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  consultorioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  consultorioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  consultorioInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  consultorioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consultorioDetails: {
    flex: 1,
  },
  consultorioName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  consultorioLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consultorioCapacity: {
    fontSize: 14,
    color: '#666',
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  consultorioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  estadoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  consultorioNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  consultorioDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOptions: {
    padding: 20,
    paddingTop: 0,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  deleteOption: {
    backgroundColor: '#ffebee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1976D2',
    marginLeft: 15,
    fontWeight: '500',
  },
  deleteText: {
    color: '#F44336',
  },
});
