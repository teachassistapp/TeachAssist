import React, {useContext} from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemeContext } from "../../globals/theme";
import { GENERAL_STYLES } from "../../globals/styles";

export default function About({ navigation }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const img = theme === "dark"
    ? require("../../assets/logo-dark.png")
    : require("../../assets/logo-light.png");
  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <View style={GENERAL_STYLES(colors).container}>
        <TouchableOpacity
          style={GENERAL_STYLES(colors).headerIcon}
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
        <View style={{ ...GENERAL_STYLES(colors).body, alignItems: "center" }}>
          <Image source={img} style={styles(colors).logo} />
          <Text style={styles(colors).h}>TeachAssist for YRDSB</Text>
          <Text style={styles(colors).p1}>
            Powered by the{" "}
            <Text style={styles(colors).p2}>teachassist foundation</Text>
          </Text>
          <Text style={styles(colors).p3}>(Not affiliated with YRDSB)</Text>
          <Text style={styles(colors).p1}>
            Teacher search powered by the{" "}
            <Text style={styles(colors).p2}>Ontario College of Teachers</Text>
          </Text>

          <View style={styles(colors).hRule} />
          <Text style={[styles(colors).p1, { marginBottom: 3 }]}>
            Brought to you by
          </Text>
          <View>
            <Text style={styles(colors).name}>Students at Markville S.S.</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const styles = (colors) =>
  StyleSheet.create({
    logo: {
      width: 160,
      height: 160,
      marginTop: 0.1 * vh,
      marginBottom: 15,
    },
    h: {
      fontFamily: "Poppins_700Bold",
      fontSize: 18,
      color: colors.Primary1,
      textAlign: "center",
      marginBottom: 35,
    },
    p1: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
      marginVertical: 8,
    },
    p2: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Primary1,
      textAlign: "center",
      fontSize: 15,
    },
    p3: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 10,
      marginTop: -5,
      marginBottom: 15,
    },
    name: {
      textAlign: "center",
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
      marginVertical: 3,
    },
    hRule: {
      borderBottomColor: colors.Placeholder,
      borderBottomWidth: 1,
      width: 0.85 * vw,
      marginVertical: 15,
    },
  });
