import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { estadisticasService } from '../service/estadisticasService';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const EstadisticasCard = ({ icon, title, value, subtitle, color = "#ff9a9e" }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const EstadisticasDashboard = ({ refreshTrigger }) => {
  const [estadisticas, setEstadisticas] = useState({
    medicos: { total: 0, activos: 0, inactivos: 0 },
    pacientes: { total: 0, activos: 0, inactivos: 0 },
    citas: { total: 0, hoy: 0, pendientes: 0, confirmadas: 0, completadas: 0, canceladas: 0 },
    especialidades: { total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        medicos,
        pacientes,
        citas,
        especialidades
      ] = await Promise.all([
        estadisticasService.getEstadisticasMedicos(),
        estadisticasService.getEstadisticasPacientes(),
        estadisticasService.getEstadisticasCitas(),
        estadisticasService.getEstadisticasEspecialidades()
      ]);

      setEstadisticas({
        medicos,
        pacientes,
        citas,
        especialidades
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEstadisticas();
    setRefreshing(false);
  };

  // Usar el hook de auto-refresh
  const { forceRefresh } = useAutoRefresh(loadEstadisticas, 15000); // 15 segundos

  useEffect(() => {
    loadEstadisticas();
  }, [loadEstadisticas]);

  // Actualizar cuando cambie el refreshTrigger
  useEffect(() => {
    if (refreshTrigger) {
      loadEstadisticas();
    }
  }, [refreshTrigger, loadEstadisticas]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff9a9e" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#ff9a9e']}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Resumen del Sistema</Text>
        <Text style={styles.headerSubtitle}>Estadísticas en tiempo real</Text>
      </View>

      <View style={styles.statsGrid}>
        <EstadisticasCard
          icon="medical"
          title="Médicos"
          value={estadisticas.medicos.total}
          subtitle={`${estadisticas.medicos.activos} activos`}
          color="#4CAF50"
        />

        <EstadisticasCard
          icon="people"
          title="Pacientes"
          value={estadisticas.pacientes.total}
          subtitle={`${estadisticas.pacientes.activos} activos`}
          color="#2196F3"
        />

        <EstadisticasCard
          icon="calendar"
          title="Citas Hoy"
          value={estadisticas.citas.hoy}
          subtitle={`${estadisticas.citas.total} total`}
          color="#FF9800"
        />

        <EstadisticasCard
          icon="library"
          title="Especialidades"
          value={estadisticas.especialidades.total}
          subtitle="Disponibles"
          color="#9C27B0"
        />
      </View>

      <View style={styles.detailedStats}>
        <Text style={styles.sectionTitle}>📈 Detalles de Citas</Text>
        <View style={styles.detailedGrid}>
          <EstadisticasCard
            icon="time"
            title="Programadas"
            value={estadisticas.citas.programadas}
            color="#FF9800"
          />
          <EstadisticasCard
            icon="checkmark-circle"
            title="Confirmadas"
            value={estadisticas.citas.confirmadas}
            color="#2196F3"
          />
          <EstadisticasCard
            icon="checkmark-done"
            title="Completadas"
            value={estadisticas.citas.completadas}
            color="#4CAF50"
          />
          <EstadisticasCard
            icon="close-circle"
            title="Canceladas"
            value={estadisticas.citas.canceladas}
            color="#F44336"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  detailedStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default EstadisticasDashboard;
