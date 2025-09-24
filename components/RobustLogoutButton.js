import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RobustLogoutButton({ style, textStyle, showIcon = true }) {
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
              console.log("Iniciando proceso de logout...");
              
              // Limpiar datos del usuario
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userData");
              console.log("Logout exitoso - datos limpiados");
              
              // Diferentes estrategias según la plataforma
              if (Platform.OS === 'web') {
                // Para web, usar múltiples métodos
                try {
                  // Método 1: Recargar la página
                  window.location.reload();
                } catch (error) {
                  console.log("Método 1 falló, intentando método 2...");
                  try {
                    // Método 2: Cambiar la URL
                    window.location.href = window.location.origin;
                  } catch (error2) {
                    console.log("Método 2 falló, intentando método 3...");
                    // Método 3: Forzar recarga
                    window.location.replace(window.location.href);
                  }
                }
              } else {
                // Para móvil, mostrar mensaje de éxito
                Alert.alert('Éxito', 'Sesión cerrada correctamente. Reinicia la aplicación.');
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
