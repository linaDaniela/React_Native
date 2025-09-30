import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UsuariosScreen() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([
    {
      id: '1',
      nombre: 'Dr. Carlos García',
      email: 'carlos.garcia@clinica.com',
      rol: 'Administrador',
      estado: 'Activo',
      ultimoAcceso: '2024-01-15',
    },
    {
      id: '2',
      nombre: 'Dra. Ana Martínez',
      email: 'ana.martinez@clinica.com',
      rol: 'Médico',
      estado: 'Activo',
      ultimoAcceso: '2024-01-14',
    },
    {
      id: '3',
      nombre: 'María López',
      email: 'maria.lopez@clinica.com',
      rol: 'Secretaria',
      estado: 'Activo',
      ultimoAcceso: '2024-01-15',
    },
    {
      id: '4',
      nombre: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@clinica.com',
      rol: 'Médico',
      estado: 'Inactivo',
      ultimoAcceso: '2024-01-10',
    },
  ]);

  const agregarUsuario = () => {
    Alert.alert(
      'Agregar Usuario',
      '¿Qué tipo de usuario desea agregar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Administrador', onPress: () => mostrarFormulario('Administrador') },
        { text: 'Médico', onPress: () => mostrarFormulario('Médico') },
        { text: 'Secretaria', onPress: () => mostrarFormulario('Secretaria') },
      ]
    );
  };

  const mostrarFormulario = (rol) => {
    Alert.alert(
      'Agregar Usuario',
      `Formulario para agregar ${rol}`,
      [{ text: 'OK' }]
    );
  };

  const editarUsuario = (usuario) => {
    Alert.alert(
      'Editar Usuario',
      `Editar información de ${usuario.nombre}`,
      [{ text: 'OK' }]
    );
  };

  const eliminarUsuario = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setUsuarios(usuarios.filter(user => user.id !== id));
            Alert.alert('Éxito', 'Usuario eliminado correctamente');
          },
        },
      ]
    );
  };

  const cambiarEstadoUsuario = (id) => {
    setUsuarios(usuarios.map(user => 
      user.id === id 
        ? { ...user, estado: user.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : user
    ));
  };

  const getEstadoColor = (estado) => {
    return estado === 'Activo' ? '#4CAF50' : '#F44336';
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'Administrador':
        return '#1976D2';
      case 'Médico':
        return '#4CAF50';
      case 'Secretaria':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const renderUsuario = ({ item }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioHeader}>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioNombre}>{item.nombre}</Text>
          <Text style={styles.usuarioEmail}>{item.email}</Text>
        </View>
        <View style={styles.usuarioEstados}>
          <View style={[styles.rolBadge, { backgroundColor: getRolColor(item.rol) }]}>
            <Text style={styles.rolText}>{item.rol}</Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>
      </View>

      <View style={styles.usuarioDetalles}>
        <View style={styles.detalleRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>Último acceso: {item.ultimoAcceso}</Text>
        </View>
      </View>

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => editarUsuario(item)}
        >
          <Ionicons name="create-outline" size={20} color="#1976D2" />
          <Text style={styles.botonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEstado]}
          onPress={() => cambiarEstadoUsuario(item.id)}
        >
          <Ionicons name="power-outline" size={20} color="#FF9800" />
          <Text style={styles.botonText}>
            {item.estado === 'Activo' ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => eliminarUsuario(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
          <Text style={styles.botonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Usuarios</Text>
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarUsuario}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Estadísticas de Usuarios */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{usuarios.length}</Text>
            <Text style={styles.statLabel}>Total Usuarios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {usuarios.filter(u => u.estado === 'Activo').length}
            </Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {usuarios.filter(u => u.rol === 'Médico').length}
            </Text>
            <Text style={styles.statLabel}>Médicos</Text>
          </View>
        </View>

        {/* Lista de Usuarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usuarios del Sistema</Text>
          <FlatList
            data={usuarios}
            renderItem={renderUsuario}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Configuración de Usuarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="shield-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Permisos y Roles</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="key-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Políticas de Contraseñas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="time-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Sesiones y Timeouts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  botonAgregar: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
  },
  usuarioCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  usuarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#666',
  },
  usuarioEstados: {
    alignItems: 'flex-end',
  },
  rolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  rolText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  usuarioDetalles: {
    marginBottom: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detalleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  accionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  botonAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  botonEditar: {
    backgroundColor: '#E3F2FD',
  },
  botonEstado: {
    backgroundColor: '#FFF3E0',
  },
  botonEliminar: {
    backgroundColor: '#FFEBEE',
  },
  botonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  configInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
});
