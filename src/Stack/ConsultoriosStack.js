import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListarConsultorios from '../../Screen/Consultorios/ListarConsultorios';
import DetalleConsultorio from '../../Screen/Consultorios/detalleConsultorio';
import EditarConsultorio from '../../Screen/Consultorios/editarConsultorio';

const Stack = createNativeStackNavigator();

export default function ConsultoriosStack() {
    return (
        <Stack.Navigator initialRouteName="ListarConsultorios">
            <Stack.Screen
                name="ListarConsultorios"
                component={ListarConsultorios}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetalleConsultorio"
                component={DetalleConsultorio}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditarConsultorio"
                component={EditarConsultorio}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

