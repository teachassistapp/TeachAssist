import React, {useContext} from "react";
import { View, Text } from "react-native";
import { GENERAL_STYLES } from "../../../globals/styles";
import { ThemeContext } from "../../../globals/theme";
import { lightColors, darkColors } from "../../../globals/colors";

export default function AboutScreen({
  code,
  name,
  room,
  block,
  start_time,
  end_time,
}) {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;

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
  const titles = [
    "Course Code:",
    "Course Name:",
    "Room:",
    "Period:",
    "Start Time:",
    "End Time:",
  ];
  const properties = [
    code,
    name,
    room,
    block,
    displayDate(start_time),
    displayDate(end_time),
  ];
  return (
    <View
      style={{
        ...GENERAL_STYLES(colors).div,
        alignItems: "flex-start",
        padding: 17,
        marginTop: 11,
      }}
    >
      {properties.map((p, i) => {
        return (
          <Text
            style={{ ...GENERAL_STYLES(colors).p, lineHeight: 25 }}
            key={String(i)}
          >
            <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
              {titles[i]}
            </Text>{" "}
            {p}
          </Text>
        );
      })}
    </View>
  );
}
