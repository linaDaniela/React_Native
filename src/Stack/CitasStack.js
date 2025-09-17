import { createStackNavigator } from "@react-navigation/stack";
import ListarCitas from "../../Screen/Citas/listarCitas";
import EditarCita from "../../Screen/Citas/editarCitas";

const Stack = createStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator initialRouteName="ListarCitas">
      <Stack.Screen
        name="ListarCitas"
        component={ListarCitas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarCita"
        component={EditarCita}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}