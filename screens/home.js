// navbar
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
import guidance from "./guidance";
import search from "./search";
import teachers from "./teachers";
import settings from "./settings";
import courses from "./courses";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { useTheme } from "../globals/theme";

const Tab = createBottomTabNavigator();

export default function Home() {
  const { colors } = useTheme();
  const vh = Dimensions.get("window").height;
  let [fontsLoaded] = useFonts({ Poppins_400Regular });
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: colors.Subtitle,
          tabBarActiveTintColor: colors.Primary1,
          tabBarLabelPosition: "below-icon",
          tabBarStyle: {
            backgroundColor: colors.Background,
            borderTopColor: colors.Border,
            borderTopWidth: 1,
            shadowColor: colors.Shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            elevation: 6,
            shadowRadius: 10,
            paddingTop: 6,
            paddingBottom: 0.33 * Math.sqrt(vh) + 2,
            height: 60,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="home"
          component={courses}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="guidance"
          component={guidance}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size + 2} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="search"
          component={search}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={size - 2} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="teachers"
          component={teachers}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5
                name="chalkboard-teacher"
                size={size - 3}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-sharp" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
