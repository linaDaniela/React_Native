import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DetalleEps() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eps } = route.params || {};

  // Datos de ejemplo si no se pasan parámetros
  const epsEjemplo = {
    id: '1',
    nombre: 'EPS Sanitas',
    nit: '900123456-1',
    direccion: 'Calle 100 #15-20, Bogotá D.C.',
    telefono: '(601) 123-4567',
    email: 'contacto@sanitas.com',
    sitioWeb: 'https://www.sanitas.com',
    representanteLegal: 'Dr. Juan Carlos Pérez',
    telefonoRepresentante: '(601) 987-6543',
    emailRepresentante: 'jperez@sanitas.com',
    tipoEps: 'Contributiva',
    estado: 'Activa',
    fechaAfiliacion: '2020-01-15',
    observaciones: 'EPS con amplia cobertura nacional y excelente atención al usuario.',
    estadisticas: {
      totalAfiliados: 2500000,
      totalMedicos: 15000,
      totalConsultorios: 850,
      calificacion: 4.5,
    },
  };

  const [epsData, setEpsData] = useState(eps || epsEjemplo);

  useEffect(() => {
    if (eps) {
      setEpsData(eps);
    }
  }, [eps]);

  const handleLlamar = (telefono) => {
    const url = `tel:${telefono}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede realizar la llamada');
        }
      })
      .catch(err => Alert.alert('Error', 'Error al abrir la aplicación de teléfono'));
  };

  const handleEmail = (email) => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede abrir el cliente de email');
        }
      })
      .catch(err => Alert.alert('Error', 'Error al abrir el cliente de email'));
  };

  const handleSitioWeb = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede abrir el sitio web');
        }
      })
      .catch(err => Alert.alert('Error', 'Error al abrir el navegador'));
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

  const renderEstadistica = (titulo, valor, icono, color = '#1976D2') => (
    <View style={styles.estadisticaCard}>
      <View style={[styles.estadisticaIcon, { backgroundColor: color }]}>
        <Ionicons name={icono} size={24} color="#fff" />
      </View>
      <View style={styles.estadisticaContent}>
        <Text style={styles.estadisticaValor}>{valor}</Text>
        <Text style={styles.estadisticaTitulo}>{titulo}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle EPS</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditarEps', { eps: epsData })}
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={24} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Información Principal */}
        <View style={styles.section}>
          <View style={styles.epsHeader}>
            <View style={styles.epsInfo}>
              <Text style={styles.epsNombre}>{epsData.nombre}</Text>
              <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(epsData.estado) }]}>
                <Text style={styles.estadoText}>{epsData.estado}</Text>
              </View>
            </View>
            <View style={styles.epsTipo}>
              <Text style={styles.tipoText}>{epsData.tipoEps}</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.estadisticasGrid}>
            {renderEstadistica(
              'Afiliados',
              epsData.estadisticas?.totalAfiliados?.toLocaleString() || 'N/A',
              'people',
              '#4CAF50'
            )}
            {renderEstadistica(
              'Médicos',
              epsData.estadisticas?.totalMedicos?.toLocaleString() || 'N/A',
              'medical',
              '#2196F3'
            )}
            {renderEstadistica(
              'Consultorios',
              epsData.estadisticas?.totalConsultorios?.toLocaleString() || 'N/A',
              'business',
              '#FF9800'
            )}
            {renderEstadistica(
              'Calificación',
              epsData.estadisticas?.calificacion || 'N/A',
              'star',
              '#FFC107'
            )}
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.contactoItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.contactoText}>{epsData.direccion}</Text>
          </View>

          <TouchableOpacity 
            style={styles.contactoItem}
            onPress={() => handleLlamar(epsData.telefono)}
          >
            <Ionicons name="call-outline" size={20} color="#4CAF50" />
            <Text style={[styles.contactoText, styles.contactoLink]}>{epsData.telefono}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactoItem}
            onPress={() => handleEmail(epsData.email)}
          >
            <Ionicons name="mail-outline" size={20} color="#2196F3" />
            <Text style={[styles.contactoText, styles.contactoLink]}>{epsData.email}</Text>
          </TouchableOpacity>

          {epsData.sitioWeb && (
            <TouchableOpacity 
              style={styles.contactoItem}
              onPress={() => handleSitioWeb(epsData.sitioWeb)}
            >
              <Ionicons name="globe-outline" size={20} color="#FF9800" />
              <Text style={[styles.contactoText, styles.contactoLink]}>{epsData.sitioWeb}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Representante Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Representante Legal</Text>
          
          <View style={styles.representanteCard}>
            <View style={styles.representanteInfo}>
              <Text style={styles.representanteNombre}>{epsData.representanteLegal}</Text>
              <Text style={styles.representanteCargo}>Representante Legal</Text>
            </View>
          </View>

          {epsData.telefonoRepresentante && (
            <TouchableOpacity 
              style={styles.contactoItem}
              onPress={() => handleLlamar(epsData.telefonoRepresentante)}
            >
              <Ionicons name="call-outline" size={20} color="#4CAF50" />
              <Text style={[styles.contactoText, styles.contactoLink]}>{epsData.telefonoRepresentante}</Text>
            </TouchableOpacity>
          )}

          {epsData.emailRepresentante && (
            <TouchableOpacity 
              style={styles.contactoItem}
              onPress={() => handleEmail(epsData.emailRepresentante)}
            >
              <Ionicons name="mail-outline" size={20} color="#2196F3" />
              <Text style={[styles.contactoText, styles.contactoLink]}>{epsData.emailRepresentante}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIT:</Text>
            <Text style={styles.infoValue}>{epsData.nit}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Afiliación:</Text>
            <Text style={styles.infoValue}>{epsData.fechaAfiliacion}</Text>
          </View>

          {epsData.observaciones && (
            <View style={styles.observacionesContainer}>
              <Text style={styles.observacionesLabel}>Observaciones:</Text>
              <Text style={styles.observacionesText}>{epsData.observaciones}</Text>
            </View>
          )}
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditarEps', { eps: epsData })}
          >
            <Ionicons name="create-outline" size={20} color="#1976D2" />
            <Text style={styles.actionButtonText}>Editar EPS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.eliminarButton]}
            onPress={() => {
              Alert.alert(
                'Confirmar eliminación',
                '¿Estás seguro de que deseas eliminar esta EPS?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Éxito', 'EPS eliminada correctamente');
                      navigation.goBack();
                    }
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, styles.eliminarButtonText]}>Eliminar</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
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
  epsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  epsInfo: {
    flex: 1,
  },
  epsNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  epsTipo: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tipoText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
  },
  estadisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  estadisticaCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  estadisticaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  estadisticaContent: {
    flex: 1,
  },
  estadisticaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  estadisticaTitulo: {
    fontSize: 12,
    color: '#666',
  },
  contactoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  contactoLink: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  representanteCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  representanteInfo: {
    alignItems: 'center',
  },
  representanteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  representanteCargo: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  observacionesContainer: {
    marginTop: 12,
  },
  observacionesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  observacionesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
    marginHorizontal: 4,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  eliminarButton: {
    borderColor: '#F44336',
  },
  eliminarButtonText: {
    color: '#F44336',
  },
});
