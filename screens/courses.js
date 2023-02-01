import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./courses/courseHome";
import Websites from "./courses/websites";
import Notifications from "./courses/notifications";
import Details from "./courses/details";

const Stack = createNativeStackNavigator();

export default function Courses() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Websites" component={Websites} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}
