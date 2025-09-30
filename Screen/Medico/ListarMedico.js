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
import MedicosService from '../../src/service/MedicosService';

export default function ListarMedico() {
  const navigation = useNavigation();
  const [medicos, setMedicos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo para los médicos
  const medicosEjemplo = [
    {
      id: '1',
      nombre: 'Dr. Carlos García',
      apellido: 'García',
      especialidad: 'Cardiología',
      cedula: '12345678',
      telefono: '(601) 123-4567',
      email: 'carlos.garcia@hospital.com',
      experiencia: '8 años',
      consultorio: '101',
    },
    {
      id: '2',
      nombre: 'Dra. Ana Martínez',
      apellido: 'Martínez',
      especialidad: 'Dermatología',
      cedula: '23456789',
      telefono: '(601) 234-5678',
      email: 'ana.martinez@hospital.com',
      experiencia: '5 años',
      consultorio: '205',
    },
    {
      id: '3',
      nombre: 'Dr. Luis Fernández',
      apellido: 'Fernández',
      especialidad: 'Ortopedia',
      cedula: '34567890',
      telefono: '(601) 345-6789',
      email: 'luis.fernandez@hospital.com',
      experiencia: '12 años',
      consultorio: '310',
    },
    {
      id: '4',
      nombre: 'Dra. Carmen Ruiz',
      apellido: 'Ruiz',
      especialidad: 'Ginecología',
      cedula: '45678901',
      telefono: '(601) 456-7890',
      email: 'carmen.ruiz@hospital.com',
      experiencia: '10 años',
      consultorio: '415',
    },
    {
      id: '5',
      nombre: 'Dr. Miguel Torres',
      apellido: 'Torres',
      especialidad: 'Neurología',
      cedula: '56789012',
      telefono: '(601) 567-8901',
      email: 'miguel.torres@hospital.com',
      experiencia: '15 años',
      consultorio: '520',
    },
  ];

  useEffect(() => {
    cargarMedicos();
  }, []);

  // Escuchar cambios cuando se regresa de editar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Recargar médicos cuando la pantalla recibe foco
      cargarMedicos();
    });

    return unsubscribe;
  }, [navigation]);

  const cargarMedicos = async () => {
    try {
      console.log('Cargando médicos desde la base de datos...');
      const result = await MedicosService.obtenerMedicos();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Médicos cargados desde BD:', result.data.length);
        setMedicos(result.data);
      } else {
        console.log('⚠️ Usando datos de ejemplo - Error del servidor:', result.message);
        // Usar datos de ejemplo como fallback sin mostrar error
        setMedicos(medicosEjemplo);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar médicos:', error);
      // Usar datos de ejemplo como fallback sin mostrar error
      setMedicos(medicosEjemplo);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMedicos();
    setRefreshing(false);
  };

  const editarMedico = (medico) => {
    navigation.navigate('EditarMedico', { medico });
  };

  const eliminarMedico = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este médico?',
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
              const result = await MedicosService.eliminarMedico(id);
              if (result.success) {
                setMedicos(medicos.filter(medico => medico.id !== id));
                Alert.alert('Éxito', 'Médico eliminado correctamente');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error al eliminar médico:', error);
              Alert.alert('Error', 'No se pudo eliminar el médico');
            }
          },
        },
      ]
    );
  };

  const renderMedico = ({ item }) => (
    <View style={styles.medicoCard}>
      <View style={styles.medicoHeader}>
        <View style={styles.medicoInfo}>
          <Text style={styles.medicoNombre}>{item.nombre} {item.apellido}</Text>
          <Text style={styles.medicoEspecialidad}>
            {item.especialidad?.nombre || item.especialidad || 'Sin especialidad'}
          </Text>
        </View>
        <View style={styles.medicoCedula}>
          <Text style={styles.cedulaText}>CC: {item.cedula}</Text>
        </View>
      </View>

      <View style={styles.medicoDetalles}>
        <View style={styles.detalleRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.telefono || 'Sin teléfono'}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.email || 'Sin email'}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>
            Consultorio {item.consultorio_id || item.consultorio || 'Sin asignar'}
          </Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>
            {item.experiencia_anos || item.experiencia || '0'} años de experiencia
          </Text>
        </View>
      </View>

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => editarMedico(item)}
        >
          <Ionicons name="create-outline" size={20} color="#1976D2" />
          <Text style={styles.botonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => eliminarMedico(item.id)}
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
        <Text style={styles.titulo}>Médicos</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.botonAgregar}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicos}
        renderItem={renderMedico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay médicos registrados</Text>
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
  medicoCard: {
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
  medicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicoInfo: {
    flex: 1,
  },
  medicoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicoEspecialidad: {
    fontSize: 14,
    color: '#666',
  },
  medicoCedula: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cedulaText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  medicoDetalles: {
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
