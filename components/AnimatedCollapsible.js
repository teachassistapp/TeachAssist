import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

function AnimatedCollapsible({ header, description, colors }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={expanded ? styles(colors).div : styles(colors).divCollapse}
      onPress={() => setExpanded(!expanded)}
    >
      <Animatable.View duration={1} style={styles(colors).propertyHeader}>
        <Text style={styles(colors).propertyTitle}>{header}</Text>
        {expanded ? (
          <FontAwesome
            name="chevron-up"
            size={20}
            color={colors.Primary1}
            style={{ marginTop: -4 }}
          />
        ) : (
          <FontAwesome
            name="chevron-down"
            size={20}
            color={colors.Primary1}
            style={{ marginTop: -4 }}
          />
        )}
      </Animatable.View>
      <Animatable.View
        duration={expanded ? 300 : 100}
        animation={expanded ? "fadeInDown" : "fadeOutUp"}
        style={styles(colors).expand}
      >
        <Text style={styles(colors).p}>{description}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );
}

export default AnimatedCollapsible;

const vw = Dimensions.get("window").width;
const styles = (colors) =>
  StyleSheet.create({
    div: {
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: "auto",
      paddingTop: 5,
      margin: 5,
      marginBottom: 24,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    divCollapse: {
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: 80,
      paddingTop: 5,
      margin: 5,
      marginBottom: 24,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    propertyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
      height: 70,
    },
    propertyTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
      maxWidth: 0.75 * vw,
    },
    expand: {
      width: "100%",
      paddingTop: 8,
      paddingBottom: 12,
      paddingHorizontal: 17,
      borderTopColor: colors.GraphBackground,
      borderTopWidth: 1,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 14,
      marginTop: 5,
      marginBottom: 5,
    },
  });
