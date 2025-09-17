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

export default function ListarEspecialidades() {
  const navigation = useNavigation();
  const [especialidades, setEspecialidades] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo para las especialidades
  const especialidadesEjemplo = [
    {
      id: '1',
      nombre: 'Cardiología',
      descripcion: 'Especialidad médica que se encarga del corazón y sistema cardiovascular',
      totalMedicos: 15,
      totalConsultorios: 8,
    },
    {
      id: '2',
      nombre: 'Dermatología',
      descripcion: 'Especialidad médica que se encarga de la piel y enfermedades cutáneas',
      totalMedicos: 12,
      totalConsultorios: 6,
    },
    {
      id: '3',
      nombre: 'Ortopedia',
      descripcion: 'Especialidad médica que se encarga de huesos, articulaciones y músculos',
      totalMedicos: 18,
      totalConsultorios: 10,
    },
    {
      id: '4',
      nombre: 'Ginecología',
      descripcion: 'Especialidad médica que se encarga de la salud femenina',
      totalMedicos: 14,
      totalConsultorios: 7,
    },
    {
      id: '5',
      nombre: 'Neurología',
      descripcion: 'Especialidad médica que se encarga del sistema nervioso',
      totalMedicos: 10,
      totalConsultorios: 5,
    },
  ];

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = () => {
    // Simular carga de datos
    setEspecialidades(especialidadesEjemplo);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simular recarga de datos
    setTimeout(() => {
      cargarEspecialidades();
      setRefreshing(false);
    }, 1000);
  };

  const editarEspecialidad = (especialidad) => {
    navigation.navigate('EditarEspecialidad', { especialidad });
  };

  const eliminarEspecialidad = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta especialidad?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setEspecialidades(especialidades.filter(esp => esp.id !== id));
            Alert.alert('Éxito', 'Especialidad eliminada correctamente');
          },
        },
      ]
    );
  };

  const renderEspecialidad = ({ item }) => (
    <View style={styles.especialidadCard}>
      <View style={styles.especialidadHeader}>
        <View style={styles.especialidadInfo}>
          <Text style={styles.especialidadNombre}>{item.nombre}</Text>
          <Text style={styles.especialidadDescripcion}>{item.descripcion}</Text>
        </View>
      </View>

      <View style={styles.estadisticasContainer}>
        <View style={styles.estadisticaItem}>
          <Text style={styles.estadisticaNumero}>{item.totalMedicos}</Text>
          <Text style={styles.estadisticaLabel}>Médicos</Text>
        </View>
        <View style={styles.estadisticaItem}>
          <Text style={styles.estadisticaNumero}>{item.totalConsultorios}</Text>
          <Text style={styles.estadisticaLabel}>Consultorios</Text>
        </View>
      </View>

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => editarEspecialidad(item)}
        >
          <Ionicons name="create-outline" size={20} color="#1976D2" />
          <Text style={styles.botonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => eliminarEspecialidad(item.id)}
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
        <Text style={styles.titulo}>Especialidades</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.botonAgregar}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={especialidades}
        renderItem={renderEspecialidad}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay especialidades registradas</Text>
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
  especialidadCard: {
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
  especialidadHeader: {
    marginBottom: 12,
  },
  especialidadInfo: {
    flex: 1,
  },
  especialidadNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  especialidadDescripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  estadisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  estadisticaItem: {
    alignItems: 'center',
  },
  estadisticaNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  estadisticaLabel: {
    fontSize: 12,
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
