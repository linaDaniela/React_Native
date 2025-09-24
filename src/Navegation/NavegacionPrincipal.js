import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PanelSelector from '../../Screen/Paneles/PanelSelector';
import InicioStack from '../Stack/InicioStack';

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
        </Stack.Navigator>
    );
}