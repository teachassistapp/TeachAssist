import React from "react";
import { View, Text, Dimensions, StyleSheet, StatusBar } from "react-native";
import GuidanceLinks from "./GuidanceLinks";
import { useTheme } from "../globals/theme";

export default function GuidanceTime({ data, date }) {
  const {colors} = useTheme();
  return (
    <View style={styles(colors).div}>
      <Text style={styles(colors).h}>{data.title.trim()}</Text>
      <View style={styles(colors).hRule} />
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
    </View>
  );
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const styles = (colors) => StyleSheet.create({
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
    paddingHorizontal: 25,
    paddingVertical: 25,
    margin: 5,
    shadowColor: colors.Shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  h: {
    fontFamily: "Poppins_400Regular",
    color: colors.Header,
    fontSize: 13,
    textAlign: "center",
    flexDirection: "row",
    width: "100%",
  },
  p: {
    fontFamily: "Poppins_600SemiBold",
    color: colors.Primary1,
    fontSize: 13,
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
  hRule: {
    borderBottomColor: colors.GraphBackground,
    borderBottomWidth: 2,
    marginVertical: 14,
    alignSelf: "center",
    width: "95%",
  },
});
