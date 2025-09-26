import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DirectLogoutButton({ style, textStyle, showIcon = true, navigation }) {
  const handleLogout = async () => {
    try {
      console.log("Iniciando logout directo...");
      
      // Mostrar confirmación
      Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro de que quieres cerrar sesión?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Cerrar Sesión",
            style: "destructive",
            onPress: async () => {
              try {
                // Limpiar datos del usuario
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("userData");
                console.log("Logout exitoso - datos limpiados");
                
                // Navegar al inicio
                if (navigation) {
                  navigation.navigate('InicioStack', { 
                    screen: 'InicioPantalla' 
                  });
                }
                
                // Para web, recargar la página
                if (Platform.OS === 'web') {
                  console.log("Recargando página...");
                  window.location.reload();
                }
              } catch (error) {
                console.error('Error al cerrar sesión:', error);
                Alert.alert("Error", "Hubo un problema al cerrar sesión");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión");
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.logoutButton, style]} 
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      {showIcon && <Ionicons name="log-out-outline" size={20} color="#F44336" />}
      <Text style={[styles.logoutText, textStyle]}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    minWidth: 120,
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
