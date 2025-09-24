import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SimpleLogoutButton({ style, textStyle, showIcon = true }) {
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpiar datos del usuario
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userData");
              console.log("Logout exitoso - datos limpiados");
              
              // Recargar la página para volver al login
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un error al cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={[styles.logoutButton, style]} onPress={handleLogout}>
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
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
