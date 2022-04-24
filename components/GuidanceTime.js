import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GuidanceLinks from "./GuidanceLinks";
import { useTheme } from "../globals/theme";
import * as Animatable from "react-native-animatable";

export default function GuidanceTime({ data, date }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={expanded ? styles(colors).div : styles(colors).divCollapse}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={{ marginVertical: 20 }}>
        <Text style={styles(colors).h}>{data.title.trim()}</Text>
      </View>
      <Animatable.View
        duration={expanded ? 300 : 100}
        animation={expanded ? "fadeInDown" : "fadeOutUp"}
        style={[
          styles(colors).expand,
          { height: expanded ? "auto" : 0, paddingVertical: expanded ? 20 : 0 },
        ]}
      >
        {data.links.length != 0 ? (
          <Text style={styles(colors).p}>Available Times:</Text>
        ) : (
          <Text style={styles(colors).p}>No times available.</Text>
        )}
        <View style={styles(colors).times}>
          {data.links.map((link, index) => {
            return (
              <GuidanceLinks
                link={link.href}
                time={link.text}
                date={date}
                key={index}
              />
            );
          })}
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );
}

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
      justifyContent: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: "auto",
      marginBottom: 25,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    expand: {
      width: "100%",
      paddingHorizontal: 17,
      borderTopColor: colors.GraphBackground,
      borderTopWidth: 1,
    },
    h: {
      fontFamily: "Poppins_400Regular",
      color: colors.Header,
      fontSize: 12,
      margin: 0,
      textAlign: "center",
      flexDirection: "row",
      maxWidth: 0.8 * vw,
    },
    p: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Primary1,
      fontSize: 12,
      textAlign: "center",
      flexDirection: "row",
      width: "100%",
      marginBottom: 5,
    },
    times: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
