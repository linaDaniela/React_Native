import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { especialidadesService } from '../../src/service/ApiService';

const { width, height } = Dimensions.get('window');

export default function InicioScreen({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEspecialidades();
  }, []);

  const loadEspecialidades = async () => {
    try {
      const result = await especialidadesService.getAll();
      if (result.success) {
        setEspecialidades(result.data || []);
      } else {
        console.log('Especialidades cargadas:', result);
        setEspecialidades([]);
      }
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      setEspecialidades([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForSpecialty = (nombre) => {
    const iconMap = {
      'Cardiología': 'heart',
      'Traumatología': 'medical',
      'Pediatría': 'people',
      'Ginecología': 'female',
      'Neurología': 'medical',
      'Dermatología': 'body',
      'Oftalmología': 'eye',
      'Otorrinolaringología': 'ear',
      'Psiquiatría': 'headset',
      'Medicina Interna': 'medical-bag',
      'Cirugía General': 'cut',
      'Urología': 'male',
      'Oncología': 'shield',
      'Endocrinología': 'leaf',
      'Gastroenterología': 'restaurant',
      'Neumología': 'airplane',
      'Reumatología': 'fitness',
      'Hematología': 'water',
      'Nefrología': 'funnel',
      'Infectología': 'bug'
    };
    return iconMap[nombre] || 'medical';
  };

  const getColorForSpecialty = (index) => {
    const colors = [
      '#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a',
      '#ffecd2', '#a8edea', '#d299c2', '#fad0c4', '#ff9a9e'
    ];
    return colors[index % colors.length];
  };

  const renderEspecialidadCard = ({ item, index }) => (
    <TouchableOpacity style={styles.especialidadCard}>
      <LinearGradient
        colors={[getColorForSpecialty(index), getColorForSpecialty(index) + '80']}
        style={styles.especialidadGradient}
      >
        <View style={styles.especialidadContent}>
          <View style={styles.especialidadIcon}>
            <Ionicons 
              name={getIconForSpecialty(item.nombre)} 
              size={32} 
              color="#fff" 
            />
          </View>
          <Text style={styles.especialidadNombre}>{item.nombre}</Text>
          <Text style={styles.especialidadDescripcion} numberOfLines={2}>
            {item.descripcion || 'Especialidad médica'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={40} color="#fff" />
            <Text style={styles.logoText}>EPS Citas</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Tu salud es nuestra prioridad
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            ¡Bienvenido a EPS Citas!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Agenda tus citas médicas de manera fácil y rápida
          </Text>
          
          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLoginPress}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Ionicons name="log-in" size={20} color="#fff" />
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegisterPress}
            >
              <View style={styles.registerButtonContent}>
                <Ionicons name="person-add" size={20} color="#667eea" />
                <Text style={styles.registerButtonText}>Registrarse</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#667eea" />
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Pacientes</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="medical" size={24} color="#667eea" />
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Médicos</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#667eea" />
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Citas</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#667eea" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
          </View>
        </View>

        {/* Especialidades */}
        <View style={styles.especialidadesSection}>
          <Text style={styles.sectionTitle}>Especialidades Médicas</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando especialidades...</Text>
            </View>
          ) : (
            <FlatList
              data={especialidades.slice(0, 6)} // Mostrar solo las primeras 6
              renderItem={renderEspecialidadCard}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.especialidadesGrid}
            />
          )}
        </View>

        {/* Características principales */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={24} color="#43e97b" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Agenda 24/7</Text>
                <Text style={styles.featureDescription}>
                  Reserva tu cita en cualquier momento del día
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#43e97b" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Seguro y Confiable</Text>
                <Text style={styles.featureDescription}>
                  Tus datos están protegidos con la máxima seguridad
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={24} color="#43e97b" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Recordatorios</Text>
                <Text style={styles.featureDescription}>
                  Te notificamos antes de tu cita médica
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 EPS Citas - Todos los derechos reservados
          </Text>
          <Text style={styles.footerSubtext}>
            Desarrollado con ❤️ para tu bienestar
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  actionButtons: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 30,
    gap: 10,
  },
  registerButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  especialidadesSection: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  especialidadesGrid: {
    paddingBottom: 10,
  },
  especialidadCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  especialidadGradient: {
    padding: 15,
    minHeight: 120,
  },
  especialidadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  especialidadIcon: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  especialidadNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  especialidadDescripcion: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 16,
  },
  featuresSection: {
    padding: 20,
  },
  featuresList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});