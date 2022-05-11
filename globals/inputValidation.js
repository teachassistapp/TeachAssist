import React from "react";
import { View, Text } from "react-native";

export function verifyNumber(values) {
  const regex = /^[0-9]*\.?[0-9]*$/;
  return values.every(
    (v) => v === " " || (regex.test(v) && values[i] > 100 && values[i] < 0)
  );
}

export default function SubmitCheck({ check, colors }) {
  if (!check) {
    return (
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins_600SemiBold",
          color: colors.Red,
          alignSelf: "center",
          marginTop: 15,
          marginBottom: -10,
        }}
      >
        Invalid values.
      </Text>
    );
  }
  return <View />;
}

export function verifyTitle(title, assignments) {
  //check for uniqueness of assignment title
  title = title.trim();
  if (title.length === 0) title = "Assignment";
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
