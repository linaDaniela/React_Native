import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DetalleCitas = ({ route, navigation }) => {
    const { cita } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle de la Cita</Text>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{cita.fecha}</Text>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{cita.hora}</Text>
            <Text style={styles.label}>Especialista:</Text>
            <Text style={styles.value}>{cita.especialista}</Text>
            <Text style={styles.label}>Lugar:</Text>
            <Text style={styles.value}>{cita.lugar}</Text>
            <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12
    },
    value: {
        fontSize: 16,
        marginBottom: 8
    }
});

export default DetalleCitas;