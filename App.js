import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { AppearanceProvider } from "react-native-appearance";
import { ThemeProvider } from "./globals/theme";
//import { useColorScheme } from "react-native";
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
  const [loggedIn, setLoggedIn] = useState(null);
  const Stack = createNativeStackNavigator();
  //const scheme = useColorScheme();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const isLoggedIn = async () => {
    try {
      const number = await AsyncStorage.getItem("number");
      const pass = await AsyncStorage.getItem("password");
      setLoggedIn(number !== null && pass !== null);
    } catch {}
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (!fontsLoaded || loggedIn === null) {
    return null;
  } else {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {loggedIn ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Login" component={Login} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Home" component={Home} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
