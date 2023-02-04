import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GuidanceLinks from "./guidanceLinks";
import { useTheme } from "../globals/theme";
import * as Animatable from "react-native-animatable";
import { GENERAL_STYLES } from "../globals/styles";

export default function GuidanceTime({ data, date }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={
        expanded
          ? {
              ...GENERAL_STYLES(colors).div,
              paddingTop: 5,
              margin: 5,
              marginBottom: 24,
            }
          : {
              ...GENERAL_STYLES(colors).div,
              marginBottom: 25,
              justifyContent: "center",
            }
      }
      onPress={() => setExpanded(!expanded)}
    >
      <View style={{ marginVertical: 20 }}>
        <Text style={styles(colors).h}>{data.title.trim()}</Text>
      </View>
      <Animatable.View
        duration={expanded ? 300 : 100}
        animation={expanded ? "fadeInDown" : "fadeOutUp"}
        style={[
          GENERAL_STYLES(colors).expand,
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
