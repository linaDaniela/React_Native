import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function InicioClinica() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header con logo de la clínica */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={60} color="#1976D2" />
          <Text style={styles.logoText}>Clínica San Rafael</Text>
          <Text style={styles.subtitle}>Cuidando tu salud con excelencia</Text>
        </View>
      </View>

      {/* Información de la clínica */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Bienvenido a nuestra clínica</Text>
        <Text style={styles.description}>
          Somos una clínica especializada en brindar atención médica de calidad 
          con profesionales altamente capacitados y tecnología de vanguardia.
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={24} color="#1976D2" />
            <Text style={styles.featureText}>Atención 24/7</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={24} color="#1976D2" />
            <Text style={styles.featureText}>Médicos Especializados</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#1976D2" />
            <Text style={styles.featureText}>Seguridad Garantizada</Text>
          </View>
        </View>
      </View>

      {/* Botones principales */}
      <View style={styles.buttonsSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="log-in-outline" size={24} color="#fff" />
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Ionicons name="person-add-outline" size={24} color="#1976D2" />
          <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Servicios disponibles */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
        
        <View style={styles.servicesGrid}>
          <View style={styles.serviceCard}>
            <Ionicons name="heart-outline" size={32} color="#F44336" />
            <Text style={styles.serviceTitle}>Cardiología</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="eye-outline" size={32} color="#4CAF50" />
            <Text style={styles.serviceTitle}>Dermatología</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="fitness-outline" size={32} color="#FF9800" />
            <Text style={styles.serviceTitle}>Ortopedia</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="female-outline" size={32} color="#E91E63" />
            <Text style={styles.serviceTitle}>Ginecología</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="brain-outline" size={32} color="#9C27B0" />
            <Text style={styles.serviceTitle}>Neurología</Text>
          </View>
          <View style={styles.serviceCard}>
            <Ionicons name="happy-outline" size={32} color="#00BCD4" />
            <Text style={styles.serviceTitle}>Pediatría</Text>
          </View>
        </View>
      </View>

      {/* Información de contacto */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Información de Contacto</Text>
        
        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.contactText}>Calle Principal #123, Bogotá D.C.</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.contactText}>+57 1 234 5678</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.contactText}>info@clinicasanrafael.com</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.contactText}>Lunes a Viernes: 8:00 AM - 6:00 PM</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Clínica San Rafael</Text>
        <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  secondaryButtonText: {
    color: '#1976D2',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  servicesSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 70) / 2,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  contactSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  footer: {
    backgroundColor: '#1976D2',
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#E3F2FD',
    fontSize: 12,
    marginTop: 5,
  },
});