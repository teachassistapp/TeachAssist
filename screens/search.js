import React, { useContext } from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import ProgressBar from "../components/progressBar";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../globals/theme";
import { calculateAverage } from "../globals/calculators";
import { test_course_data } from "../data/test";
import { TEST_USER, TEST_PASS } from "../data/keys";
import { ASSIGNMENT_STYLES, GENERAL_STYLES } from "../globals/styles";
import { lightColors, darkColors } from "../globals/colors";

function parseAssignments(data, weight_table) {
  let content = {
    title: data.name,
    comments: data.feedback,
    k: data.KU === undefined ? " " : (data.KU[0].get * 100) / data.KU[0].total,
    kWeight: data.KU === undefined ? 0 : data.KU[0].weight,
    kMark:
      data.KU === undefined ? " " : `(${data.KU[0].get}/${data.KU[0].total})`,
    t: data.T === undefined ? " " : (data.T[0].get * 100) / data.T[0].total,
    tWeight: data.T === undefined ? 0 : data.T[0].weight,
    tMark: data.T === undefined ? " " : `(${data.T[0].get}/${data.T[0].total})`,
    c: data.C === undefined ? " " : (data.C[0].get * 100) / data.C[0].total,
    cWeight: data.C === undefined ? 0 : data.C[0].weight,
    cMark: data.C === undefined ? " " : `(${data.C[0].get}/${data.C[0].total})`,
    a: data.A === undefined ? " " : (data.A[0].get * 100) / data.A[0].total,
    aWeight: data.A === undefined ? 0 : data.A[0].weight,
    aMark: data.A === undefined ? " " : `(${data.A[0].get}/${data.A[0].total})`,
    o: data.O === undefined ? " " : (data.O[0].get * 100) / data.O[0].total,
    oWeight: data.O === undefined ? 0 : data.O[0].weight,
    oMark: data.O === undefined ? " " : `(${data.O[0].get}/${data.O[0].total})`,
    f: data.F === undefined ? " " : (data.F[0].get * 100) / data.F[0].total,
    fWeight: data.F === undefined ? 0 : data.F[0].weight,
    fMark: data.F === undefined ? " " : `(${data.F[0].get}/${data.F[0].total})`,
    finished: !(
      (data.KU && !data.KU[0].finished) ||
      (data.T && !data.T[0].finished) ||
      (data.C && !data.C[0].finished) ||
      (data.A && !data.A[0].finished) ||
      (data.F && !data.F[0].finished) ||
      (data.O && !data.O[0].finished)
    ),
    weight_table: weight_table,
  };
  return content;
}

