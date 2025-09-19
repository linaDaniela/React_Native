import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditarPaciente = ({ route, navigation }) => {
    const { paciente } = route.params;
    const [nombre, setNombre] = useState(paciente.nombre);
    const [edad, setEdad] = useState(String(paciente.edad));
    const [direccion, setDireccion] = useState(paciente.direccion);

    const handleGuardar = () => {
        // Aquí puedes agregar la lógica para guardar los cambios, por ejemplo, llamar a una API
        Alert.alert('Paciente actualizado', 'Los datos han sido guardados correctamente.');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
            />
            <Text style={styles.label}>Edad:</Text>
            <TextInput
                style={styles.input}
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Dirección:</Text>
            <TextInput
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
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
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginTop: 5,
        borderRadius: 4
    }
});

export default EditarPaciente;