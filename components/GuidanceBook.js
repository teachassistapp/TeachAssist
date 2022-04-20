import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useTheme } from "../globals/theme";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { encryptRSA } from "./RSA.js";

function RadioButton({ options, choice, setChoice, box }) {
  const { colors } = useTheme();
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
            <Text style={styles(colors).p}>{d}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function GuidanceBook({ route }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  let { link, time, date } = route.params;
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

    if (number == "dXNlcnRlc3Q" && password == "dGVzdGFjY291bnQ") {
      storeAppointment(appointment);
      navigation.goBack();
      return;
    }

    if (number !== null && password !== null) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const enc_number = encryptRSA(number);
      const enc_pass = encryptRSA(pass);

      var url = `https://oct-api.herokuapp.com/make-guidance-appointments?url=${link}&parents=${checkBox[0]}&isOnline=${checkBox[1]}&type=${reasons[reason]}&number=${enc_number}&password=${enc_pass}`;

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch(url, requestOptions)
        .then(() => {
          storeAppointment(appointment);
          navigation.goBack();
        })
        .catch((error) => {
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
    "Check this box if your parent will be a part of this meeting",
    "Request Online Video meeting",
  ];

  return (
    <SafeAreaView style={styles(colors).safeView}>
      <ScrollView style={styles(colors).scrollView}>
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
          <View style={styles(colors).header}>
            <Text style={styles(colors).headerTitle}>Guidance</Text>
            <Text style={styles(colors).headerSubtitle}>Book Appointments</Text>
          </View>
          <Text
            style={[
              styles(colors).p,
              { fontSize: 14, marginTop: 9, marginBottom: 5 },
            ]}
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
          <View style={styles(colors).div}>
            <Text
              style={[
                styles(colors).p,
                {
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  textAlign: "center",
                  marginTop: 7,
                  marginBottom: 10,
                  alignSelf: "center",
                },
              ]}
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
    safeView: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.Background,
    },
    scrollView: {
      width: "100%",
      backgroundColor: colors.Background,
    },
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.Background,
      paddingTop: 15,
    },
    div: {
      alignItems: "flex-start",
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: "auto",
      minHeight: 120,
      paddingHorizontal: 20,
      paddingVertical: 18,
      marginVertical: 10,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
      flexWrap: "wrap",
    },
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
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 28,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 20,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 75 * vw,
      textAlign: "center",
    },
    headerSubtitle: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    headerIcon: {
      position: "absolute",
      top: 54,
      left: 27,
      zIndex: 2,
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
      marginVertical: 10,
      alignSelf: "center",
      width: "95%",
      maxWidth: 0.9 * vw,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
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
