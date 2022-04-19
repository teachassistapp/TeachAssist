import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/home";
import Login from "./screens/login";
import { AppearanceProvider } from "react-native-appearance";
import { ThemeProvider, useTheme } from "./globals/theme";
import { useColorScheme } from "react-native";

export default function App() {
  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();
  return (
    <AppearanceProvider>
      <ThemeProvider>
        <NavigationContainer
          theme={scheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </AppearanceProvider>
  );
}
