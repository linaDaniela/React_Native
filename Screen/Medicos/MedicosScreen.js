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
import { medicosService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrearMedicoModal from '../../src/components/CrearMedicoModal';
import EditarMedicoModal from '../../src/components/EditarMedicoModal';

export default function MedicosScreen({ navigation }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('paciente');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [medicoEditando, setMedicoEditando] = useState(null);

  useEffect(() => {
    loadMedicos();
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

  const loadMedicos = async () => {
    try {
      setLoading(true);
      console.log('Cargando médicos...');
      const response = await medicosService.getAll();
      console.log('Resultado de médicos:', response);
      
      if (response.success) {
        setMedicos(response.data || []);
        console.log('Médicos activos cargados desde API:', response.data?.length || 0);
      } else {
        console.error('Error en respuesta de médicos:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar médicos');
        setMedicos([]);
      }
    } catch (error) {
      console.error('Error al cargar médicos:', error);
      Alert.alert('Error', 'Error de conexión o del servidor al cargar médicos.');
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedicos();
    setRefreshing(false);
  };

  const handleAddMedico = () => {
    if (userRole === 'admin') {
      setShowCrearModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar médicos');
    }
  };

  const createMedico = async (medicoData) => {
    try {
      const result = await medicosService.create(medicoData);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Médico creado exitosamente');
        loadMedicos();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear médico');
      }
    } catch (error) {
      console.error('Error creando médico:', error);
      Alert.alert('❌ Error', 'Error al crear médico');
    }
  };

  const handleEditMedico = (medico) => {
    if (userRole === 'admin') {
      setMedicoEditando(medico);
      setShowEditarModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar médicos');
    }
  };

  const handleMedicoCreated = () => {
    loadMedicos();
  };

  const handleMedicoUpdated = () => {
    loadMedicos();
  };

  const handleDeleteMedico = (medico) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Médico',
        `¿Estás seguro de que quieres eliminar "${medico.nombre || medico.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => deleteMedico(medico.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar médicos');
    }
  };

  const deleteMedico = async (id) => {
    try {
      console.log('Intentando eliminar médico con ID:', id);
      const result = await medicosService.delete(id);
      console.log('Resultado de eliminación:', result);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Médico eliminado exitosamente');
        loadMedicos();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar médico');
      }
    } catch (error) {
      console.error('Error eliminando médico:', error);
      Alert.alert('❌ Error', 'Error al eliminar médico');
    }
  };

  const renderMedico = (medico) => (
    <View key={medico.id} style={styles.medicoCard}>
      <View style={styles.medicoInfo}>
        <View style={styles.medicoIcon}>
          <Ionicons name="medical-outline" size={24} color="#4CAF50" />
        </View>
        <View style={styles.medicoDetails}>
          <Text style={styles.medicoName}>
            Dr. {medico.nombre} {medico.apellido}
          </Text>
          <Text style={styles.medicoSpecialty}>
            {medico.especialidad_nombre || 'Sin especialidad'}
          </Text>
          <Text style={styles.medicoLicense}>
            Licencia: {medico.numero_licencia}
          </Text>
          <Text style={styles.medicoContact}>
            📧 {medico.email} | 📞 {medico.telefono}
          </Text>
        </View>
      </View>
      
      {userRole === 'admin' && (
        <View style={styles.medicoActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditMedico(medico)}
          >
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteMedico(medico)}
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
        <Text style={styles.loadingText}>Cargando médicos...</Text>
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
        <Text style={styles.headerTitle}>Médicos</Text>
        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMedico}
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
            <Ionicons name="medical-outline" size={32} color="#4CAF50" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>{medicos.length}</Text>
              <Text style={styles.statsLabel}>Médicos Registrados</Text>
            </View>
          </View>
        </View>

        {/* Médicos List */}
        {medicos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No hay médicos registrados</Text>
            <Text style={styles.emptySubtext}>Los médicos aparecerán aquí cuando se registren</Text>
            {userRole === 'admin' && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddMedico}>
                <Ionicons name="add-outline" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Agregar Primer Médico</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.medicosContainer}>
            {medicos.map(renderMedico)}
          </View>
        )}
      </ScrollView>
      
      {/* Modales */}
      <CrearMedicoModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onMedicoCreated={handleMedicoCreated}
      />
      
      <EditarMedicoModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setMedicoEditando(null);
        }}
        medico={medicoEditando}
        onMedicoUpdated={handleMedicoUpdated}
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
  medicosContainer: {
    paddingBottom: 20,
  },
  medicoCard: {
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
  medicoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicoIcon: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  medicoDetails: {
    flex: 1,
  },
  medicoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicoSpecialty: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 2,
  },
  medicoLicense: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  medicoContact: {
    fontSize: 12,
    color: '#666',
  },
  medicoActions: {
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