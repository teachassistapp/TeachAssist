import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import Accordion from "../../../components/accordion";
import Collapsible from "../../../components/collapsible";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import SubmitCheck, {
  verifyNumber,
  verifyTitle,
} from "../../../globals/inputValidation";
import { calculateCourseAverage } from "../../../globals/calculators";
import { DisplayProgress } from "../../../components/charts";
import { useTheme } from "../../../globals/theme";
import { GENERAL_STYLES } from "../../../globals/styles";

export default function AssessmentsScreen({
  content,
  overall_mark,
  weight_table,
  cached,
}) {
  const { colors } = useTheme();
  const [tempMark, setTempMark] = useState(overall_mark);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [assessments, setAssessments] = useState([...content]);
  const [assessmentsState, updateAssessments] = useState(0);
  const [isValid, setIsValid] = useState(true);

  const originalAssessments = [...content];

  const setAssessmentsParent = (assignment) => {
    setAssessments(assignment);
  };

  useEffect(() => {
    if (content.length !== 0) {
      const mark = calculateCourseAverage(assessments);
      if (JSON.stringify(originalAssessments) !== JSON.stringify(assessments)) {
        setTempMark(mark);
      } else {
        setTempMark(overall_mark);
      }
    }
  }, [assessments, assessmentsState]);
  const [k, setK] = useState("100");
  const [kw, setKW] = useState("10");
  const [t, setT] = useState("100");
  const [tw, setTW] = useState("10");
  const [c, setC] = useState("100");
  const [cw, setCW] = useState("10");
  const [a, setA] = useState("100");
  const [aw, setAW] = useState("10");
  const [f, setF] = useState("0");
  const [fw, setFW] = useState("0");
  const [o, setO] = useState("0");
  const [ow, setOW] = useState("0");
  const [title, setTitle] = useState("Assignment");
  const categories = [
    [
      [k, setK],
      [kw, setKW],
    ],
    [
      [t, setT],
      [tw, setTW],
    ],
    [
      [c, setC],
      [cw, setCW],
    ],
    [
      [a, setA],
      [aw, setAW],
    ],
    [
      [f, setF],
      [fw, setFW],
    ],
    [
      [o, setO],
      [ow, setOW],
    ],
  ];
  const labels = ["K:", "T:", "C:", "A:", "F:", "O:"];
  let res = [];
  for (let i = 0; i < 6; i++) {
    res.push(
      <View style={GENERAL_STYLES(colors).inputContainer} key={labels[i]}>
        <View style={GENERAL_STYLES(colors).inputSubContainer}>
          <Text style={GENERAL_STYLES(colors).inputLabel}>{labels[i]}</Text>
          <TextInput
            style={styles(colors).input}
            onChangeText={categories[i][0][1]}
            value={String(categories[i][0][0])}
            keyboardType={"numeric"}
            textAlign={"center"}
          />
        </View>
        <View style={GENERAL_STYLES(colors).inputSubContainer}>
          <Text style={GENERAL_STYLES(colors).inputLabel}>Weight:</Text>
          <TextInput
            style={styles(colors).input}
            onChangeText={categories[i][1][1]}
            value={String(categories[i][1][0])}
            keyboardType={"numeric"}
            textAlign={"center"}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View style={GENERAL_STYLES(colors).blockContainer}>
        <DisplayProgress value={tempMark} subtitle="Average" />
        {cached === true && (
          <View style={styles(colors).cacheContainer}>
            <AntDesign
              name="exclamationcircleo"
              size={18}
              color={colors.Subtitle}
            />
            <Text style={styles(colors).pCache}>
              Your teacher has cached this course.
            </Text>
          </View>
        )}
        {assessments && (
          <View>
            <Accordion
              assessments={assessments}
              setAssessments={setAssessmentsParent}
              originalAssignments={originalAssessments}
              editable={true}
            />
            <View
              style={{
                ...GENERAL_STYLES(colors).div,
                paddingHorizontal: 17,
                paddingVertical: 20,
                margin: 5,
                minHeight: 50,
              }}
            >
              <TouchableOpacity
                style={styles(colors).calculator}
                onPress={() => setIsCollapsed(!isCollapsed)}
              >
                <AntDesign
                  name="pluscircle"
                  size={24}
                  color={colors.Primary1}
                />
                <Text style={styles(colors).calculatorTitle}>
                  Add Assignment
                </Text>
              </TouchableOpacity>
              <Collapsible collapsed={isCollapsed}>
                <View style={styles(colors).form}>
                  <TextInput
                    style={[styles(colors).input, styles(colors).inputTitle]}
                    onChangeText={setTitle}
                    value={title}
                    maxLength={30}
                  />
                  {res}
                  <TouchableOpacity
                    style={styles(colors).button}
                    onPress={() => {
                      var cats = [k, kw, t, tw, c, cw, a, aw, f, fw, o, ow];
                      cats = cats.map((i) => i.trim());
                      const valid = verifyNumber(cats);
                      if (valid) {
                        let temp = [...assessments];
                        const keys = ["k", "t", "c", "a", "f", "o"];
                        const data = {
                          deletable: true,
                          index: temp.length,
                          title: verifyTitle(title, assessments),
                          comments: null,
                          finished: true,
                          weight_table: weight_table,
                        };
                        keys.forEach((c, i) => {
                          var values = [];
                          if (
                            cats[i * 2].length === 0 ||
                            cats[i * 2 + 1].length === 0 ||
                            cats[i * 2 + 1] === "0"
                          ) {
                            values = [" ", 0, " "];
                          } else {
                            values = [
                              parseFloat(cats[i * 2]),
                              parseFloat(cats[i * 2 + 1]),
                              "",
                            ];
                          }
                          data[c] = values[0];
                          data[c + "Weight"] = values[1];
                          data[c + "Mark"] = values[2];
                        });
                        temp.push(data);
                        setAssessments([...temp]);
                        updateAssessments(assessmentsState + 1);
                      }
                      setIsValid(valid);
                    }}
                  >
                    <Ionicons
                      name="calculator"
                      size={20}
                      color={colors.Background}
                    />
                    <Text style={styles(colors).buttonText}>Create</Text>
                  </TouchableOpacity>
                  <SubmitCheck check={isValid} colors={colors} />
                  {String(weight_table) === "null" && (
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Poppins_400Regular",
                        textAlign: "center",
                        color: colors.Subtitle,
                        maxWidth: "90%",
                        alignSelf: "center",
                        marginTop: 15,
                        lineHeight: 17,
                      }}
                    >
                      Warning: Your course weightings are not available, so
                      calculations may be inaccurate. See the Help & FAQ page
                      for more details.
                    </Text>
                  )}
                </View>
              </Collapsible>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    cacheContainer: {
      marginVertical: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: Dimensions.get("window").width * 0.9,
      paddingHorizontal: 30,
    },
    pCache: {
      fontFamily: "Poppins_500Medium",
      color: colors.Subtitle,
      fontSize: 14,
      marginLeft: 15,
      marginTop: 0,
    },
    calculator: {
      width: "90%",
      height: 50,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    calculatorTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 17,
      color: colors.Header,
      marginLeft: 17,
      marginTop: 4,
      textAlign: "center",
      textAlignVertical: "center",
      lineHeight: 20,
    },
    form: {
      justifyContent: "flex-start",
      paddingTop: 20,
    },
    input: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.Border,
      padding: 5,
      width: "45%",
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
    },
    inputTitle: {
      width: "90%",
      alignSelf: "center",
      marginBottom: 15,
      fontSize: 14,
      paddingLeft: 12,
      color: colors.Subtitle,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Background,
      paddingLeft: 8,
      paddingTop: 3,
      textAlign: "center",
      textAlignVertical: "center",
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.Primary1,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      height: "auto",
      width: "auto",
      paddingHorizontal: 17,
      paddingVertical: 8,
      marginTop: 10,
      marginHorizontal: 5,
    },
  });
