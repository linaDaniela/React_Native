import { createNativeStackNavigator} from '@react-navigation/native-stack';
import ListarPacientes from "../../Screen/Paciente/listarPaciente";
import EditarPaciente from "../../Screen/Paciente/editarPaciente";

const Stack = createNativeStackNavigator();

export default function PacientesStack() {
    return (
        <Stack.Navigator initialRouteName="ListarPacientes">
            <Stack.Screen
                name="ListarPacientes"
                component={ListarPacientes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditarPaciente"
                component={EditarPaciente}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}