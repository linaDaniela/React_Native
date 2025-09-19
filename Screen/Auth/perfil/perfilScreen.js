import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
// Import axios or your API client
import axios from "axios";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    containerPerfil: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
    },
});

const PerfilScreen = () => {
    const [Usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get("YOUR_API_ENDPOINT", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuario(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar el perfil");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando perfil...</Text>
            </View>
        );
    }

    if (!Usuario) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No se encontró información del usuario.</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de Usuario</Text>
            <View style={styles.containerPerfil}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{Usuario.user?.nombre || "No disponible"}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{Usuario.user?.email || "No disponible"}</Text>
            </View>
        </View>
    );
};

export default PerfilScreen;