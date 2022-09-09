import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { GENERAL_STYLES } from "../globals/styles";

function AnimatedCollapsible({ header, description, colors }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={{
        ...GENERAL_STYLES(colors).div,
        margin: 5,
        marginBottom: 10,
      }}
      onPress={() => setExpanded(!expanded)}
    >
      <Animatable.View
        duration={1}
        style={{
          ...styles(colors).propertyHeader,
          marginTop: expanded ? 0 : 20,
          paddingVertical: expanded ? 20 : 0,
        }}
      >
        <Text style={styles(colors).propertyTitle}>{header}</Text>
        <FontAwesome
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.Primary1}
          style={{ marginTop: -4 }}
        />
      </Animatable.View>
      <Animatable.View
        duration={expanded ? 300 : 100}
        animation={expanded ? "fadeInDown" : "fadeOutUp"}
        style={{
          ...GENERAL_STYLES(colors).expand,
          paddingTop: expanded ? 15 : 8,
          paddingBottom: expanded ? 15 : 12,
          height: expanded ? "auto" : 0,
        }}
      >
        {description}
      </Animatable.View>
    </TouchableOpacity>
  );
}

export default AnimatedCollapsible;

const vw = Dimensions.get("window").width;
const styles = (colors) =>
  StyleSheet.create({
    propertyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
    },
    propertyTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
      maxWidth: 0.75 * vw,
    },
  });
