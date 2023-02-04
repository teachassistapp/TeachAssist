// navbar
import React, {useContext} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Guidance from "./guidance";
import Search from "./search";
import Teachers from "./teachers";
import Settings from "./settings";
import Courses from "./courses";
import { ThemeContext } from "../globals/theme";
import { lightColors, darkColors } from "../globals/colors";

const Tab = createBottomTabNavigator();

export default function Home() {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  const vh = Dimensions.get("window").height;
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
          paddingBottom: 0.66 * Math.sqrt(vh) + 2,
          height: 70,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={Courses}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="guidance"
        component={Guidance}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size + 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="teachers"
        component={Teachers}
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
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
