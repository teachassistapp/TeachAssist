import React from "react";
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
  StatusBar,
  Dimensions,
} from "react-native";
import ProgressBar from "../components/ProgressBar";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useTheme } from "../globals/theme";
import { calculateAverage } from "../globals/calculators";
import { test_course_data } from "../data/test";
import { TEST_USER, TEST_PASS } from "../data/keys";

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
    weight_table: weight_table,
  };
  return content;
}

function SearchAssignments({ title, assignments }) {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const img = isDark
    ? require("../assets/search_graphic2.png")
    : require("../assets/search_graphic1.png");

  if (title === null || title === "" || assignments.length === 0) {
    return (
      <View style={{ alignItems: "center" }}>
        <Text
          style={[
            styles(colors).p,
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
    //get all titles
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
            <Text style={styles(colors).p}>Results from </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", flexWrap: "wrap" }}
              onPress={() => {
                navigation.navigate("Details", assignments[i]);
              }}
            >
              <Text style={styles(colors).p1}>
                {typeof assignments[i].name === "string"
                  ? assignments[i].name
                  : "Unnamed Course"}{" "}
              </Text>
              <Text style={styles(colors).p2}>
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
  const { colors } = useTheme();
  let assignments = [];
  for (let i = 0; i < matches.length; i++) {
    const section = matches[i];
    assignments.push(
      <View key={`${section.name} ${i}`} style={styles(colors).div}>
        <View style={styles(colors).assignmentContainer}>
          <View>
            <Text style={styles(colors).assignmentTitle}>{section.title}</Text>
            <Text style={styles(colors).assignmentMark}>
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
          <View style={styles(colors).assignmentBarChart}>
            <View style={styles(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.k === " " ? section.k : Math.round(section.k)}
              </Text>
              <View style={styles(colors).progressBar}>
                <ProgressBar
                  progress={section.k}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary2}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>K</Text>
            </View>
            <View style={styles(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.t === " " ? section.t : Math.round(section.t)}
              </Text>
              <View style={styles(colors).progressBar}>
                <ProgressBar
                  progress={section.t}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary1}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>T</Text>
            </View>
            <View style={styles(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.c === " " ? section.c : Math.round(section.c)}
              </Text>
              <View style={styles(colors).progressBar}>
                <ProgressBar
                  progress={section.c}
                  height={8}
                  trackColor={colors.Grey2}
                  backgroundColor={colors.Primary2}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>C</Text>
            </View>
            <View style={styles(colors).assignmentBar}>
              <Text style={styles(colors).barLabelsText}>
                {section.a === " " ? section.a : Math.round(section.a)}
              </Text>
              <View style={styles(colors).progressBar}>
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
  return <View>{assignments}</View>;
}

export default function search() {
  const { colors } = useTheme();
  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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
    } catch (e) {
      Alert.alert("Failed to load data.");
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles(colors).safeView}>
        <ScrollView style={styles(colors).scrollView}>
          <View style={styles(colors).container}>
            <View style={styles(colors).header}>
              <Text style={styles(colors).headerTitle}>Search</Text>
              <Text style={styles(colors).headerSubtitle}>
                Find Assignments
              </Text>
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
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.Background,
    },
    scrollView: {
      width: "100%",
      backgroundColor: colors.Background,
    },
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.Background,
      paddingTop: 15,
    },
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
      minHeight: 120,
      paddingHorizontal: 17,
      paddingVertical: 18,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    p1: {
      fontFamily: "Poppins_700Bold",
      color: colors.Primary1,
      fontSize: 13,
      flexWrap: "wrap",
      maxWidth: 0.8 * vw,
    },
    p2: {
      fontFamily: "Poppins_400Regular",
      color: colors.Primary1,
      fontSize: 13,
      flexWrap: "wrap",
      maxWidth: 0.8 * vw,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 39,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 29,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 75 * vw,
      textAlign: "center",
    },
    headerSubtitle: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
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
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 5,
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
    assignmentTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Header,
      maxWidth: 0.45 * vw,
      marginTop: 5,
    },
    assignmentMark: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 25,
      color: colors.Primary1,
    },
    assignmentBar: {
      height: 90,
      width: 28,
      justifyContent: "center",
    },
    assignmentBarChart: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      height: 90,
      width: 120,
      top: 2,
    },
    progressBar: {
      height: 90,
      width: 70,
      transform: [{ rotate: "270deg" }],
      position: "relative",
      right: -20,
      marginTop: -9,
      marginBottom: -9,
    },
    assignmentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
      height: 115,
    },
    expandComments: {
      marginTop: 5,
      lineHeight: 6,
    },
    expandCommentsTitle: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      fontSize: 16,
      marginTop: 5,
    },
    expandCommentsText: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 12,
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
