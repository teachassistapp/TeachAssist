import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import {
  calculateAverage,
  calculateCourseAverage,
} from "../../../globals/calculators";
import { DisplayLineChart, DisplayTable } from "../../../components/charts";
import { useTheme } from "../../../globals/theme";

export default function StatisticsScreen({ assignments, weight_table }) {
  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const { colors, isDark } = useTheme();
  const img = isDark ? require('../../../assets/empty_graphic2.png') : require('../../../assets/empty_graphic1.png');
  if (assignments.length === 0 || weight_table === null) {
    return (
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Image
          source= {img}
          style={styles(colors).graphic}
        />
        <Text style={styles(colors).p}>Sorry, no data found.</Text>
      </View>
    );
  }

  let [course, marks, k_marks, t_marks, c_marks, a_marks] = [
    [],
    [],
    [],
    [],
    [],
    [],
  ];
  for (let i = 0; i < assignments.length; i++) {
    marks.push(
      calculateAverage(
        [
          assignments[i].k,
          assignments[i].t,
          assignments[i].c,
          assignments[i].a,
          assignments[i].f,
          assignments[i].o,
        ],
        [
          assignments[i].kWeight,
          assignments[i].tWeight,
          assignments[i].cWeight,
          assignments[i].aWeight,
          assignments[i].fWeight,
          assignments[i].oWeight,
        ],
        weight_table
      )
    );
    course.push(calculateCourseAverage(assignments.slice(0, i + 1)));
    k_marks.push(assignments[i].k);
    t_marks.push(assignments[i].t);
    c_marks.push(assignments[i].c);
    a_marks.push(assignments[i].a);
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View>
        <DisplayTable weight_table={weight_table} />
        <DisplayLineChart
          marks={course}
          color={colors.Subtitle}
          title={"Course Average"}
        />
        <DisplayLineChart
          marks={marks}
          color={colors.Subtitle}
          title={"Assignments"}
        />
        <DisplayLineChart
          marks={k_marks}
          color={colors.Subtitle}
          title={"Knowledge"}
        />
        <DisplayLineChart
          marks={t_marks}
          color={colors.Subtitle}
          title={"Thinking"}
        />
        <DisplayLineChart
          marks={c_marks}
          color={colors.Subtitle}
          title={"Communication"}
        />
        <DisplayLineChart
          marks={a_marks}
          color={colors.Subtitle}
          title={"Application"}
        />
      </View>
    );
  }
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
      paddingVertical: 15,
      margin: 5,
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
    graphic: {
      width: 0.55 * vw,
      height: 0.536 * vw,
      marginTop: 60,
      marginBottom: 40,
    },
  });
