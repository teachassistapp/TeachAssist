import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function verifyNumber(values) {
  const regex = /^[0-9]*\.?[0-9]*$/; //decimal numbers
  for (let i = 0; i < values.length; i++) {
    if (regex.test(String(values[i])) === false) {
      return false;
    }
  }
  return true;
}

export default function SubmitCheck({ check, colors }) {
  if (!check) {
    return <Text style={styles(colors).checkText}>Invalid values.</Text>;
  }
  return <View></View>;
}

export function verifyTitle(title, assignments) {
  //check for uniqueness of assignment title
  let titles = [];
  for (let i = 0; i < assignments.length; i++) {
    titles.push(assignments[i].title);
  }

  let i = 1;
  if (titles.includes(title)) {
    while (titles.includes(`${title} (${i})`)) {
      i += 1;
    }
    return `${title} (${i})`;
  }
  return title;
}

const styles = (colors) =>
  StyleSheet.create({
    checkText: {
      fontSize: 14,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Red,
      alignSelf: "center",
      marginTop: 15,
      marginBottom: -15,
    },
  });
