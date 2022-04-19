import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { useTheme } from "../../../globals/theme";

export default function AboutScreen({
  code,
  block,
  room,
  name,
  start_time,
  end_time,
}) {
  const { colors } = useTheme();

  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_400Regular,
  });

  const displayDate = (date) => {
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

    date = date.split("-");

    return `${months[parseInt(date[1]) - 1]} ${date[2]}, ${date[0]}`;
  };
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles(colors).about}>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
            Course Code:
          </Text>{" "}
          {code}
        </Text>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
            Course Name:
          </Text>{" "}
          {name}
        </Text>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Room:</Text>{" "}
          {room}
        </Text>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Period:</Text>{" "}
          {block}
        </Text>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Start Time:</Text>{" "}
          {displayDate(start_time)}
        </Text>
        <Text style={styles(colors).aboutText}>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>End Time:</Text>{" "}
          {displayDate(end_time)}
        </Text>
      </View>
    );
  }
}
const styles = (colors) =>
  StyleSheet.create({
    about: {
      alignItems: "flex-start",
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: "90%",
      height: "auto",
      padding: 17,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.153,
      shadowRadius: 10,
      elevation: 6,
      marginTop: 30,
    },
    aboutText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 13,
      color: colors.Subtitle,
      lineHeight: 25,
    },
  });
