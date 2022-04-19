import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../globals/theme";

export function DisplayTable({ weight_table }) {
  const { colors } = useTheme();
  function DisplayRow({ name, mark, weight }) {
    return (
      <View style={styles(colors).row}>
        <Text style={[styles(colors).tableText, { flex: 6 }]}>{name}</Text>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={[styles(colors).tableText, { color: colors.Primary1 }]}>
            {mark}%
          </Text>
        </View>
        <View style={{ flex: 3, alignItems: "center" }}>
          <Text style={styles(colors).tableText}>{weight}%</Text>
        </View>
      </View>
    );
  }

  const names = [
    "Knowledge",
    "Thinking",
    "Communication",
    "Application",
    "Final",
    "Other",
  ];
  const keys = ["KU", "T", "C", "A", "F", "O"];
  let rows = [];
  for (let i = 0; i < 6; i++) {
    rows.push(
      <DisplayRow
        key={names[i]}
        name={names[i]}
        mark={Math.round(weight_table[keys[i]].SA * 10) / 10}
        weight={Math.round(weight_table[keys[i]].CW * 10) / 10}
      />
    );
  }
  return (
    <View style={styles(colors).div}>
      <Text style={styles(colors).chartTitle}>Course Weighting</Text>
      <View style={styles(colors).row}>
        <Text style={[styles(colors).tableHeader, { flex: 6 }]}>Category</Text>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={styles(colors).tableHeader}>Mark</Text>
        </View>
        <View style={{ flex: 3, alignItems: "center" }}>
          <Text style={styles(colors).tableHeader}>Weight</Text>
        </View>
      </View>
      {rows}
    </View>
  );
}

export function DisplayLineChart({ marks, color, title }) {
  const { colors } = useTheme();
  marks = marks.filter((el) => {
    return !isNaN(el) && typeof el === "number"; //filters out NaN and whitespace strings
  });

  const chart_data = [
    {
      data: marks,
      color: () => colors.Primary1,
      strokeWidth: 3,
    },
    {
      data: [100.01],
    },
  ];
  const screenWidth = Dimensions.get("window").width;
  return (
    <View style={styles(colors).div}>
      <Text style={styles(colors).chartTitle}>{title}</Text>
      <LineChart
        data={{
          datasets: chart_data,
        }}
        width={screenWidth * 0.86}
        height={220}
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: colors.Container,
          backgroundGradientTo: colors.Container,
          backgroundColor: colors.Container,
          fillShadowGradient: colors.Primary1,
          fillShadowGradientOpacity: 0.2,
          decimalPlaces: 0,
          color: () => colors.Primary1,
          color: () => color,
          labelColor: () => color,

          propsForDots: {
            r: "3",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: colors.GraphBackground,
          },
        }}
        getDotProps={(dataPoint) => {
          return {
            r: "3",
            strokeWidth: "1",
            stroke:
              marks.indexOf(dataPoint) == -1
                ? `rgba(0, 0, 0, 0)` // make it transparent
                : colors.Primary1,
            fill:
              marks.indexOf(dataPoint) == -1
                ? `rgba(0, 0, 0, 0)` // make it transparent
                : colors.Primary1,
          };
        }}
        bezier
        withVerticalLines={false}
        fromZero={true}
        style={styles(colors).lineChart}
      />
    </View>
  );
}

export function DisplayProgress({ value }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginVertical: 25 }}>
      <AnimatedCircularProgress
        size={178}
        width={14.5}
        fill={value === "N/A" ? 0 : value}
        tintColorSecondary={colors.Primary1}
        tintColor={colors.Primary2}
        backgroundColor={colors.GraphBackground}
        rotation={0}
        duration={800}
      >
        {(fill) => (
          <Text style={styles(colors).progressMark}>
            {value === "N/A"
              ? "N/A"
              : String(Math.round(value * 10) / 10) + "%"}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
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
      paddingHorizontal: 25,
      paddingTop: 15,
      paddingBottom: 20,
      marginHorizontal: 5,
      marginVertical: 10,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.153,
      shadowRadius: 20,
      elevation: 8,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      fontSize: 13,
      color: colors.Subtitle,
    },
    lineChart: {
      fontFamily: "Poppins_400Regular",
      fontSize: 13,
    },
    chartTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Header,
      maxWidth: 0.8 * vw,
      marginBottom: 10,
      marginTop: 5,
    },
    row: {
      flexDirection: "row",
      width: "100%",
      height: 36,
    },
    tableHeader: {
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
      color: colors.Header,
      marginTop: 10,
      height: 40,
    },
    tableText: {
      marginTop: 11,
      fontFamily: "Poppins_400Regular",
      fontSize: 12,
      color: colors.Subtitle,
    },
    progressMark: {
      fontFamily: "Poppins_700Bold",
      fontSize: 28,
      color: colors.Header,
    },
  });