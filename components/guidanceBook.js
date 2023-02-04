import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { ThemeContext } from "../globals/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { encryptRSA } from "./RSA.js";
import { TEST_USER, TEST_PASS } from "../data/keys";
import { GENERAL_STYLES } from "../globals/styles";
import { BackHeader } from "./backHeader";
import { lightColors, darkColors } from "../globals/colors";

function RadioButton({ options, choice, setChoice, box }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  return (
    <View>
      {options.map((d, i) => {
        return (
          <TouchableOpacity
            onPress={() => setChoice(i)}
            key={i}
            style={styles(colors).option}
          >
            <View
              style={[
                styles(colors).optionButton,
                { borderRadius: box ? 3 : 12 },
              ]}
            >
              {box
                ? choice[i] && (
                    <View
                      style={[
                        styles(colors).optionButtonFill,
                        { borderRadius: 1 },
                      ]}
                    />
                  )
                : choice === i && (
                    <View
                      style={[
                        styles(colors).optionButtonFill,
                        { borderRadius: 6 },
                      ]}
                    />
                  )}
            </View>
            <Text style={{ ...GENERAL_STYLES(colors).p, flexWrap: "wrap" }}>
              {d}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function GuidanceBook({ route }) {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  let { link, time, date } = route.params;
  date = new Date(date);
  const [reason, setReason] = useState(null);
  const [checkBox, setCheckBox] = useState([false, false]);

  const handleChoice = (index) => {
    setReason(index);
  };

  const handleCheckBox = (index) => {
    const tempCheckBox = [...checkBox];
    tempCheckBox[index] = !checkBox[index];
    setCheckBox(tempCheckBox);
  };

  const storeAppointment = async (a) => {
    try {
      let stored = await AsyncStorage.getItem("appointments");
      stored = JSON.parse(stored);
      if (stored) {
        if (stored.includes(a)) {
          Alert.alert(
            "You have already booked this appointment.",
            "Please pick a different time."
          );
        } else {
          stored.push(a);
        }
      } else {
        stored = [a];
      }
      await AsyncStorage.setItem("appointments", JSON.stringify(stored));
    } catch (e) {
      Alert.alert("Failed to save appointment.");
    }
  };

  const bookAppointment = async () => {
    const number = await AsyncStorage.getItem("number");
    const password = await AsyncStorage.getItem("password");

    const appointment = {
      time: time,
      date: date,
      reason: reasons[reason],
      parents: checkBox[0],
      isOnline: checkBox[1],
    };

    if (number == TEST_USER && password == TEST_PASS) {
      storeAppointment(appointment);
      navigation.goBack();
      return;
    }

    if (number !== null && password !== null) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const enc_number = encryptRSA(number);
      const enc_pass = encryptRSA(password);

      var url = `https://oct-api.herokuapp.com/make-guidance-appointments?url=${link}&parents=${checkBox[0]}&isOnline=${checkBox[1]}&type=${reasons[reason]}&number=${enc_number}&password=${enc_pass}&rsa=True`;

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch(url, requestOptions)
        .then(() => {
          storeAppointment(appointment);
          navigation.goBack();
        })
        .catch(() => {
          Alert.alert(
            "Failed to book appointment.",
            "Please try again later, or visit the official TeachAssist site to book an appointment."
          );
        });
    }
  };

  const reasons = [
    "Time Table Issues",
    "Transcript/Credit Counselling",
    "Scholarships",
    "Summer School",
    "SHSM",
    "Pathway Opportunities/Post Secondary",
    "Study Strategies",
    "Personal Issue",
    "Other - Not listed above",
  ];

  const checkboxes = [
    "Parent will join meeting",
    "Request online video meeting",
  ];

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <BackHeader
            header="Guidance"
            subtitle="Book Appointments"
            colors={colors}
          />
          <Text
            style={{
              ...GENERAL_STYLES(colors).p,
              fontSize: 14,
              marginTop: 9,
              flexWrap: "wrap",
            }}
          >
            Time:{" "}
            <Text
              style={{
                color: colors.Primary1,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              {time}
            </Text>
          </Text>
          <View
            style={{
              ...styles(colors).div,
              alignItems: "flex-start",
              minHeight: 120,
              paddingHorizontal: 20,
              paddingVertical: 18,
            }}
          >
            <Text
              style={{
                color: colors.Subtitle,
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                textAlign: "center",
                marginVertical: 5,
                alignSelf: "center",
                flexWrap: "wrap",
              }}
            >
              Please select a reason:
            </Text>
            <View style={styles(colors).hRule} />
            <RadioButton
              options={reasons}
              choice={reason}
              setChoice={handleChoice}
              box={false}
            />
            <View style={styles(colors).hRule} />
            <RadioButton
              options={checkboxes}
              choice={checkBox}
              setChoice={handleCheckBox}
              box={true}
            />
          </View>
          <TouchableOpacity
            style={styles(colors).button}
            onPress={() => {
              bookAppointment();
            }}
          >
            <Text style={styles(colors).buttonText}>Book it!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    p1: {
      fontFamily: "Poppins_700Bold",
      color: colors.Primary1,
      fontSize: 13,
    },
    p2: {
      fontFamily: "Poppins_400Regular",
      color: colors.Primary1,
      fontSize: 13,
    },
    option: {
      minHeight: 30,
      maxWidth: "90%",
      marginVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    optionButton: {
      height: 24,
      width: 24,
      borderWidth: 2,
      borderRadius: 12,
      borderColor: colors.Border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    optionButtonFill: {
      height: 12,
      width: 12,
      backgroundColor: colors.Primary1,
    },
    hRule: {
      borderBottomColor: colors.GraphBackground,
      borderBottomWidth: 2,
      marginVertical: 15,
      alignSelf: "center",
      width: 0.9 * vw,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
      marginBottom: 25,
      paddingTop: 12,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.Primary1,
      borderRadius: 20,
      borderWidth: 1,
      shadowColor: colors.Shadow,
      borderColor: colors.Border,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      width: 0.9 * vw,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Background,
      fontSize: 16,
    },
  });
