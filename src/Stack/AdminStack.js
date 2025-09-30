import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConfiguracionScreen from "../../Screen/Admin/ConfiguracionScreen";
import ReportesScreen from "../../Screen/Admin/ReportesScreen";
import UsuariosScreen from "../../Screen/Admin/UsuariosScreen";
import CrearMedico from "../../Screen/Admin/CrearMedico";
import CrearAdmin from "../../Screen/Admin/CrearAdmin";
import ListaUsuarios from "../../Screen/Admin/ListaUsuarios";
import CrearConsultorio from "../../Screen/Admin/CrearConsultorio";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
    return (
        <Stack.Navigator initialRouteName="ConfiguracionScreen">
            <Stack.Screen
                name="ConfiguracionScreen"
                component={ConfiguracionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ReportesScreen"
                component={ReportesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UsuariosScreen"
                component={UsuariosScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearMedico"
                component={CrearMedico}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ListaUsuarios"
                component={ListaUsuarios}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearAdmin"
                component={CrearAdmin}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearConsultorio"
                component={CrearConsultorio}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
