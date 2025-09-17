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

  const cargarCitas = () => {
    // Simular carga de datos
    setCitas(citasEjemplo);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simular recarga de datos
    setTimeout(() => {
      cargarCitas();
      setRefreshing(false);
    }, 1000);
  };

  const editarCita = (cita) => {
    navigation.navigate('EditarCita', { cita });
  };

  const eliminarCita = (id) => {
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
          onPress: () => {
            setCitas(citas.filter(cita => cita.id !== id));
            Alert.alert('Éxito', 'Cita eliminada correctamente');
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

  const renderCita = ({ item }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={styles.pacienteInfo}>
          <Text style={styles.pacienteNombre}>{item.paciente}</Text>
          <Text style={styles.medicoNombre}>{item.medico}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.citaDetalles}>
        <View style={styles.detalleRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.fecha}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.hora}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="medical-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.especialidad}</Text>
        </View>
      </View>

      <Text style={styles.motivoText}>{item.motivo}</Text>

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
