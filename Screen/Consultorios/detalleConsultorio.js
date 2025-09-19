import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetalleConsultorio = ({ route }) => {
    const { consultorio } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle del Consultorio</Text>
            {consultorio ? (
                <>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{consultorio.nombre}</Text>
                    <Text style={styles.label}>Dirección:</Text>
                    <Text style={styles.value}>{consultorio.direccion}</Text>
                    <Text style={styles.label}>Teléfono:</Text>
                    <Text style={styles.value}>{consultorio.telefono}</Text>
                </>
            ) : (
                <Text>No hay información del consultorio.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10
    },
    value: {
        fontSize: 16,
        marginBottom: 10
    }
});

export default DetalleConsultorio;