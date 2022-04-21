import React from "react";
import { useState, useEffect } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import { useTheme } from "../../globals/theme";

export default function About({ navigation }) {
  const { colors, isDark } = useTheme();
  const img = isDark
    ? require("../../assets/logo-dark.png")
    : require("../../assets/logo-light.png");

  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  if (!fontsLoaded) {
    return null;
  } else {
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
              <FontAwesome
                name="chevron-left"
                size={24}
                color={colors.Primary1}
              />
            </TouchableOpacity>
            <View style={styles(colors).body}>
              <Image source={img} style={styles(colors).logo} />
              <Text style={styles(colors).h}>TeachAssist for YRDSB</Text>
              <Text style={styles(colors).p1}>
                Powered by the{" "}
                <Text style={styles(colors).p2}>teachassist foundation</Text>
              </Text>
              <Text style={styles(colors).p3}>(Not affiliated with YRDSB)</Text>
              <Text style={styles(colors).p1}>
                Teacher search powered by the{" "}
                <Text style={styles(colors).p2}>
                  Ontario College of Teachers
                </Text>
              </Text>

              <View style={styles(colors).hRule} />
              <Text style={[styles(colors).p1, { marginBottom: 3 }]}>
                Brought to you by
              </Text>
              <View>
                <Text style={styles(colors).name}>
                  Students at Markville S.S.
                </Text>
              </View>
            </View>
          </View>
      </SafeAreaView>
    );
  }
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const styles = (colors) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.Background,
    },
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.Background,
      paddingTop: 15,
    },
    logo: {
      width: 160,
      height: 160,
      marginTop: 0.1 * vh,
      marginBottom: 15,
    },
    headerIcon: {
      position: "absolute",
      top: 52,
      left: 27,
      zIndex: 2,
    },
    body: {
      width: vw,
      paddingHorizontal: 40,
      alignItems: "center",
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
