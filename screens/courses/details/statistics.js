import React, {useContext} from "react";
import { View, Text, Image, Dimensions } from "react-native";
import {
  calculateAverage,
  calculateCourseAverage,
} from "../../../globals/calculators";
import { DisplayLineChart, DisplayTable } from "../../../components/charts";
import { ThemeContext } from "../../../globals/theme";
import { GENERAL_STYLES } from "../../../globals/styles";

const vw = Dimensions.get("window").width;

export default function StatisticsScreen({ assignments, weight_table }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const img = theme === "dark"
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

  const chart_marks = [course, marks, k_marks, t_marks, c_marks, a_marks];
  const chart_titles = [
    "Course Average",
    "Assignments",
    "Knowledge",
    "Thinking",
    "Communication",
    "Application",
  ];
  return (
    <>
      <DisplayTable weight_table={weight_table} />
      {chart_marks.map((m, i) => {
        return (
          <DisplayLineChart
            marks={m}
            color={colors.Subtitle}
            title={chart_titles[i]}
            key={`${chart_titles[i]}-${String(i)}`}
          />
        );
      })}
    </>
  );
}
