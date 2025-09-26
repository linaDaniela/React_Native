import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "../../Screen/Inicio/inicio";
import PanelSelector from "../../Screen/Paneles/PanelSelector";
import MisCitas from "../../Screen/PantallasFaltantes/MisCitas";
import MiPerfil from "../../Screen/PantallasFaltantes/MiPerfil";
import HistorialMedico from "../../Screen/PantallasFaltantes/HistorialMedico";
import BuscarMedicos from "../../Screen/PantallasFaltantes/BuscarMedicos";
// Pantallas específicas para médicos
import MiAgenda from "../../Screen/Medico/MiAgenda";
import MisPacientes from "../../Screen/Medico/MisPacientes";
import Consultas from "../../Screen/Medico/Consultas";
import EmitirRecetas from "../../Screen/Medico/EmitirRecetas";
import HistorialesMedicos from "../../Screen/Medico/HistorialesMedicos";
// Pantallas específicas para pacientes
import MisCitasPaciente from "../../Screen/Paciente/MisCitas";
import MiPerfilPaciente from "../../Screen/Paciente/MiPerfil";
// Pantallas específicas para administradores
import CrearMedico from "../../Screen/Admin/CrearMedico";
import ListaUsuarios from "../../Screen/Admin/ListaUsuarios";
import PacientesStack from "./PacientesStack";
import CitasStack from "./CitasStack";
import MedicoStack from "./MedicoStack";
import EspecialidadStack from "./EspecialidadStack";
import EpsStack from "./EpsStack";


const Stack = createNativeStackNavigator();

export default function InicioStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="InicioPantalla"
            component={Inicio}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="PanelSelector"
            component={PanelSelector}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="PacientesFlow"
            component={PacientesStack}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="CitasFlow"
            component={CitasStack}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="Medico"
            component={MedicoStack}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="Especialidades"
            component={EspecialidadStack}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="EpsFlow"
            component={EpsStack}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="MisCitas"
            component={MisCitas}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="MiPerfil"
            component={MiPerfil}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="HistorialMedico"
            component={HistorialMedico}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="BuscarMedicos"
            component={BuscarMedicos}
            options={{ headerShown: false}}
        />

            {/* Pantallas específicas para médicos */}
            <Stack.Screen
            name="MiAgenda"
            component={MiAgenda}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="MisPacientes"
            component={MisPacientes}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="Consultas"
            component={Consultas}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="EmitirRecetas"
            component={EmitirRecetas}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="HistorialesMedicos"
            component={HistorialesMedicos}
            options={{ headerShown: false}}
        />

            {/* Pantallas específicas para pacientes */}
            <Stack.Screen
            name="MisCitasPaciente"
            component={MisCitasPaciente}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="MiPerfilPaciente"
            component={MiPerfilPaciente}
            options={{ headerShown: false}}
        />

            {/* Pantallas específicas para administradores */}
            <Stack.Screen
            name="CrearMedico"
            component={CrearMedico}
            options={{ headerShown: false}}
        />

            <Stack.Screen
            name="ListaUsuarios"
            component={ListaUsuarios}
            options={{ headerShown: false}}
        />
        </Stack.Navigator>
    )
}