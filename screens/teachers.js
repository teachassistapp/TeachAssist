import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeacherSearch from './teachers/teacher_search';
import TeacherDetails from './teachers/teacher_details';

const Stack = createNativeStackNavigator();

export default function teachers() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Teacher Search" component={TeacherSearch} />
      <Stack.Screen name="Teacher Details" component={TeacherDetails} />
    </Stack.Navigator>
  );
}
