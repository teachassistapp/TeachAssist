import React, {useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemeContext } from "../globals/theme";
import { lightColors, darkColors } from "../globals/colors";

export default function GuidanceLinks({ link, time, date }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  const navigateToBookScreen = () => {
    navigation.navigate("Book", {
      link: link,
      time: time,
      date: date.toISOString(),
    });
  };
  return (
    <View
    style={{
      width: "30%",
    }}
    >
      <TouchableOpacity onPress={() => navigateToBookScreen()}>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            color: colors.Subtitle,
            fontSize: 13,
            marginRight: 10,
          }}
        >
          {time}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
