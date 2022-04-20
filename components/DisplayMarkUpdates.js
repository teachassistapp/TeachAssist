import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  calculateCourseAverage,
  calculateAverage,
} from "../globals/calculators";
import { useTheme } from "../globals/theme";

const getCurrentDate = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(month)]} ${date}, ${year}`;
};

function parseAssignments(data, weight_table) {
  let content = [];
  for (let i = 0; i < data.length; i++) {
    content.push({
      title: data[i].name,
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
      weight_table: weight_table,
    });
  }
  return content;
}

const displayDate = (date) => {
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
  date = date.split("-");
  return `${months[parseInt(date[1]) - 1]} ${date[2]}, ${date[0]}`;
};

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
  const { colors } = useTheme();

  let display = [];

  if (!oldData || !newData) {
    let data = newData ? { ...newData } : { ...oldData };
    display = (
      <View style={styles(colors).div} key={data.name}>
        <View style={styles(colors).notifHeader}>
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
              styles(colors).p,
              { fontFamily: "Poppins_500Medium_Italic", marginTop: 3 },
            ]}
          >
            {data.code}
          </Text>
        </View>
        <View style={[styles(colors).notifSubtitle, { marginBottom: 20 }]}>
          <Text style={styles(colors).p}>Room {data.room}</Text>
          <Text style={styles(colors).p}>
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
    let oldTitles = [];
    let newTitles = [];
    for (let i = 0; i < oldData.assignments.length; i++) {
      oldTitles.push(oldData.assignments[i].name);
    }
    for (let i = 0; i < newData.assignments.length; i++) {
      newTitles.push(newData.assignments[i].name);
    }

    const date = getCurrentDate();

    if (oldData !== newData) {
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
            JSON.stringify(newAssignment) !== JSON.stringify(oldAssignment)) ||
          !oldTitles.includes(newTitles[i])
        ) {
          const { newAverage, oldAverage, assignmentMark, oldAssignmentMark } =
            getAverages(newAssignment, oldAssignment, newData, oldData);
          let subDisplay = [];
          if (
            oldTitles.includes(newTitles[i]) &&
            JSON.stringify(newAssignment) !== JSON.stringify(oldAssignment)
          ) {
            //assignment was updated
            subDisplay = [
              "Marks Updated",
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: 140,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    color: colors.Primary1,
                  }}
                >
                  {oldAssignmentMark}%
                </Text>
                <Foundation
                  name="arrow-right"
                  size={16}
                  color={colors.Primary1}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    color: colors.Primary1,
                  }}
                >
                  {assignmentMark}%
                </Text>
              </View>,
            ];
          } else if (!oldTitles.includes(newTitles[i])) {
            //new assignment released
            subDisplay = [
              "Marks Released",
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  color: colors.Primary1,
                }}
              >
                {assignmentMark}%
              </Text>,
            ];
          }
          display.push(
            <View style={styles(colors).div} key={newAssignment.name + `_${i}`}>
              <View style={styles(colors).notifHeader}>
                <Text style={styles(colors).notifHeaderTitle}>
                  {subDisplay[0]}{" "}
                </Text>
                <Text
                  style={[
                    styles(colors).p,
                    { fontFamily: "Poppins_500Medium_Italic" },
                  ]}
                >
                  {date}
                </Text>
              </View>
              <View style={styles(colors).notifSubtitle}>
                <Text style={styles(colors).p}>
                  {newAssignment.name}: {subDisplay[1]}
                </Text>
                <Text style={styles(colors).p}>
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
                  style={{ marginTop: -15, marginHorizontal: 46 }}
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
                <Text style={styles(colors).p}>See More </Text>
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
          const { newAverage, oldAverage, assignmentMark, oldAssignmentMark } =
            getAverages([], oldAssignment, newData, oldData);
          display.push(
            <View style={styles(colors).div} key={oldAssignment.name + `_${i}`}>
              <View style={styles(colors).notifHeader}>
                <Text style={styles(colors).notifHeaderTitle}>
                  Marks Removed{" "}
                </Text>
                <Text
                  style={[
                    styles(colors).p,
                    { fontFamily: "Poppins_500Medium_Italic" },
                  ]}
                >
                  {date}
                </Text>
              </View>
              <View style={styles(colors).notifSubtitle}>
                <Text style={styles(colors).p}>
                  {oldAssignment.name}:{" "}
                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                      color: colors.Primary1,
                    }}
                  >
                    {oldAssignmentMark}%
                  </Text>
                  ,
                </Text>
                <Text style={styles(colors).p}>
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
                  style={{ marginTop: -15, marginHorizontal: 46 }}
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
                <Text style={styles(colors).p}>See More </Text>
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
  return display;
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
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 5,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    notif: {
      alignItems: "flex-end",
      marginBottom: -26,
      width: "100%",
      paddingRight: 23,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 15,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      alignSelf: "center",
      color: colors.Header,
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
    notifBody: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: "20%",
      paddingVertical: 7,
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
      marginTop: -15,
      marginBottom: 15,
    },
    notifFooter: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 7,
      paddingBottom: 16,
    },
    courseTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 15,
      color: colors.Primary1,
      maxWidth: "60%",
    },
    p: {
      fontFamily: "Poppins_400Regular",
      fontSize: 13,
      color: colors.Subtitle,
    },
    p2: {
      fontFamily: "Poppins_400Regular",
      fontSize: 10,
      color: colors.Subtitle,
      marginTop: -6,
    },
  });
