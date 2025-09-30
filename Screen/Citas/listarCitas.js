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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitasService from '../../src/service/CitasService';

export default function ListarCitas() {
  const navigation = useNavigation();
  const [citas, setCitas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo para las citas
  const citasEjemplo = [
    {
      id: '1',
      paciente: 'Juan Pérez',
      medico: 'Dr. Carlos García',
      especialidad: 'Cardiología',
      fecha: '2024-01-15',
      hora: '10:00',
      estado: 'Programada',
      motivo: 'Consulta de seguimiento',
    },
    {
      id: '2',
      paciente: 'María López',
      medico: 'Dra. Ana Martínez',
      especialidad: 'Dermatología',
      fecha: '2024-01-16',
      hora: '14:30',
      estado: 'Completada',
      motivo: 'Revisión de lunares',
    },
    {
      id: '3',
      paciente: 'Pedro Rodríguez',
      medico: 'Dr. Luis Fernández',
      especialidad: 'Ortopedia',
      fecha: '2024-01-17',
      hora: '09:15',
      estado: 'Cancelada',
      motivo: 'Dolor en rodilla',
    },
    {
      id: '4',
      paciente: 'Laura Sánchez',
      medico: 'Dra. Carmen Ruiz',
      especialidad: 'Ginecología',
      fecha: '2024-01-18',
      hora: '11:45',
      estado: 'Programada',
      motivo: 'Control anual',
    },
  ];

  useEffect(() => {
    cargarCitas();
  }, []);

  // Escuchar cambios cuando se regresa de editar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar citas cuando la pantalla recibe foco
      cargarCitas();
    });

    return unsubscribe;
  }, [navigation]);

  const cargarCitas = async () => {
    try {
      console.log('🔄 Cargando citas desde la base de datos...');
      
      // Primero probar la conexión
      console.log('🧪 Probando conexión...');
      const pruebaConexion = await CitasService.probarConexion();
      
      if (pruebaConexion.success) {
        console.log('✅ Conexión exitosa, procesando datos...');
        const citas = pruebaConexion.data || [];
        
        if (citas.length > 0) {
          console.log('📋 Cargando nombres para', citas.length, 'citas...');
          
          // Cargar nombres usando el método del servicio
          const resultConNombres = await CitasService.cargarNombresParaCitas(citas);
          
          if (resultConNombres.success) {
            console.log('✅ Nombres cargados correctamente');
            setCitas(resultConNombres.data);
          } else {
            console.log('⚠️ Error cargando nombres, usando datos básicos');
            setCitas(citas);
          }
        } else {
          console.log('📋 No hay citas para procesar');
          setCitas([]);
        }
        return;
      } else {
        console.log('❌ Error en la conexión:', pruebaConexion.error);
        console.log('📋 Status:', pruebaConexion.status);
        console.log('📋 Datos del error:', pruebaConexion.data);
        setCitas([]);
        return;
      }
      
      // Código anterior como respaldo
      // Intentar cargar citas con relaciones completas primero
      let result = await CitasService.obtenerCitasCompletas();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Citas completas cargadas:', result.data.length);
        console.log('Primera cita:', JSON.stringify(result.data[0], null, 2));
        setCitas(result.data);
      } else {
        console.log('⚠️ Intentando cargar citas básicas...');
        
        // Si falla, intentar con citas básicas
        result = await CitasService.obtenerCitas();
        
        if (result.success && result.data && result.data.length > 0) {
          console.log('✅ Citas básicas cargadas:', result.data.length);
          
          // Usar el método del servicio para cargar nombres
          const resultConNombres = await CitasService.cargarNombresParaCitas(result.data);
          
          if (resultConNombres.success) {
            console.log('✅ Nombres cargados correctamente');
            setCitas(resultConNombres.data);
          } else {
            console.log('⚠️ Error cargando nombres, usando datos básicos');
            setCitas(result.data);
          }
        } else {
          console.log('❌ No se pudieron cargar citas:', result.message);
          setCitas([]);
        }
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar citas:', error);
      setCitas([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarCitas();
    setRefreshing(false);
  };

  const editarCita = (cita) => {
    navigation.navigate('EditarCita', { cita });
  };

  const eliminarCita = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta cita?',
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
              const result = await CitasService.eliminarCita(id);
              if (result.success) {
                setCitas(citas.filter(cita => cita.id !== id));
                Alert.alert('Éxito', 'Cita eliminada correctamente');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error al eliminar cita:', error);
              Alert.alert('Error', 'No se pudo eliminar la cita');
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return '#4CAF50';
      case 'Completada':
        return '#2196F3';
      case 'Cancelada':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderCita = ({ item }) => {
    // Función para formatear fecha
    const formatearFecha = (fecha) => {
      if (!fecha) return 'Sin fecha';
      
      try {
        // Si viene en formato ISO, extraer solo la fecha
        if (fecha.includes('T')) {
          const fechaParte = fecha.split('T')[0];
          const [año, mes, dia] = fechaParte.split('-');
          return `${dia}/${mes}/${año}`;
        }
        
        // Si ya viene en formato YYYY-MM-DD
        if (fecha.includes('-')) {
          const [año, mes, dia] = fecha.split('-');
          return `${dia}/${mes}/${año}`;
        }
        
        return fecha;
      } catch (error) {
        return fecha;
      }
    };

    // Función para obtener nombre del paciente
    const obtenerNombrePaciente = () => {
      return item.paciente_nombre || `Paciente ID: ${item.paciente_id}` || 'Paciente no especificado';
    };

    // Función para obtener nombre del médico
    const obtenerNombreMedico = () => {
      return item.medico_nombre || `Médico ID: ${item.medico_id}` || 'Médico no especificado';
    };

    // Función para obtener especialidad
    const obtenerEspecialidad = () => {
      return item.especialidad_nombre || 'Sin especialidad';
    };

    return (
      <View style={styles.citaCard}>
        <View style={styles.citaHeader}>
          <View style={styles.pacienteInfo}>
            <Text style={styles.pacienteNombre}>
              {obtenerNombrePaciente()}
            </Text>
            <Text style={styles.medicoNombre}>
              {obtenerNombreMedico()}
            </Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado || 'Sin estado'}</Text>
          </View>
        </View>

        <View style={styles.citaDetalles}>
          <View style={styles.detalleRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>
              {formatearFecha(item.fecha_cita || item.fecha)}
            </Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>
              {item.hora_cita || item.hora || 'Sin hora'}
            </Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="medical-outline" size={16} color="#666" />
            <Text style={styles.detalleText}>
              {obtenerEspecialidad()}
            </Text>
          </View>
        </View>

        <Text style={styles.motivoText}>
          {item.motivo_consulta || item.motivo || 'Sin motivo especificado'}
        </Text>

        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={[styles.botonAccion, styles.botonEditar]}
            onPress={() => editarCita(item)}
          >
            <Ionicons name="create-outline" size={20} color="#1976D2" />
            <Text style={styles.botonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonAccion, styles.botonEliminar]}
            onPress={() => eliminarCita(item.id)}
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
        <Text style={styles.titulo}>Citas Médicas</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.botonAgregar}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay citas programadas</Text>
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
  citaCard: {
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
  citaHeader: {
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
  medicoNombre: {
    fontSize: 14,
    color: '#666',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  citaDetalles: {
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
  motivoText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 16,
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
