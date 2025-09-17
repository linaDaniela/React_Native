import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "../../Screen/Inicio/inicio";
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
        </Stack.Navigator>
    )
}