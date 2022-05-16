import React from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../globals/theme";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { GENERAL_STYLES } from "../../globals/styles";

export default function SettingsHome() {
  const navigation = useNavigation();
  const { setScheme, isDark, colors } = useTheme();

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem("scheme", isDark ? "dark" : "light");
      navigation.navigate("Login");
    } catch {
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

  const labels = ["About", "Support & Feedback", "Help & FAQ"];
  const navs = ["About", "Feedback", "HelpHome"];
  const icons = ["info", "message", "help"];

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <View style={GENERAL_STYLES(colors).container}>
        <View style={{ ...GENERAL_STYLES(colors).header, marginBottom: 32 }}>
          <Text style={GENERAL_STYLES(colors).headerTitle}>Settings</Text>
        </View>
        <View style={styles(colors).settingBox}>
          <Ionicons
            name="ios-moon"
            size={18}
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
        {labels.map((label, i) => {
          return (
            <TouchableOpacity
              style={styles(colors).settingBox}
              onPress={() => navigation.navigate(navs[i])}
              key={String(i)}
            >
              <MaterialIcons
                style={styles(colors).iconTitle}
                name={icons[i]}
                size={20}
                color={colors.Header}
              />
              <Text style={styles(colors).body1}>{label}</Text>
              <View style={styles(colors).arrow}>
                <FontAwesome
                  name="chevron-right"
                  size={18}
                  color={colors.Primary1}
                />
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={styles(colors).logOut}>
          <TouchableOpacity
            style={styles(colors).button}
            onPress={() => {
              logOut();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.Primary1}
            />
            <Text style={styles(colors).buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <ExpoStatusBar style={isDark ? "light" : "dark"} />
      </View>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
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
      paddingTop: 2,
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
      paddingHorizontal: 17,
      paddingVertical: 8,
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
