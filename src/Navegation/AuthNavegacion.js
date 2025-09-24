import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../Screen/Auth/loginScreen';
import RegisterScreen from '../../Screen/Auth/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>

    );

}