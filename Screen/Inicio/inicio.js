import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CardComponent from "../../components/CardComponent";
import { getStoredUser } from "../../src/Services/AuthService";

export default function Inicio() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user && !loading) {
      navigation.navigate('PanelSelector');
    }
  }, [user, loading, navigation]);

  const loadUserData = async () => {
    try {
      const { user: userData } = await getStoredUser();
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si el usuario está logueado, no mostrar nada (se navegará automáticamente)
  if (user) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Citas Médicas</Text>
      </View>

      {/* Botones de Login y Registro */}
      <View style={styles.authButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Información de la aplicación */}
      <View style={styles.infoContainer}>
        <Text style={styles.welcomeText}>¡Bienvenido a Citas Médicas!</Text>
        <Text style={styles.descriptionText}>
          Sistema de gestión médica para pacientes y profesionales de la salud.
        </Text>
        <Text style={styles.descriptionText}>
          Inicia sesión o regístrate para acceder a tu panel personalizado.
        </Text>
      </View>

      {/* Características del sistema */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#198754" />
          <Text style={styles.featureTitle}>Seguro</Text>
          <Text style={styles.featureText}>Tus datos están protegidos</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="time-outline" size={32} color="#0d6efd" />
          <Text style={styles.featureTitle}>Rápido</Text>
          <Text style={styles.featureText}>Gestión eficiente de citas</Text>
        </View>
        <View style={styles.featureCard}>
          <Ionicons name="people-outline" size={32} color="#fd7e14" />
          <Text style={styles.featureTitle}>Fácil</Text>
          <Text style={styles.featureText}>Interfaz intuitiva</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  header: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubText: {
    color: "#6c757d",
  },
  cardStatus: {
    color: "#198754",
    fontWeight: "bold",
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    width: "47%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  featureCard: {
    backgroundColor: "#fff",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  featureText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },
});
