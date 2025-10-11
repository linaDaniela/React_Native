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
import { especialidadesService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrearEspecialidadModal from '../../src/components/CrearEspecialidadModal';
import EditarEspecialidadModal from '../../src/components/EditarEspecialidadModal';

export default function EspecialidadesScreen({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('paciente');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);

  useEffect(() => {
    loadEspecialidades();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserRole(parsed.tipo || 'paciente');
      }
    } catch (error) {
      console.error('Error al cargar rol de usuario:', error);
    }
  };

  const loadEspecialidades = async () => {
    try {
      setLoading(true);
      console.log('Cargando especialidades...');
      const response = await especialidadesService.getAll();
      console.log('Resultado de especialidades:', response);
      
      if (response.success) {
        setEspecialidades(response.data || []);
        console.log('Especialidades cargadas desde API:', response.data?.length || 0);
      } else {
        console.error('Error en respuesta de especialidades:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar especialidades');
        setEspecialidades([]);
      }
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      Alert.alert('Error', 'Error de conexión o del servidor al cargar especialidades.');
      setEspecialidades([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEspecialidades();
    setRefreshing(false);
  };

  const handleAddEspecialidad = () => {
    if (userRole === 'admin') {
      setShowCrearModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar especialidades');
    }
  };

  const createEspecialidad = async (especialidadData) => {
    try {
      const result = await especialidadesService.create(especialidadData);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Especialidad creada exitosamente');
        loadEspecialidades();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear especialidad');
      }
    } catch (error) {
      console.error('Error creando especialidad:', error);
      Alert.alert('❌ Error', 'Error al crear especialidad');
    }
  };

  const handleEditEspecialidad = (especialidad) => {
    if (userRole === 'admin') {
      setEspecialidadEditando(especialidad);
      setShowEditarModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar especialidades');
    }
  };

  const handleEspecialidadCreated = () => {
    loadEspecialidades();
  };

  const handleEspecialidadUpdated = () => {
    loadEspecialidades();
  };

  const handleDeleteEspecialidad = (especialidad) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Especialidad',
        `¿Estás seguro de que quieres eliminar "${especialidad.nombre}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => deleteEspecialidad(especialidad.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar especialidades');
    }
  };

  const deleteEspecialidad = async (id) => {
    try {
      console.log('Intentando eliminar especialidad con ID:', id);
      const result = await especialidadesService.delete(id);
      console.log('Resultado de eliminación:', result);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Especialidad eliminada exitosamente');
        loadEspecialidades();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar especialidad');
      }
    } catch (error) {
      console.error('Error eliminando especialidad:', error);
      Alert.alert('❌ Error', 'Error al eliminar especialidad');
    }
  };

  const renderEspecialidad = (especialidad) => (
    <View key={especialidad.id} style={styles.especialidadCard}>
      <View style={styles.especialidadInfo}>
        <View style={styles.especialidadIcon}>
          <Ionicons name="library-outline" size={24} color="#4CAF50" />
        </View>
        <View style={styles.especialidadDetails}>
          <Text style={styles.especialidadName}>
            {especialidad.nombre}
          </Text>
          <Text style={styles.especialidadDate}>
            Creada: {new Date(especialidad.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.especialidadActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditEspecialidad(especialidad)}
          >
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteEspecialidad(especialidad)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando especialidades...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Especialidades</Text>
        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddEspecialidad}
          >
            <Ionicons name="add-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
        }
      >
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Ionicons name="library-outline" size={32} color="#4CAF50" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>{especialidades.length}</Text>
              <Text style={styles.statsLabel}>Especialidades Disponibles</Text>
            </View>
          </View>
        </View>

        {/* Especialidades List */}
        {especialidades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No hay especialidades registradas</Text>
            <Text style={styles.emptySubtext}>Las especialidades aparecerán aquí cuando se registren</Text>
            {userRole === 'admin' && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddEspecialidad}>
                <Ionicons name="add-outline" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Agregar Primera Especialidad</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.especialidadesContainer}>
            {especialidades.map(renderEspecialidad)}
          </View>
        )}
      </ScrollView>
      
      {/* Modales */}
      <CrearEspecialidadModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onEspecialidadCreated={handleEspecialidadCreated}
      />
      
      <EditarEspecialidadModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setEspecialidadEditando(null);
        }}
        especialidad={especialidadEditando}
        onEspecialidadUpdated={handleEspecialidadUpdated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statsText: {
    marginLeft: 16,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  especialidadesContainer: {
    paddingBottom: 20,
  },
  especialidadCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  especialidadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  especialidadIcon: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  especialidadDetails: {
    flex: 1,
  },
  especialidadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  especialidadDate: {
    fontSize: 12,
    color: '#666',
  },
  especialidadActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    borderRadius: 20,
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});