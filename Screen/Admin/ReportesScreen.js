import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ReportesScreen() {
  const navigation = useNavigation();
  const [reportesGenerados, setReportesGenerados] = useState([]);

  const generarReporte = (tipo) => {
    Alert.alert(
      'Generando Reporte',
      `Generando reporte de ${tipo}...`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Generar',
          onPress: () => {
            const nuevoReporte = {
              id: Date.now().toString(),
              tipo,
              fecha: new Date().toLocaleDateString(),
              estado: 'Completado',
            };
            setReportesGenerados(prev => [nuevoReporte, ...prev]);
            Alert.alert('Éxito', 'Reporte generado correctamente');
          },
        },
      ]
    );
  };

  const ReporteItem = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.reporteItem} onPress={onPress}>
      <View style={styles.reporteInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#1976D2" />
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.reporteTitle}>{title}</Text>
          <Text style={styles.reporteDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const ReporteGenerado = ({ reporte }) => (
    <View style={styles.reporteGenerado}>
      <View style={styles.reporteHeader}>
        <Text style={styles.reporteTipo}>{reporte.tipo}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.estadoText}>{reporte.estado}</Text>
        </View>
      </View>
      <Text style={styles.reporteFecha}>Generado: {reporte.fecha}</Text>
      <View style={styles.reporteAcciones}>
        <TouchableOpacity style={styles.accionButton}>
          <Ionicons name="download-outline" size={16} color="#1976D2" />
          <Text style={styles.accionText}>Descargar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accionButton}>
          <Ionicons name="share-outline" size={16} color="#1976D2" />
          <Text style={styles.accionText}>Compartir</Text>
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
        <Text style={styles.titulo}>Reportes</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Generar Reportes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generar Reportes</Text>
          
          <ReporteItem
            icon="people-outline"
            title="Reporte de Pacientes"
            description="Listado completo de pacientes registrados"
            onPress={() => generarReporte('Pacientes')}
          />

          <ReporteItem
            icon="calendar-outline"
            title="Reporte de Citas"
            description="Citas programadas y completadas"
            onPress={() => generarReporte('Citas')}
          />

          <ReporteItem
            icon="medical-outline"
            title="Reporte de Médicos"
            description="Personal médico y especialidades"
            onPress={() => generarReporte('Médicos')}
          />

          <ReporteItem
            icon="business-outline"
            title="Reporte de EPS"
            description="Entidades de salud afiliadas"
            onPress={() => generarReporte('EPS')}
          />

          <ReporteItem
            icon="bar-chart-outline"
            title="Reporte Estadístico"
            description="Estadísticas generales del sistema"
            onPress={() => generarReporte('Estadísticas')}
          />

          <ReporteItem
            icon="cash-outline"
            title="Reporte Financiero"
            description="Ingresos y gastos de la clínica"
            onPress={() => generarReporte('Financiero')}
          />
        </View>

        {/* Reportes Generados */}
        {reportesGenerados.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportes Generados</Text>
            {reportesGenerados.map((reporte) => (
              <ReporteGenerado key={reporte.id} reporte={reporte} />
            ))}
          </View>
        )}

        {/* Configuración de Reportes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="time-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Reportes Automáticos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="mail-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Envío por Email</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.configItem}>
            <View style={styles.configInfo}>
              <Ionicons name="folder-outline" size={24} color="#1976D2" />
              <Text style={styles.configTitle}>Almacenamiento</Text>
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
  reporteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reporteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  reporteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  reporteDescription: {
    fontSize: 14,
    color: '#666',
  },
  reporteGenerado: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reporteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reporteTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  reporteFecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reporteAcciones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  accionText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 4,
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
