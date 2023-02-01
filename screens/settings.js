import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHome from "./settings/settingsHome";
import About from "./settings/about";
import Feedback from "./settings/feedback";
import HelpHome from "./settings/help/helpHome";
import CourseHelp from "./settings/help/courseHelp";
import SearchHelp from "./settings/help/searchHelp";
import TeacherHelp from "./settings/help/teacherHelp";
import GuidanceHelp from "./settings/help/guidanceHelp";

const Stack = createNativeStackNavigator();
export default function Settings() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsHome} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="HelpHome" component={HelpHome} />
      <Stack.Screen name="CourseHelp" component={CourseHelp} />
      <Stack.Screen name="SearchHelp" component={SearchHelp} />
      <Stack.Screen name="TeacherHelp" component={TeacherHelp} />
      <Stack.Screen name="GuidanceHelp" component={GuidanceHelp} />
    </Stack.Navigator>
  );
}
