import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../globals/theme";

export default function GuidanceLinks({ link, time, date }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const navigateToBookScreen = () => {
    navigation.navigate("Book", {
      link: link,
      time: time,
      date: date.toISOString(),
    });
  };
  return (
    <View>
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