function SearchAssignments({ title, assignments }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  const img =
    theme === "dark"
      ? require("../assets/search_graphic2.png")
      : require("../assets/search_graphic1.png");

  if (title === null || title === "" || assignments.length === 0) {
    return (
      <View style={{ alignItems: "center" }}>
        <Text
          style={[
            GENERAL_STYLES(colors).p,
            { color: colors.Subtitle, textAlign: "center", maxWidth: "85%" },
          ]}
        >
          (e.g. "Unit 1 Test")
        </Text>
        <Image source={img} style={styles(colors).graphic} />
      </View>
    );
  }
  title = title.toLowerCase();
  let titles = [];
  for (let i = 0; i < assignments.length; i++) {
    for (let j = 0; j < assignments[i].assignments.length; j++) {
      let courseName = assignments[i].name === null ? "" : assignments[i].name;
      let assignmentName =
        assignments[i].assignments[j].name === null
          ? ""
          : assignments[i].assignments[j].name;
      titles.push([courseName.toLowerCase(), assignmentName.toLowerCase()]);
    }
  }
  let matches = [];
  for (let i = 0; i < titles.length; i++) {
    //find matching titles
    const course = titles[i][0] === null ? "" : titles[i][0];
    const name = titles[i][1];
    if (course.includes(title) || name.includes(title)) {
      matches.push(titles[i][1]);
    }
  }
  if (matches.length === 0) {
    return (
      <View>
        <Text style={styles(colors).errorMessage}>No matches found.</Text>
      </View>
    );
  }
  let allMatches = [];
  for (let i = 0; i < assignments.length; i++) {
    //find assignments with the matching titles
    let assignmentMatches = [];
    for (let j = 0; j < assignments[i].assignments.length; j++) {
      let assignmentName =
        assignments[i].assignments[j].name === null
          ? ""
          : assignments[i].assignments[j].name.toLowerCase();
      if (matches.includes(assignmentName)) {
        assignmentMatches.push(
          parseAssignments(
            assignments[i].assignments[j],
            assignments[i].weight_table
          )
        );
      }
    }
    if (assignmentMatches.length !== 0) {
      let hRule = null; //separator for results from different courses
      if (allMatches.length > 0) {
        hRule = <View style={styles(colors).hRule} />;
      }
      allMatches.push(
        <View
          key={`${assignments[i].name} ${i}`}
          style={{ marginVertical: 10 }}
        >
          {hRule}
          <View style={styles(colors).resultLabel}>
            <Text style={GENERAL_STYLES(colors).p}>Results from </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", flexWrap: "wrap" }}
              onPress={() => {
                navigation.navigate("Details", assignments[i]);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles(colors).p1}>
                {typeof assignments[i].name === "string"
                  ? assignments[i].name
                  : "Unnamed Course"}{" "}
              </Text>
              <Text
                style={{
                  ...styles(colors).p1,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                (
                {typeof assignments[i].code === "string"
                  ? assignments[i].code
                  : "Unknown Code"}
                )
              </Text>
            </TouchableOpacity>
          </View>
          <DisplayCourseMatches matches={assignmentMatches} />
        </View>
      );
    }
  }
  return allMatches.length === 0 ? null : <View>{allMatches}</View>;
}

function DisplayCourseMatches({ matches }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  let assignments = [];
  for (let i = 0; i < matches.length; i++) {
    const section = matches[i];
    assignments.push(
      <View
        key={`${section.name} ${i}`}
        style={{
          ...GENERAL_STYLES(colors).div,
          minHeight: 150,
          justifyContent: "center",
          margin: 5,
        }}
      >
        <View style={styles(colors).assignmentContainer}>
          <View>
            <Text style={ASSIGNMENT_STYLES(colors).assignmentTitle}>
              {section.title}
            </Text>
            <Text style={ASSIGNMENT_STYLES(colors).assignmentMark}>
              {calculateAverage(
                [
                  section.k,
                  section.t,
                  section.c,
                  section.a,
                  section.f,
                  section.o,
                ],
                [
                  section.kWeight,
                  section.tWeight,
                  section.cWeight,
                  section.aWeight,
                  section.fWeight,
                  section.oWeight,
                ],
                section.weight_table
              )}
              %
            </Text>
          </View>
          <View style={ASSIGNMENT_STYLES(colors).assignmentBarChart}>
            <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.k === " " ? section.k : Math.round(section.k)}
              </Text>
              <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                <ProgressBar
                  progress={section.k}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary2}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>K</Text>
            </View>
            <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.t === " " ? section.t : Math.round(section.t)}
              </Text>
              <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                <ProgressBar
                  progress={section.t}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary1}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>T</Text>
            </View>
            <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.c === " " ? section.c : Math.round(section.c)}
              </Text>
              <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                <ProgressBar
                  progress={section.c}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary2}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>C</Text>
            </View>
            <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.a === " " ? section.a : Math.round(section.a)}
              </Text>
              <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                <ProgressBar
                  progress={section.a}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary1}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>A</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  return <View style={{ marginBottom: 20 }}>{assignments}</View>;
}

export default function Search() {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState(null);
  const retrieveData = async () => {
    try {
      const number = await AsyncStorage.getItem("number");
      const password = await AsyncStorage.getItem("password");
      if (number == TEST_USER && password == TEST_PASS) {
        setAssignments(test_course_data);
      } else {
        let datum = await AsyncStorage.getItem("data");
        datum = JSON.parse(datum);
        if (datum.length !== 0) {
          setAssignments(datum);
        }
      }
    } catch {
      Alert.alert("Failed to load data.");
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);
  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View style={GENERAL_STYLES(colors).header}>
            <Text style={GENERAL_STYLES(colors).headerTitle}>Search</Text>
            <Text style={GENERAL_STYLES(colors).p}>Find Assignments</Text>
          </View>
          <TextInput
            style={styles(colors).input}
            placeholder="Search"
            placeholderTextColor={colors.Placeholder}
            multiline={false}
            onChangeText={(value) => {
              setSearch(value);
            }}
          />
          <SearchAssignments title={search} assignments={assignments} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    p1: {
      fontFamily: "Poppins_700Bold",
      color: colors.Primary1,
      fontSize: 13,
      flexWrap: "wrap",
      maxWidth: 0.8 * vw,
    },
    graphic: {
      width: 0.55 * vw,
      height: 0.622 * vw,
      marginTop: 100,
    },
    input: {
      alignSelf: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 15,
      borderWidth: 1,
      width: 0.9 * vw,
      height: 50,
      paddingHorizontal: 17,
      margin: 5,
      marginBottom: 15,
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    resultLabel: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      paddingLeft: 17,
      paddingTop: 18,
      paddingBottom: 5,
      maxWidth: "90%",
    },
    barLabelsText: {
      fontSize: 10,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      alignSelf: "center",
    },
    assignmentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
      marginVertical: 8,
    },
    hRule: {
      borderBottomColor: colors.GraphBackground,
      borderBottomWidth: 1,
    },
    errorMessage: {
      fontFamily: "Poppins_500Medium",
      color: colors.Subtitle,
      marginTop: 20,
      fontSize: 15,
    },
  });
