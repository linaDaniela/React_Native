import { createStackNavigator } from "@react-navigation/stack";
import ListarMedico from "../../Screen/Medico/ListarMedico";
import EditarMedico from "../../Screen/Medico/editarMedico";

const Stack = createStackNavigator();

export default function MedicoStack() {
  return (
    <Stack.Navigator initialRouteName="ListarMedico">
      <Stack.Screen
        name="ListarMedico"
        component={ListarMedico}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarMedico"
        component={EditarMedico}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}