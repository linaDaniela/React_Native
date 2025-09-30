import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ConfiguracionScreen() {
  const navigation = useNavigation();
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: true,
    modoOscuro: false,
    backupAutomatico: true,
    sincronizacion: true,
  });

  const toggleConfiguracion = (key) => {
    setConfiguraciones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const guardarConfiguracion = () => {
    Alert.alert(
      'Configuración Guardada',
      'Los cambios han sido aplicados correctamente',
      [{ text: 'OK' }]
    );
  };

  const ConfiguracionItem = ({ icon, title, description, value, onToggle }) => (
    <View style={styles.configItem}>
      <View style={styles.configInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#1976D2" />
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.configTitle}>{title}</Text>
          <Text style={styles.configDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#E3F2FD' }}
        thumbColor={value ? '#1976D2' : '#F4F3F4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Configuración</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Configuraciones Generales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuraciones Generales</Text>
          
          <ConfiguracionItem
            icon="notifications-outline"
            title="Notificaciones"
            description="Recibir notificaciones del sistema"
            value={configuraciones.notificaciones}
            onToggle={() => toggleConfiguracion('notificaciones')}
          />

          <ConfiguracionItem
            icon="moon-outline"
            title="Modo Oscuro"
            description="Activar tema oscuro"
            value={configuraciones.modoOscuro}
            onToggle={() => toggleConfiguracion('modoOscuro')}
          />

          <ConfiguracionItem
            icon="cloud-upload-outline"
            title="Backup Automático"
            description="Realizar respaldos automáticos"
            value={configuraciones.backupAutomatico}
            onToggle={() => toggleConfiguracion('backupAutomatico')}
          />

          <ConfiguracionItem
            icon="sync-outline"
            title="Sincronización"
            description="Sincronizar datos en tiempo real"
            value={configuraciones.sincronizacion}
            onToggle={() => toggleConfiguracion('sincronizacion')}
          />
        </View>

        {/* Configuraciones de la Clínica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Clínica</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="business-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Datos de la Clínica</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="location-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Ubicación y Contacto</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="time-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Horarios de Atención</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Configuraciones del Sistema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistema</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="shield-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Seguridad y Permisos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="server-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Base de Datos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Ionicons name="refresh-outline" size={24} color="#1976D2" />
              <Text style={styles.actionTitle}>Actualizar Sistema</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Botón de Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={guardarConfiguracion}>
          <Text style={styles.saveButtonText}>Guardar Configuración</Text>
        </TouchableOpacity>
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
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  configDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
