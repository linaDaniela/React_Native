import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditarEspecialidad = ({ route, navigation }) => {
    const { especialidad } = route.params;
    const [nombre, setNombre] = useState(especialidad.nombre);

    const handleGuardar = async () => {
        try {
            // Aquí deberías llamar a tu API para actualizar la especialidad
            // Ejemplo:
            // await fetch('URL_API', { method: 'PUT', body: JSON.stringify({ nombre }) });
            Alert.alert('Especialidad actualizada', 'Los cambios se guardaron correctamente.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la especialidad.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre de la Especialidad:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ingrese el nombre"
            />
            <Button title="Guardar Cambios" onPress={handleGuardar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    label: {
        fontSize: 16,
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 16,
        borderRadius: 4
    }
});

export default EditarEspecialidad;