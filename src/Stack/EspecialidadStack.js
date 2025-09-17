import { createStackNavigator } from "@react-navigation/stack";
import ListarEspecialidades from "../../Screen/Especialidad/ListarEspecialidades";
import EditarEspecialidad from "../../Screen/Especialidad/editarEspecialidad";

const Stack = createStackNavigator();

export default function EspecialidadStack() {
    return (
        <Stack.Navigator initialRouteName="ListarEspecialidades">
            <Stack.Screen
                name="ListarEspecialidades"
                component={ListarEspecialidades}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditarEspecialidad"
                component={EditarEspecialidad}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}