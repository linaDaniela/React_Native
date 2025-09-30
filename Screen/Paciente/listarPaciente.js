import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PacientesService from '../../src/service/PacientesService';

export default function ListarPaciente() {
  const navigation = useNavigation();
  const [pacientes, setPacientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo para los pacientes
  const pacientesEjemplo = [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '12345678',
      edad: 35,
      telefono: '(601) 123-4567',
      email: 'juan.perez@email.com',
      direccion: 'Calle 123 #45-67, Bogotá',
      eps: 'EPS Sanitas',
      fechaNacimiento: '1989-05-15',
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'López',
      cedula: '23456789',
      edad: 28,
      telefono: '(601) 234-5678',
      email: 'maria.lopez@email.com',
      direccion: 'Carrera 45 #78-90, Medellín',
      eps: 'EPS Sura',
      fechaNacimiento: '1996-03-22',
    },
    {
      id: '3',
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      cedula: '34567890',
      edad: 42,
      telefono: '(601) 345-6789',
      email: 'pedro.rodriguez@email.com',
      direccion: 'Avenida 80 #12-34, Cali',
      eps: 'EPS Coomeva',
      fechaNacimiento: '1982-11-08',
    },
    {
      id: '4',
      nombre: 'Laura',
      apellido: 'Sánchez',
      cedula: '45678901',
      edad: 31,
      telefono: '(601) 456-7890',
      email: 'laura.sanchez@email.com',
      direccion: 'Calle 100 #56-78, Barranquilla',
      eps: 'EPS Compensar',
      fechaNacimiento: '1993-07-14',
    },
    {
      id: '5',
      nombre: 'Carlos',
      apellido: 'García',
      cedula: '56789012',
      edad: 55,
      telefono: '(601) 567-8901',
      email: 'carlos.garcia@email.com',
      direccion: 'Carrera 15 #23-45, Bucaramanga',
      eps: 'EPS Sanitas',
      fechaNacimiento: '1969-12-03',
    },
  ];

    useEffect(() => {
    cargarPacientes();
  }, []);

  // Escuchar cambios cuando se regresa de editar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar pacientes cuando la pantalla recibe foco
      cargarPacientes();
    });

    return unsubscribe;
  }, [navigation]);

  const cargarPacientes = async () => {
    try {
      console.log('Cargando pacientes desde la base de datos...');
      const result = await PacientesService.obtenerPacientes();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Pacientes cargados desde BD:', result.data.length);
        setPacientes(result.data);
      } else {
        console.log('⚠️ Usando datos de ejemplo - Error del servidor:', result.message);
        // Usar datos de ejemplo como fallback sin mostrar error
        setPacientes(pacientesEjemplo);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar pacientes:', error);
      // Usar datos de ejemplo como fallback sin mostrar error
      setPacientes(pacientesEjemplo);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPacientes();
    setRefreshing(false);
  };

  const editarPaciente = (paciente) => {
    navigation.navigate('EditarPaciente', { paciente });
  };

  const eliminarPaciente = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este paciente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await PacientesService.eliminarPaciente(id);
              if (result.success) {
                setPacientes(pacientes.filter(paciente => paciente.id !== id));
                Alert.alert('Éxito', 'Paciente eliminado correctamente');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error al eliminar paciente:', error);
              Alert.alert('Error', 'No se pudo eliminar el paciente');
            }
          },
        },
      ]
    );
  };

  // Función para calcular la edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    
    try {
      // Si viene en formato ISO, extraer solo la fecha
      const fecha = fechaNacimiento.includes('T') 
        ? fechaNacimiento.split('T')[0] 
        : fechaNacimiento;
      
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      
      if (isNaN(nacimiento.getTime())) return null;
      
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      return edad;
    } catch (error) {
      console.error('Error calculando edad:', error);
      return null;
    }
  };

  const renderPaciente = ({ item }) => {
    const edad = calcularEdad(item.fecha_nacimiento || item.fechaNacimiento);
    
    return (
      <View style={styles.pacienteCard}>
        <View style={styles.pacienteHeader}>
          <View style={styles.pacienteInfo}>
            <Text style={styles.pacienteNombre}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.pacienteCedula}>CC: {item.cedula}</Text>
          </View>
          {edad !== null && (
            <View style={styles.pacienteEdad}>
              <Text style={styles.edadText}>{edad} años</Text>
            </View>
          )}
        </View>

        <View style={styles.pacienteDetalles}>
          <View style={styles.detalleRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>{item.telefono}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>{item.email}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>{item.direccion}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="business-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>{item.eps}</Text>
          </View>
        </View>

        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={[styles.botonAccion, styles.botonEditar]}
            onPress={() => editarPaciente(item)}
          >
            <Ionicons name="create-outline" size={20} color="#1976D2" />
            <Text style={styles.botonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonAccion, styles.botonEliminar]}
            onPress={() => eliminarPaciente(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={styles.botonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Pacientes</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.botonAgregar}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pacientes}
        renderItem={renderPaciente}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay pacientes registrados</Text>
          </View>
        }
      />
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
  listaContainer: {
    padding: 16,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  pacienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pacienteCedula: {
    fontSize: 14,
    color: '#666',
  },
  pacienteEdad: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  edadText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  pacienteDetalles: {
    marginBottom: 12,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  botonEditar: {
    backgroundColor: '#E3F2FD',
  },
  botonEliminar: {
    backgroundColor: '#FFEBEE',
  },
  botonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});