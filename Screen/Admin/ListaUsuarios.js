import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../src/service/ApiService';

export default function ListaUsuarios({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // todos, medicos, pacientes, administradores

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      
      // Por ahora simulamos datos ya que no tenemos endpoints específicos
      const datosSimulados = [
        {
          id: 1,
          nombre: 'Dr. Wylmer Morales',
          email: 'Wilmer.Morales@hospital.com',
          tipo: 'medico',
          especialidad: 'Cardiología',
          estado: 'activo',
          fecha_registro: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'Juan Pineda',
          email: 'juan.pineda@email.com',
          tipo: 'paciente',
          especialidad: null,
          estado: 'activo',
          fecha_registro: '2024-02-20'
        },
        {
          id: 3,
          nombre: 'Super Administrador',
          email: 'admin@sistema.com',
          tipo: 'administrador',
          especialidad: null,
          estado: 'activo',
          fecha_registro: '2024-01-01'
        },
        {
          id: 4,
          nombre: 'Dr. María López',
          email: 'maria.lopez@hospital.com',
          tipo: 'medico',
          especialidad: 'Dermatología',
          estado: 'activo',
          fecha_registro: '2024-03-10'
        },
        {
          id: 5,
          nombre: 'Ana García',
          email: 'ana.garcia@email.com',
          tipo: 'paciente',
          especialidad: null,
          estado: 'activo',
          fecha_registro: '2024-03-15'
        }
      ];
      
      setUsuarios(datosSimulados);
      
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsuarios();
    setRefreshing(false);
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'medico':
        return 'medical';
      case 'paciente':
        return 'person';
      case 'administrador':
        return 'shield-checkmark';
      default:
        return 'person';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'medico':
        return '#198754';
      case 'paciente':
        return '#1976D2';
      case 'administrador':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getTipoTexto = (tipo) => {
    switch (tipo) {
      case 'medico':
        return 'Médico';
      case 'paciente':
        return 'Paciente';
      case 'administrador':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    if (filtro === 'todos') return true;
    return usuario.tipo === filtro;
  });

  const handleUsuarioPress = (usuario) => {
    Alert.alert(
      'Información del Usuario',
      `Nombre: ${usuario.nombre}\nEmail: ${usuario.email}\nTipo: ${getTipoTexto(usuario.tipo)}\n${usuario.especialidad ? `Especialidad: ${usuario.especialidad}\n` : ''}Estado: ${usuario.estado}\nRegistro: ${usuario.fecha_registro}`,
      [{ text: 'OK' }]
    );
  };

  const renderUsuario = (usuario) => (
    <TouchableOpacity
      key={usuario.id}
      style={styles.usuarioCard}
      onPress={() => handleUsuarioPress(usuario)}
    >
      <View style={styles.usuarioHeader}>
        <View style={[styles.usuarioIcon, { backgroundColor: getTipoColor(usuario.tipo) + '20' }]}>
          <Ionicons 
            name={getTipoIcon(usuario.tipo)} 
            size={24} 
            color={getTipoColor(usuario.tipo)} 
          />
        </View>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioNombre}>{usuario.nombre}</Text>
          <Text style={styles.usuarioEmail}>{usuario.email}</Text>
          {usuario.especialidad && (
            <Text style={styles.usuarioEspecialidad}>{usuario.especialidad}</Text>
          )}
        </View>
        <View style={styles.usuarioEstado}>
          <View style={[
            styles.estadoBadge, 
            { backgroundColor: usuario.estado === 'activo' ? '#d4edda' : '#f8d7da' }
          ]}>
            <Text style={[
              styles.estadoText,
              { color: usuario.estado === 'activo' ? '#155724' : '#721c24' }
            ]}>
              {usuario.estado}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFiltros = () => (
    <View style={styles.filtrosContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'medicos', label: 'Médicos' },
          { key: 'pacientes', label: 'Pacientes' },
          { key: 'administradores', label: 'Administradores' }
        ].map((filtroItem) => (
          <TouchableOpacity
            key={filtroItem.key}
            style={[
              styles.filtroButton,
              filtro === filtroItem.key && styles.filtroButtonActive
            ]}
            onPress={() => setFiltro(filtroItem.key)}
          >
            <Text style={[
              styles.filtroText,
              filtro === filtroItem.key && styles.filtroTextActive
            ]}>
              {filtroItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#fce4ec", "#fff1f8"]} style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc3545" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#fce4ec", "#fff1f8"]} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Usuarios</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.filter(u => u.tipo === 'medico').length}</Text>
          <Text style={styles.statLabel}>Médicos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.filter(u => u.tipo === 'paciente').length}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.filter(u => u.tipo === 'administrador').length}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {/* Filtros */}
      {renderFiltros()}

      {/* Lista de usuarios */}
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map(renderUsuario)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay usuarios</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  header: {
    backgroundColor: "#dc3545",
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  filtrosContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filtroButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtroButtonActive: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  filtroText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filtroTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  usuarioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  usuarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usuarioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  usuarioEspecialidad: {
    fontSize: 12,
    color: '#198754',
    fontWeight: '600',
  },
  usuarioEstado: {
    alignItems: 'flex-end',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
