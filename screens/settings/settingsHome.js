import React from "react";
import { useState, useEffect } from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  StatusBar,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function SettingsHome() {
  const navigation = useNavigation();
  const { setScheme, isDark, colors } = useTheme();

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem("scheme", isDark ? "dark" : "light");
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert("Failed to logout.");
    }
  };

  const toggleScheme = () => {
    const newScheme = isDark ? "light" : "dark";
    setScheme(newScheme);
    storeScheme(newScheme);
  };

  const storeScheme = async (newScheme) => {
    try {
      await AsyncStorage.setItem("scheme", newScheme);
    } catch {
      Alert.alert("Failed to save scheme.");
    }
  };

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
      <SafeAreaView style={[styles(colors).safeView]}>
        <View style={styles(colors).container}>
          <View style={styles(colors).header}>
            <Text style={styles(colors).headerTitle}>Settings</Text>
          </View>
          <View style={styles(colors).settingBox}>
            <Ionicons
              name="ios-moon"
              size={20}
              color={colors.Header}
              style={{ marginRight: 5 }}
            />
            <Text style={styles(colors).body1}>Dark Mode</Text>
            <View style={styles(colors).switchPos}>
              <Switch
                trackColor={{ false: colors.Subtitle, true: colors.Primary1 }}
                thumbColor={"#fff"}
                activeThumbColor={"white"}
                onValueChange={toggleScheme}
                value={isDark}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles(colors).settingBox}
            onPress={() => navigation.navigate("About")}
          >
            <Ionicons
              style={styles(colors).iconTitle}
              name="information-circle"
              size={22}
              color={colors.Header}
            />
            <Text style={styles(colors).body1}>About</Text>
            <View style={styles(colors).arrow}>
              <FontAwesome
                name="chevron-right"
                size={18}
                color={colors.Primary1}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(colors).settingBox}
            onPress={() => navigation.navigate("Feedback")}
          >
            <MaterialIcons
              style={styles(colors).iconTitle}
              name="message"
              size={20}
              color={colors.Header}
            />
            <Text style={styles(colors).body1}>Support & Feedback</Text>
            <View style={styles(colors).arrow}>
              <FontAwesome
                name="chevron-right"
                size={18}
                color={colors.Primary1}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(colors).settingBox}
            onPress={() => navigation.navigate("HelpHome")}
          >
            <Ionicons
              style={styles(colors).iconTitle}
              name="help-circle"
              size={22}
              color={colors.Header}
            />
            <Text style={styles(colors).body1}>Help & FAQ</Text>
            <View style={styles(colors).arrow}>
              <FontAwesome
                name="chevron-right"
                size={18}
                color={colors.Primary1}
              />
            </View>
          </TouchableOpacity>
          <View style={styles(colors).logOut}>
            <TouchableOpacity
              style={styles(colors).button}
              onPress={() => logOut()}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.Primary1}
              />
              <Text
                style={[styles(colors).buttonText, { color: colors.Primary1 }]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
          <ExpoStatusBar style={isDark ? "light" : "dark"} />
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
    settingBox: {
      width: 0.82 * vw,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 20,
      marginTop: 8,
      marginBottom: 2,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 39,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 32,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 0.75 * vw,
      textAlign: "center",
    },
    body1: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      width: "85%",
      textAlign: "left",
      paddingLeft: 8,
      paddingTop: 1,
      color: colors.Header,
    },
    switchPos: {
      left: -10,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
      paddingLeft: 8,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      height: "auto",
      width: "auto",
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 8,
      paddingBottom: 8,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    logOut: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "85%",
    },
  });
