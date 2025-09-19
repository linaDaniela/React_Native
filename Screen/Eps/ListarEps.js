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

export default function ListarEps() {
  const navigation = useNavigation();
  const [eps, setEps] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo para las EPS
  const epsEjemplo = [
    {
      id: '1',
      nombre: 'EPS Sanitas',
      nit: '900123456-1',
      tipoEps: 'Contributiva',
      estado: 'Activa',
      telefono: '(601) 123-4567',
      email: 'contacto@sanitas.com',
      representanteLegal: 'Dr. Juan Carlos Pérez',
      estadisticas: {
        totalAfiliados: 2500000,
        totalMedicos: 15000,
        totalConsultorios: 850,
        calificacion: 4.5,
      },
    },
    {
      id: '2',
      nombre: 'EPS Sura',
      nit: '900234567-2',
      tipoEps: 'Contributiva',
      estado: 'Activa',
      telefono: '(601) 234-5678',
      email: 'contacto@sura.com',
      representanteLegal: 'Dra. María González',
      estadisticas: {
        totalAfiliados: 3200000,
        totalMedicos: 18000,
        totalConsultorios: 1200,
        calificacion: 4.3,
      },
    },
    {
      id: '3',
      nombre: 'EPS Coomeva',
      nit: '900345678-3',
      tipoEps: 'Mixta',
      estado: 'Activa',
      telefono: '(601) 345-6789',
      email: 'contacto@coomeva.com',
      representanteLegal: 'Dr. Carlos Rodríguez',
      estadisticas: {
        totalAfiliados: 1800000,
        totalMedicos: 12000,
        totalConsultorios: 650,
        calificacion: 4.1,
      },
    },
    {
      id: '4',
      nombre: 'EPS Compensar',
      nit: '900456789-4',
      tipoEps: 'Contributiva',
      estado: 'Activa',
      telefono: '(601) 456-7890',
      email: 'contacto@compensar.com',
      representanteLegal: 'Dra. Ana Martínez',
      estadisticas: {
        totalAfiliados: 2100000,
        totalMedicos: 14000,
        totalConsultorios: 750,
        calificacion: 4.4,
      },
    },
  ];

  useEffect(() => {
    cargarEps();
  }, []);

  const cargarEps = () => {
    // Simular carga de datos
    setEps(epsEjemplo);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simular recarga de datos
    setTimeout(() => {
      cargarEps();
      setRefreshing(false);
    }, 1000);
  };

  const verDetalle = (epsItem) => {
    navigation.navigate('DetalleEps', { eps: epsItem });
  };

  const eliminarEps = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta EPS?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setEps(eps.filter(epsItem => epsItem.id !== id));
            Alert.alert('Éxito', 'EPS eliminada correctamente');
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activa':
        return '#4CAF50';
      case 'Inactiva':
        return '#F44336';
      case 'Suspendida':
        return '#FF9800';
      case 'En Proceso':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const renderEps = ({ item }) => (
    <TouchableOpacity 
      style={styles.epsCard}
      onPress={() => verDetalle(item)}
    >
      <View style={styles.epsHeader}>
        <View style={styles.epsInfo}>
          <Text style={styles.epsNombre}>{item.nombre}</Text>
          <Text style={styles.epsNit}>NIT: {item.nit}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.epsDetalles}>
        <View style={styles.detalleRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.tipoEps}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.telefono}</Text>
        </View>
        <View style={styles.detalleRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.detalleText}>{item.representanteLegal}</Text>
        </View>
      </View>

      <View style={styles.estadisticasContainer}>
        <View style={styles.estadisticaItem}>
          <Text style={styles.estadisticaNumero}>{item.estadisticas.totalAfiliados.toLocaleString()}</Text>
          <Text style={styles.estadisticaLabel}>Afiliados</Text>
        </View>
        <View style={styles.estadisticaItem}>
          <Text style={styles.estadisticaNumero}>{item.estadisticas.totalMedicos.toLocaleString()}</Text>
          <Text style={styles.estadisticaLabel}>Médicos</Text>
        </View>
        <View style={styles.estadisticaItem}>
          <Text style={styles.estadisticaNumero}>{item.estadisticas.calificacion}</Text>
          <Text style={styles.estadisticaLabel}>Calificación</Text>
        </View>
      </View>

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonVer]}
          onPress={() => verDetalle(item)}
        >
          <Ionicons name="eye-outline" size={20} color="#1976D2" />
          <Text style={styles.botonText}>Ver Detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => eliminarEps(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
          <Text style={styles.botonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>EPS</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.botonAgregar}>
          <Ionicons name="add" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={eps}
        renderItem={renderEps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay EPS registradas</Text>
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
  epsCard: {
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
  epsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  epsInfo: {
    flex: 1,
  },
  epsNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  epsNit: {
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
  epsDetalles: {
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
  botonVer: {
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
