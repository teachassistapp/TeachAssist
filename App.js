import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppearanceProvider } from "react-native-appearance";
import { ThemeProvider } from "./globals/theme";
import { useColorScheme } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import Home from "./screens/home";
import Login from "./screens/login";

export default function App() {
  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  } else {
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
          </NavigationContainer>
        </ThemeProvider>
      </AppearanceProvider>
    );
  }
}
