import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PanelSelector from '../../Screen/Paneles/PanelSelector';
import InicioStack from '../Stack/InicioStack';
import CrearMedico from '../../Screen/Admin/CrearMedico';
import CrearAdmin from '../../Screen/Admin/CrearAdmin';
import CrearPaciente from '../../Screen/Admin/CrearPaciente';
import CrearEps from '../../Screen/Admin/CrearEps';
import CrearEspecialidad from '../../Screen/Admin/CrearEspecialidad';
import CrearConsultorio from '../../Screen/Admin/CrearConsultorio';
import ListaUsuarios from '../../Screen/Admin/ListaUsuarios';
import RegisterScreen from '../../Screen/Auth/RegisterScreen';
import PacientesStack from '../Stack/PacientesStack';
import CitasStack from '../Stack/CitasStack';
import EpsStack from '../Stack/EpsStack';
import EspecialidadStack from '../Stack/EspecialidadStack';
import MedicoStack from '../Stack/MedicoStack';
import ConsultoriosStack from '../Stack/ConsultoriosStack';

const Stack = createNativeStackNavigator();

export default function NavegacionPrincipal() {
    return (
        <Stack.Navigator initialRouteName="PanelSelector">
            <Stack.Screen
                name="PanelSelector"
                component={PanelSelector}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="InicioStack"
                component={InicioStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearMedico"
                component={CrearMedico}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearAdmin"
                component={CrearAdmin}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearPaciente"
                component={CrearPaciente}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearEps"
                component={CrearEps}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearEspecialidad"
                component={CrearEspecialidad}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CrearConsultorio"
                component={CrearConsultorio}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ListaUsuarios"
                component={ListaUsuarios}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PacientesFlow"
                component={PacientesStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CitasFlow"
                component={CitasStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EpsFlow"
                component={EpsStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Especialidades"
                component={EspecialidadStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Medico"
                component={MedicoStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Consultorios"
                component={ConsultoriosStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}