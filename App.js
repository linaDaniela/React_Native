import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InicioStack from "./src/Stack/InicioStack";
import LoginScreen from "./Screen/Auth/loginScreen";
import RegisterScreen from "./Screen/Auth/RegisterScreen";

const Stack = createStackNavigator();

import React from "react";
import { View, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="InicioStack">
          <Stack.Screen name="InicioStack" component={InicioStack} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cf82c5ff",
  },
});
