import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getStoredUser } from '../../src/service/AuthService';
import PanelUsuario from './PanelUsuario';
import PanelMedico from './PanelMedico';
import PanelAdmin from './PanelAdmin';

export default function PanelSelector() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log("PanelSelector: Cargando datos del usuario...");
      const { user: userData } = await getStoredUser();
      console.log("PanelSelector: Usuario cargado:", userData);
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Cargando panel...</Text>
      </View>
    );
  }

  // Determinar qué panel mostrar basado en el rol del usuario
  const renderPanel = () => {
    console.log("PanelSelector: Renderizando panel para usuario:", user);
    
    if (!user) {
      console.log("PanelSelector: No hay usuario, mostrando panel de paciente por defecto");
      return <PanelUsuario />;
    }

    const role = user.role?.toLowerCase();
    console.log("PanelSelector: Rol del usuario:", role);
    console.log("PanelSelector: Datos completos del usuario:", JSON.stringify(user, null, 2));

    switch (role) {
      case 'admin':
      case 'administrador':
        console.log("PanelSelector: Mostrando panel de administrador");
        return <PanelAdmin />;
      case 'medico':
      case 'doctor':
        console.log("PanelSelector: Mostrando panel de médico");
        return <PanelMedico />;
      case 'paciente':
      case 'usuario':
      case 'user':
      default:
        console.log("PanelSelector: Mostrando panel de paciente");
        return <PanelUsuario />;
    }
  };

  return renderPanel();
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
