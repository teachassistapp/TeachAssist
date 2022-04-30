import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import {
  calculateAverage,
  calculateCourseAverage,
} from "../../../globals/calculators";
import { DisplayLineChart, DisplayTable } from "../../../components/charts";
import { useTheme } from "../../../globals/theme";
import { GENERAL_STYLES } from "../../../globals/styles";

const vw = Dimensions.get("window").width;

export default function StatisticsScreen({ assignments, weight_table }) {
  const { colors, isDark } = useTheme();
  const img = isDark
    ? require("../../../assets/empty_graphic2.png")
    : require("../../../assets/empty_graphic1.png");
  if (assignments.length === 0 || weight_table === null) {
    return (
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Image
          source={img}
          style={{
            width: 0.55 * vw,
            height: 0.536 * vw,
            marginTop: 60,
            marginBottom: 40,
          }}
        />
        <Text style={GENERAL_STYLES(colors).p}>Sorry, no data found.</Text>
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
