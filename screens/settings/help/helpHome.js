import React from "react";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../globals/theme";

export default function HelpHome({ navigation }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={styles(colors).safeView}>
      <View style={styles(colors).container}>
        <TouchableOpacity
          style={styles(colors).headerIcon}
          onPress={() => navigation.goBack()}
          hitSlop={{
            top: 20,
            bottom: 50,
            left: 20,
            right: 50,
          }}
        >
          <FontAwesome name="chevron-left" size={24} color={colors.Primary1} />
        </TouchableOpacity>
        <View style={styles(colors).header}>
          <Text style={styles(colors).headerTitle}>Help & FAQ</Text>
        </View>
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
    safeView: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.Background,
      alignItems: "center",
    },
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.Background,
      paddingTop: 15,
      width: vw,
    },
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
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 20,
      marginTop: 10,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 22,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 0.7 * vw,
    },
    headerIcon: {
      position: "absolute",
      top: 54,
      left: 27,
      zIndex: 2,
    },
    body: {
      width: vw,
      paddingHorizontal: 40,
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
