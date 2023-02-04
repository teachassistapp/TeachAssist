import React, {useContext} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  calculateCourseAverage,
  calculateAverage,
} from "../globals/calculators";
import { ThemeContext } from "../globals/theme";
import { GENERAL_STYLES } from "../globals/styles";
import { lightColors, darkColors } from "../globals/colors";

const months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const getCurrentDate = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth();
  var year = new Date().getFullYear();
  return `${months[month]} ${date}, ${year}`;
};

const displayDate = (date) => {
  date = date.split("-");
  return `${months[parseInt(date[1]) - 1]} ${date[2]}, ${date[0]}`;
};

export function parseAssignments(data, weight_table) {
  let content = [];
  for (let i = 0; i < data.length; i++) {
    content.push({
      title: data[i].name,
      comments: data[i].comments,
      k:
        !data[i].KU || !data[i].KU[0].finished
          ? " "
          : (data[i].KU[0].get * 100) / data[i].KU[0].total,
      kWeight:
        !data[i].KU || !data[i].KU[0].finished ? 0 : data[i].KU[0].weight,
      t:
        !data[i].T || !data[i].T[0].finished
          ? " "
          : (data[i].T[0].get * 100) / data[i].T[0].total,
      tWeight: !data[i].T || !data[i].T[0].finished ? 0 : data[i].T[0].weight,
      c:
        !data[i].C || !data[i].C[0].finished
          ? " "
          : (data[i].C[0].get * 100) / data[i].C[0].total,
      cWeight: !data[i].C || !data[i].C[0].finished ? 0 : data[i].C[0].weight,
      a:
        !data[i].A || !data[i].A[0].finished
          ? " "
          : (data[i].A[0].get * 100) / data[i].A[0].total,
      aWeight: !data[i].A || !data[i].A[0].finished ? 0 : data[i].A[0].weight,
      o:
        !data[i].O || !data[i].O[0].finished
          ? " "
          : (data[i].O[0].get * 100) / data[i].O[0].total,
      oWeight: !data[i].O || !data[i].O[0].finished ? 0 : data[i].O[0].weight,
      f:
        !data[i].F || !data[i].F[0].finished
          ? " "
          : (data[i].F[0].get * 100) / data[i].F[0].total,
      fWeight: !data[i].F || !data[i].F[0].finished ? 0 : data[i].F[0].weight,
      finished: !(
        (data[i].KU && !data[i].KU[0].finished) ||
        (data[i].T && !data[i].T[0].finished) ||
        (data[i].C && !data[i].C[0].finished) ||
        (data[i].A && !data[i].A[0].finished) ||
        (data[i].F && !data[i].F[0].finished) ||
        (data[i].O && !data[i].O[0].finished)
      ),
      weight_table: weight_table,
    });
  }
  return content;
}

const getAverages = (newAssignment, oldAssignment, newData, oldData) => {
  const marks = [];
  const oldMarks = [];
  const categories = ["KU", "T", "C", "A", "F", "O"];
  for (let j = 0; j < 6; j++) {
    let get = undefined;
    let total = undefined;
    let mark = undefined;
    if (newAssignment[categories[j]] !== undefined) {
      get = newAssignment[categories[j]][0].get * 100;
      total = newAssignment[categories[j]][0].total;
      mark = get / total;
    }
    marks.push(mark);
    get = undefined;
    total = undefined;
    mark = undefined;
    if (
      oldAssignment !== undefined &&
      oldAssignment[categories[j]] !== undefined
    ) {
      get = oldAssignment[categories[j]][0].get * 100;
      total = oldAssignment[categories[j]][0].total;
      mark = get / total;
    }
    oldMarks.push(mark);
  }

  const newAssignmentWeights = [];
  const oldAssignmentWeights = oldAssignment ? [] : Array(6).fill(null);
  for (let j = 0; j < 6; j++) {
    newAssignmentWeights.push(
      newAssignment[categories[j]]
        ? newAssignment[categories[j]][0].weight
        : null
    );
    if (oldAssignment) {
      oldAssignmentWeights.push(
        oldAssignment[categories[j]]
          ? oldAssignment[categories[j]][0].weight
          : null
      );
    }
  }

  const newAverage = calculateCourseAverage(
    parseAssignments(newData.assignments, newData.weight_table)
  );
  var oldAverage;
  if (oldData.overall_mark === null) {
    oldAverage = "N/A";
  } else {
    oldAverage = String(Math.round(oldData.overall_mark * 10) / 10) + "%";
  }
  let assignmentMark = calculateAverage(
    marks,
    newAssignmentWeights,
    newData.weight_table
  );
  let oldAssignmentMark = calculateAverage(
    oldMarks,
    oldAssignmentWeights,
    oldData.weight_table
  );

  return { newAverage, oldAverage, assignmentMark, oldAssignmentMark };
};

