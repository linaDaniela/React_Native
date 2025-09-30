import React, {useState, useEffect, useRef} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import NavegacionPrincipal from "./NavegacionPrincipal";
import AuthNavegation from "./AuthNavegacion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

export default function AppNavegacion() {
  const [isCargando, setEstaCargando] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [forceReload, setForceReload] = useState(0);
  const appState = useRef(AppState.currentState);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("AppNavegacion: Token cargado:", token ? "SÍ" : "NO");
      setUserToken(token);
    } catch (error) {
      console.error("Error al cargar el token:", error);
    } finally {
      setEstaCargando(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState)=>{
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log("App en primer plano, verificando token");
        loadToken();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  },[]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (AppState.current === 'active') {
        loadToken();
      }
    }, 200); // Verificar cada 200ms para respuesta más rápida
    return () => clearInterval(interval);
  }, []);

  // Efecto para forzar recarga cuando se elimina el token
  useEffect(() => {
    if (forceReload > 0) {
      console.log("Forzando recarga del estado de navegación");
      loadToken();
    }
  }, [forceReload]);

  // Función global para forzar recarga (puede ser llamada desde cualquier componente)
  global.forceNavigationReload = () => {
    console.log("Forzando recarga desde componente externo");
    setForceReload(prev => prev + 1);
  };

  if (isCargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <NavegacionPrincipal /> : <AuthNavegation />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});