import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useTheme } from "../globals/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookedAppointments({
  appointments,
  updateAppointments,
}) {
  const { colors } = useTheme();
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const days = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];

  const storeAppointments = async (a) => {
    try {
      await AsyncStorage.setItem("appointments", JSON.stringify(a));
    } catch (e) {
      Alert.alert("Failed to save appointment.");
    }
  };

  const onCancel = (i) => {
    let tempApps = [...appointments];
    tempApps.splice(i, 1);
    updateAppointments(tempApps);
    storeAppointments(tempApps);
    Alert.alert(
      "Note:",
      "Hiding an appointment does not cancel it. Please make sure to let your guidance counsellor know."
    );
  };

  return (
    <View>
      {appointments.map((a, i) => {
        const date = new Date(a.date);
        return (
          <View key={i} style={styles(colors).div}>
            <View style={styles(colors).content}>
              <Text style={styles(colors).h}>
                {`${days[date.getDay()]} ${
                  months[date.getMonth()]
                } ${date.getDate()}, ${date.getFullYear()}`}
              </Text>
              <Text style={styles(colors).h}>{a.time}</Text>
              <Text style={styles(colors).p1}>{a.reason}</Text>
              <View style={{ flexDirection: "row" }}>
                {a.isOnline && (
                  <View style={styles(colors).box}>
                    <Text style={styles(colors).p2}>Online</Text>
                  </View>
                )}
                {a.parents && (
                  <View style={styles(colors).box}>
                    <Text style={styles(colors).p2}>Parents</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onCancel(i)}
              style={styles(colors).cancel}
            >
              <Text style={styles(colors).cancelText}>Hide</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    div: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: "auto",
      paddingHorizontal: 20,
      paddingVertical: 20,
      margin: 5,
    },
    h: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Header,
      fontSize: 16,
    },
    p1: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
      flexWrap: "wrap",
      marginVertical: 5,
    },
    p2: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 11,
      flexWrap: "wrap",
    },
    content: {
      justifyContent: "center",
      alignItems: "flex-start",
    },
    cancel: {
      justifyContent: "center",
      alignItems: "center",
    },
    cancelText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 14,
      color: colors.Primary1,
    },
    box: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.Subtitle,
      paddingVertical: 3,
      paddingHorizontal: 7,
      marginRight: 10,
    },
  });
