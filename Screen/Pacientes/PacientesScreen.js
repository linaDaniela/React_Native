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
import { pacientesService } from '../../src/service/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrearPacienteModal from '../../src/components/CrearPacienteModal';
import EditarPacienteModal from '../../src/components/EditarPacienteModal';

export default function PacientesScreen({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  useEffect(() => {
    loadUserRole();
    loadPacientes();
  }, []);

  const loadUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserRole(parsedData.tipo || parsedData.role);
      }
    } catch (error) {
      console.error('Error cargando rol de usuario:', error);
    }
  };

  const loadPacientes = async () => {
    try {
      setLoading(true);
      console.log('Cargando pacientes...');

      const result = await pacientesService.getAll();
      console.log('Resultado de pacientes:', result);

      if (result.success && Array.isArray(result.data)) {
        // Filtrar solo los pacientes activos (activo = 1 o true)
        const pacientesActivos = result.data.filter(paciente => 
          paciente.activo === 1 || paciente.activo === true || paciente.activo === undefined
        );
        setPacientes(pacientesActivos);
        console.log('Pacientes activos cargados desde API:', pacientesActivos.length);
      } else {
        console.log('API falló o no hay datos, usando datos de ejemplo');
        const datosEjemplo = [
          { 
            id: 1, 
            nombre: 'Juan', 
            apellido: 'Pérez', 
            numero_documento: '12345678', 
            fecha_nacimiento: '1990-01-15',
            telefono: '3001234567',
            email: 'juan@example.com',
            direccion: 'Calle 123 #45-67'
          },
          { 
            id: 2, 
            nombre: 'María', 
            apellido: 'González', 
            numero_documento: '87654321', 
            fecha_nacimiento: '1985-05-20',
            telefono: '3007654321',
            email: 'maria@example.com',
            direccion: 'Carrera 78 #90-12'
          },
        ];
        setPacientes(datosEjemplo);
        console.log('Usando datos de ejemplo:', datosEjemplo.length);
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      const datosEjemplo = [
        { 
          id: 1, 
          nombre: 'Juan', 
          apellido: 'Pérez', 
          numero_documento: '12345678', 
          fecha_nacimiento: '1990-01-15',
          telefono: '3001234567',
          email: 'juan@example.com',
          direccion: 'Calle 123 #45-67'
        },
      ];
      setPacientes(datosEjemplo);
      console.log('Error - usando datos de ejemplo:', datosEjemplo.length);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadPacientes();
    setRefreshing(false);
  }, []);

  const handleAddPaciente = () => {
    if (userRole === 'admin') {
      setShowCrearModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden agregar pacientes');
    }
  };

  const createPaciente = async (pacienteData) => {
    try {
      console.log('Enviando datos del paciente:', pacienteData);
      const result = await pacientesService.create(pacienteData);
      console.log('Respuesta del servidor:', result);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Paciente creado exitosamente');
        loadPacientes();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al crear paciente');
      }
    } catch (error) {
      console.error('Error creando paciente:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.code === 'ECONNABORTED') {
        Alert.alert('❌ Error', 'Timeout: El servidor no respondió a tiempo');
      } else if (error.response?.status === 422) {
        Alert.alert('❌ Error de Validación', error.response?.data?.message || 'Datos inválidos');
      } else if (error.response?.status === 500) {
        Alert.alert('❌ Error del Servidor', 'Error interno del servidor');
      } else {
        Alert.alert('❌ Error', `Error al crear paciente: ${error.message}`);
      }
    }
  };

  const handleEditPaciente = (paciente) => {
    if (userRole === 'admin') {
      setPacienteEditando(paciente);
      setShowEditarModal(true);
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden editar pacientes');
    }
  };

  const handlePacienteCreated = () => {
    loadPacientes();
  };

  const handlePacienteUpdated = () => {
    loadPacientes();
  };

  const handleDeletePaciente = (paciente) => {
    if (userRole === 'admin') {
      Alert.alert(
        'Eliminar Paciente',
        `¿Estás seguro de que quieres eliminar "${paciente.nombre} ${paciente.apellido}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deletePaciente(paciente.id)
          }
        ]
      );
    } else {
      Alert.alert('Acceso Restringido', 'Solo los administradores pueden eliminar pacientes');
    }
  };

  const deletePaciente = async (id) => {
    try {
      console.log('Intentando eliminar paciente con ID:', id);
      const result = await pacientesService.delete(id);
      console.log('Resultado de eliminación:', result);
      
      if (result.success) {
        Alert.alert('✅ Éxito', 'Paciente eliminado exitosamente');
        loadPacientes();
      } else {
        Alert.alert('❌ Error', result.message || 'Error al eliminar paciente');
      }
    } catch (error) {
      console.error('Error eliminando paciente:', error);
      Alert.alert('❌ Error', 'Error al eliminar paciente');
    }
  };

  const renderPaciente = (paciente) => (
    <View key={paciente.id} style={styles.pacienteCard}>
      <View style={styles.pacienteHeader}>
        <View style={styles.pacienteIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#4CAF50" />
        </View>
        <View style={styles.pacienteInfo}>
          <Text style={styles.pacienteNombre}>{paciente.nombre} {paciente.apellido}</Text>
          <Text style={styles.pacienteId}>ID: #{paciente.id}</Text>
        </View>
        {userRole === 'admin' && (
          <View style={styles.pacienteActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditPaciente(paciente)}
            >
              <Ionicons name="create-outline" size={20} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeletePaciente(paciente)}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.pacienteDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{paciente.telefono || 'Sin teléfono'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{paciente.email || 'Sin email'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Nacimiento: {paciente.fecha_nacimiento || 'No especificado'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Documento: {paciente.numero_documento || paciente.cedula || 'No especificado'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="home-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{paciente.direccion || 'Sin dirección'}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando pacientes...</Text>
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
        <Text style={styles.headerTitle}>Pacientes</Text>
        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPaciente}
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
            <Ionicons name="people-outline" size={32} color="#4CAF50" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>{pacientes.length}</Text>
              <Text style={styles.statsLabel}>Pacientes Registrados</Text>
            </View>
          </View>
        </View>

        {/* Pacientes List */}
        {pacientes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No hay pacientes registrados</Text>
            <Text style={styles.emptySubtext}>Los pacientes aparecerán aquí cuando se registren</Text>
            {userRole === 'admin' && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddPaciente}>
                <Ionicons name="add-outline" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Agregar Primer Paciente</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.pacientesContainer}>
            {pacientes.map(renderPaciente)}
          </View>
        )}
      </ScrollView>
      
      {/* Modales */}
      <CrearPacienteModal
        visible={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onPacienteCreated={handlePacienteCreated}
      />
      
      <EditarPacienteModal
        visible={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setPacienteEditando(null);
        }}
        paciente={pacienteEditando}
        onPacienteUpdated={handlePacienteUpdated}
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
    marginTop: 10,
    fontSize: 16,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pacientesContainer: {
    marginBottom: 20,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pacienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pacienteIcon: {
    marginRight: 16,
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pacienteId: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  pacienteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
  },
  pacienteDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});