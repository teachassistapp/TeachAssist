import React, {useContext} from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from "../globals/theme";
import { TEST_USER, TEST_PASS } from "../data/keys";
import { GENERAL_STYLES } from "../globals/styles";
import * as Device from "expo-device";

export default function Login({ navigation }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const scheme = useColorScheme();

  const img = theme === "dark"
    ? require("../assets/logo-dark.png")
    : require("../assets/logo-light.png");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [showIcon, setShowIcon] = useState("eye");
  const [searching, setSearching] = useState(false);

  const storeAuthData = async (number, password) => {
    try {
      await AsyncStorage.setItem("number", number);
      await AsyncStorage.setItem("password", password);
    } catch (error) {
      Alert.alert(
        "Failed to store login credentials.",
        "You may be asked to login again next time."
      );
    }
  };

  const initScheme = async () => {
    try {
      const storedScheme = await AsyncStorage.getItem("scheme");
      if (storedScheme === null) {
        if (scheme === "dark") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } else {
        setTheme(storedScheme);
      }
    } catch {}
  };

  useEffect(() => {
    initScheme();
  }, []);

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (searching) return;
    if (number === TEST_USER && password === TEST_PASS) {
      storeAuthData(TEST_USER, TEST_PASS);
      navigation.navigate("Home", { screen: "home" });
      return;
    }
    setSearching(true);
    var requestOptions = {
      headers: {
        "content-type": "application/json",
      },
      body: `{"username":"${number}","password":"${password}"}`,
      method: "POST",
    };

    fetch("https://ta-api.vercel.app/api/getCourses", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          storeAuthData(number, password);
          response.json().then(() => {
            navigation.navigate("Home", { screen: "home" });
          });
        } else {
          Alert.alert("Invalid Login.", "Please try again.");
        }
        setSearching(false);
      })
      .catch(() => {
        Alert.alert(
          "Login failed.",
          "Your network connection may be unstable, or the server may be experiencing interruptions. Please try again later."
        );
        setSearching(false);
      });
  };

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <KeyboardAvoidingView
        behavior={Device.osName === "iOS" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={[GENERAL_STYLES(colors).scrollview]}>
            <View style={styles(colors).container}>
              <Image source={img} style={styles(colors).logo} />
              <View style={styles(colors).div}>
                <View style={styles(colors).texts}>
                  <Text style={styles(colors).heading}>Student Number</Text>
                  <TextInput
                    onChangeText={(text) => setNumber(text)}
                    value={number}
                    style={styles(colors).input}
                    maxLength={20}
                  />
                </View>
              </View>
              <View style={styles(colors).div}>
                <View style={styles(colors).texts}>
                  <Text style={styles(colors).heading}>Password</Text>
                  <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={hidePass}
                    style={[styles(colors).input, { width: "100%" }]}
                    maxLength={20}
                  />
                </View>
                <TouchableOpacity
                  style={styles(colors).show}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHidePass(!hidePass);
                    showIcon === "eye"
                      ? setShowIcon("eye-off")
                      : setShowIcon("eye");
                  }}
                >
                  <Ionicons
                    name={showIcon}
                    size={24}
                    color={colors.Header}
                    style={styles(colors).icon}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles(colors).button}
                onPress={handleSubmit}
              >
                <Text style={styles(colors).buttonText}>Log In</Text>
              </TouchableOpacity>
              {searching && (
                <ActivityIndicator
                  size="large"
                  color={colors.Primary1}
                  style={{ marginVertical: 30 }}
                />
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const vh = Dimensions.get("window").height;

const styles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.Background,
      paddingTop: 0.11 * vh,
    },
    logo: {
      width: 160,
      height: 160,
      marginBottom: 0.1 * vh,
    },
    heading: {
      color: colors.Subtitle,
      marginTop: 10,
      marginBottom: -12,
      fontFamily: "Poppins_400Regular",
      alignSelf: "flex-start",
      fontSize: 10,
    },
    div: {
      width: "90%",
      height: 65,
      padding: 10,
      paddingLeft: 14,
      paddingTop: 0,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: colors.Border,
      borderRadius: 15,
      marginBottom: 17,
      backgroundColor: colors.Container,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    texts: {
      flex: 1,
      flexDirection: "column",
    },
    input: {
      width: "90%",
      height: 56,
      fontSize: 16,
      color: colors.Header,
      fontFamily: "Poppins_400Regular",
      textAlignVertical: "center",
    },
    button: {
      width: "90%",
      height: 56,
      backgroundColor: colors.Primary1,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 35,
    },
    buttonText: {
      color: colors.Background,
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      alignSelf: "center",
    },
    show: {
      marginLeft: "89%",
    },
    icon: {
      paddingBottom: 7,
    },
  });