export default function DisplayMarkUpdates({ oldData, newData }) {
  const navigation = useNavigation();
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  let display = [];
  if (!oldData || !newData) {
    let data = newData ? { ...newData } : { ...oldData };
    display = (
      <View
        style={[GENERAL_STYLES(colors).div, styles(colors).div]}
        key={data.name}
      >
        <View
          style={[
            styles(colors).notifHeader,
            { marginBottom: 0, paddingBottom: 0 },
          ]}
        >
          <Text style={styles(colors).notifHeaderTitle}>
            {oldData ? "Course Removed" : "Course Added"}
          </Text>
        </View>
        <View
          style={[
            styles(colors).notifSubtitle,
            {
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles(colors).courseTitle}>{data.name}</Text>
          <Text
            style={[
              GENERAL_STYLES(colors).p,
              styles(colors).p,
              { fontFamily: "Poppins_500Medium_Italic", marginTop: 3 },
            ]}
          >
            {data.code}
          </Text>
        </View>
        <View
          style={[
            styles(colors).notifSubtitle,
            { marginBottom: oldData ? 0 : 20 },
          ]}
        >
          <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
            Room {data.room}
          </Text>
          <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
            {displayDate(data.start_time)} - {displayDate(data.end_time)}
          </Text>
        </View>
        {oldData && (
          <View style={styles(colors).notifBody}>
            <Text style={styles(colors).finalMark}>
              Final: {Math.round(data.overall_mark)}%
            </Text>
          </View>
        )}
      </View>
    );
  } else {
    if (!oldData.cached && newData.cached) {
      display.push(
        <View
          style={[
            GENERAL_STYLES(colors).div,
            styles(colors).div,
            { paddingBottom: 22 },
          ]}
          key={newData.name}
        >
          <View
            style={[
              styles(colors).notifHeader,
              { marginBottom: 0, paddingBottom: 0 },
            ]}
          >
            <Text style={styles(colors).notifHeaderTitle}>Course Cached</Text>
          </View>
          <View
            style={[
              styles(colors).notifSubtitle,
              {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={styles(colors).courseTitle}>{newData.name}</Text>
            <Text
              style={[
                [GENERAL_STYLES(colors).p, styles(colors).p],
                { fontFamily: "Poppins_500Medium_Italic", marginTop: 3 },
              ]}
            >
              {newData.code}
            </Text>
          </View>
          <View
            style={[
              styles(colors).notifSubtitle,
              { marginBottom: oldData ? 0 : 20 },
            ]}
          >
            <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
              Room {newData.room}
            </Text>
            <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
              {displayDate(newData.start_time)}
              {" - "}
              {displayDate(newData.end_time)}
            </Text>
          </View>
        </View>
      );
    } else {
      let oldTitles = [];
      let newTitles = [];
      for (let i = 0; i < oldData.assignments.length; i++) {
        oldTitles.push(oldData.assignments[i].name);
      }
      for (let i = 0; i < newData.assignments.length; i++) {
        newTitles.push(newData.assignments[i].name);
      }

      const date = getCurrentDate();
      if (
        oldData.cached &&
        !newData.cached &&
        JSON.stringify(oldData.assignments) ==
          JSON.stringify(newData.assignments)
      ) {
        display.push(
          <View
            style={[GENERAL_STYLES(colors).div, styles(colors).div]}
            key={newData.name}
          >
            <View
              style={[
                styles(colors).notifHeader,
                { marginBottom: 0, paddingBottom: 0 },
              ]}
            >
              <Text style={styles(colors).notifHeaderTitle}>
                Course Uncached
              </Text>
            </View>
            <View
              style={[
                styles(colors).notifSubtitle,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={styles(colors).courseTitle}>{newData.name}</Text>
              <Text
                style={[
                  [GENERAL_STYLES(colors).p, styles(colors).p],
                  { fontFamily: "Poppins_500Medium_Italic", marginTop: 3 },
                ]}
              >
                {newData.code}
              </Text>
            </View>
            <View style={[styles(colors).notifSubtitle, { marginBottom: 20 }]}>
              <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                Room {newData.room}
              </Text>
              <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                {displayDate(newData.start_time)}
                {" - "}
                {displayDate(newData.end_time)}
              </Text>
            </View>
          </View>
        );
      } else if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
        const courseName =
          newData.name === null ? "Unnamed Course" : newData.name;
        const courseCode =
          newData.code === null ? "(Unknown Code)" : `(${newData.code})`;
        for (let i = 0; i < newData.assignments.length; i++) {
          const newAssignment = newData.assignments[i];
          const oldAssignment = oldData.assignments.find(
            (a) => a.name === newTitles[i]
          );
          if (
            (oldTitles.includes(newTitles[i]) &&
              JSON.stringify(newAssignment) !==
                JSON.stringify(oldAssignment)) ||
            !oldTitles.includes(newTitles[i])
          ) {
            const {
              newAverage,
              oldAverage,
              assignmentMark,
              oldAssignmentMark,
            } = getAverages(newAssignment, oldAssignment, newData, oldData);
            let subDisplay = [];
            if (
              oldTitles.includes(newTitles[i]) &&
              JSON.stringify(newAssignment) !== JSON.stringify(oldAssignment)
            ) {
              //assignment was updated
              subDisplay = [
                "Marks Updated",
                <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                  {newAssignment.name}:{" "}
                  <Text style={styles(colors).updateMark}>
                    {oldAssignmentMark}
                    {"%  "}
                  </Text>
                  <Foundation
                    name="arrow-right"
                    size={13}
                    color={colors.Primary1}
                    style={{
                      marginVertical: 0,
                      paddingVertical: 0,
                      marginHorizontal: 10,
                    }}
                  />
                  <Text style={styles(colors).updateMark}>
                    {"  "}
                    {assignmentMark}%
                  </Text>
                </Text>,
              ];
            } else if (!oldTitles.includes(newTitles[i])) {
              //new assignment released
              subDisplay = [
                "Marks Released",
                <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                  {newAssignment.name}:{" "}
                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                      color: colors.Primary1,
                    }}
                  >
                    {assignmentMark}%
                  </Text>
                </Text>,
              ];
            }
            display.push(
              <View
                style={[GENERAL_STYLES(colors).div, styles(colors).div]}
                key={newAssignment.name + `_${i}`}
              >
                <View style={styles(colors).notifHeader}>
                  <Text style={styles(colors).notifHeaderTitle}>
                    {subDisplay[0]}{" "}
                  </Text>
                  <Text
                    style={[
                      [GENERAL_STYLES(colors).p, styles(colors).p],
                      { fontFamily: "Poppins_500Medium_Italic" },
                    ]}
                  >
                    {date}
                  </Text>
                </View>
                <View style={styles(colors).notifSubtitle}>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {subDisplay[1]}
                  </View>
                  <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                    {courseName} {courseCode}
                  </Text>
                </View>
                <View style={styles(colors).notifBody}>
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <Text style={styles(colors).notifBodyMarks}>
                      {oldAverage}
                    </Text>
                    <Text style={styles(colors).p2}>Average</Text>
                  </View>
                  <Foundation
                    name="arrow-right"
                    size={32}
                    color={colors.Primary1}
                    style={{ marginTop: -23, marginHorizontal: 46 }}
                  />
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <Text style={styles(colors).notifBodyMarks}>
                      {newAverage}%
                    </Text>
                    <Text style={styles(colors).p2}>Average</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles(colors).notifFooter}
                  onPress={() => {
                    navigation.navigate("Details", newData);
                  }}
                >
                  <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                    See More{"  "}
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={14}
                    color={colors.Primary1}
                  />
                </TouchableOpacity>
              </View>
            );
          }
        }
        for (let i = 0; i < oldData.assignments.length; i++) {
          // assignment removed
          if (!newTitles.includes(oldTitles[i])) {
            const oldAssignment = oldData.assignments[i];
            const {
              newAverage,
              oldAverage,
              assignmentMark,
              oldAssignmentMark,
            } = getAverages([], oldAssignment, newData, oldData);
            display.push(
              <View
                style={[GENERAL_STYLES(colors).div, styles(colors).div]}
                key={oldAssignment.name + `_${i}`}
              >
                <View style={styles(colors).notifHeader}>
                  <Text style={styles(colors).notifHeaderTitle}>
                    Marks Removed{" "}
                  </Text>
                  <Text
                    style={[
                      [GENERAL_STYLES(colors).p, styles(colors).p],
                      { fontFamily: "Poppins_500Medium_Italic" },
                    ]}
                  >
                    {date}
                  </Text>
                </View>
                <View style={styles(colors).notifSubtitle}>
                  <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                    {oldAssignment.name}:{" "}
                    <Text
                      style={{
                        fontFamily: "Poppins_700Bold",
                        color: colors.Primary1,
                      }}
                    >
                      {oldAssignmentMark}%
                    </Text>
                  </Text>
                  <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                    {courseName} {courseCode}
                  </Text>
                </View>
                <View style={styles(colors).notifBody}>
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <Text style={styles(colors).notifBodyMarks}>
                      {oldAverage}
                    </Text>
                    <Text style={styles(colors).p2}>Average</Text>
                  </View>
                  <Foundation
                    name="arrow-right"
                    size={32}
                    color={colors.Primary1}
                    style={{ marginTop: -23, marginHorizontal: 46 }}
                  />
                  <View style={{ alignItems: "center", marginHorizontal: 10 }}>
                    <Text style={styles(colors).notifBodyMarks}>
                      {newAverage}%
                    </Text>
                    <Text style={styles(colors).p2}>Average</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles(colors).notifFooter}
                  onPress={() => {
                    navigation.navigate("Details", newData);
                  }}
                >
                  <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
                    See More{"  "}
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={14}
                    color={colors.Primary1}
                  />
                </TouchableOpacity>
              </View>
            );
          }
        }
      }
    }
  }
  return display;
}

const styles = (colors) =>
  StyleSheet.create({
    div: {
      paddingHorizontal: 17,
      paddingTop: 5,
      marginVertical: 7,
    },
    notif: {
      alignItems: "flex-end",
      marginBottom: -26,
      width: "100%",
      paddingRight: 23,
    },
    notifHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      alignItems: "center",
      paddingVertical: 10,
      paddingLeft: 7,
      paddingRight: 12,
      width: "100%",
      marginBottom: 5,
    },
    notifHeaderTitle: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Header,
      fontSize: 20,
    },
    notifSubtitle: {
      alignItems: "flex-start",
      width: "100%",
      paddingHorizontal: 7,
    },
    updateText: {
      flexDirection: "row",
      marginBottom: 2,
    },
    updateCourseText: {
      marginRight: 5,
      paddingTop: 1,
    },
    notifBody: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: "20%",
      paddingVertical: 7,
      marginBottom: 10,
      marginTop: 5,
    },
    notifBodyMarks: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Primary1,
      fontSize: 29,
    },
    finalMark: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Primary1,
      fontSize: 20,
    },
    notifFooter: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 7,
      paddingBottom: 16,
    },
    seeMore: {
      marginRight: 8,
      marginBottom: 2,
    },
    courseTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 15,
      color: colors.Primary1,
      maxWidth: "60%",
    },
    updateMark: {
      fontFamily: "Poppins_700Bold",
      color: colors.Primary1,
      lineHeight: 15,
      fontSize: 13,
      textAlignVertical: "center",
      textAlign: "center",
    },
    p: {
      lineHeight: 16,
      paddingTop: 2,
      textAlignVertical: "center",
    },
    p2: {
      fontFamily: "Poppins_400Regular",
      fontSize: 10,
      color: colors.Subtitle,
      marginTop: -6,
    },
  });
