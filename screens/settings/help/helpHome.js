import React from "react";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../globals/theme";
import { GENERAL_STYLES } from "../../../globals/styles";
import { BackHeader } from "../../../components/BackHeader";

export default function HelpHome({ navigation }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{ ...GENERAL_STYLES(colors).safeView, alignItems: "center" }}
    >
      <View style={GENERAL_STYLES(colors).container}>
        <BackHeader header="Help & FAQ" colors={colors} />
        <View style={styles(colors).itemContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CourseHelp")}
            style={styles(colors).item}
          >
            <Ionicons name="school" size={55} color={colors.Primary1} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchHelp")}
            style={styles(colors).item}
          >
            <FontAwesome name="search" size={49} color={colors.Primary1} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("GuidanceHelp")}
            style={styles(colors).item}
          >
            <Ionicons name="people" size={58} color={colors.Primary1} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("TeacherHelp")}
            style={styles(colors).item}
          >
            <FontAwesome5
              name="chalkboard-teacher"
              size={47}
              color={colors.Primary1}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    itemContainer: {
      marginTop: 0.25 * vw,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0.02 * vw,
      width: 0.3 * vw,
      height: 0.3 * vw,
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.Border,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    h: {
      fontFamily: "Poppins_700Bold",
      fontSize: 18,
      color: colors.Primary1,
      textAlign: "center",
      marginBottom: 15,
    },
    p1: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
      marginTop: 15,
      marginBottom: 12,
      maxWidth: 0.75 * vw,
    },
    p2: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
    },
  });
