import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import Accordion from "../../../components/Accordion";
import Collapsible from "../../../components/Collapsible";
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
      setTempMark(calculateCourseAverage(assessments));
    }
  }, [assessments, assessmentsState]);
  const [k, setK] = useState(100);
  const [kw, setKW] = useState(10);
  const [t, setT] = useState(100);
  const [tw, setTW] = useState(10);
  const [c, setC] = useState(100);
  const [cw, setCW] = useState(10);
  const [a, setA] = useState(100);
  const [aw, setAW] = useState(10);
  const [f, setF] = useState(0);
  const [fw, setFW] = useState(0);
  const [o, setO] = useState(0);
  const [ow, setOW] = useState(0);
  const [title, setTitle] = useState(" Assignment");
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
        <DisplayProgress value={tempMark} />
        {cached === true && (
          <View style={styles(colors).cacheContainer}>
            <AntDesign
              name="exclamationcircleo"
              size={18}
              color={colors.Subtitle}
            />
            <Text style={[styles(colors).pCache]}>
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
                      if (
                        verifyNumber([k, kw, t, tw, c, cw, a, aw, f, fw, o, ow])
                      ) {
                        let temp = [...assessments];
                        const data = {
                          deletable: true,
                          index: temp.length,
                          title: verifyTitle(title, assessments),
                          comments: null,
                          k: parseFloat(k),
                          kWeight: parseFloat(kw),
                          kMark: "",
                          t: parseFloat(t),
                          tWeight: parseFloat(tw),
                          tMark: "",
                          c: parseFloat(c),
                          cWeight: parseFloat(cw),
                          cMark: "",
                          a: parseFloat(a),
                          aWeight: parseFloat(aw),
                          aMark: "",
                          f: parseFloat(f),
                          fWeight: parseFloat(fw),
                          fMark: "",
                          o: parseFloat(o),
                          oWeight: parseFloat(ow),
                          oMark: "",
                          finished: true,
                          weight_table: weight_table,
                        };
                        temp.push(data);
                        setAssessments([...temp]);
                        updateAssessments(assessmentsState + 1);
                        setIsValid(true);
                      } else {
                        setIsValid(false);
                      }
                    }}
                  >
                    <Ionicons
                      name="calculator"
                      size={22}
                      color={colors.Background}
                    />
                    <Text style={styles(colors).buttonText}>Create</Text>
                  </TouchableOpacity>
                  <SubmitCheck check={isValid} colors={colors} />
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
      marginTop: 3,
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
      marginLeft: 0.05 * vw,
      textAlign: "center",
      textAlignVertical: "center",
      lineHeight: 20,
    },
    form: {
      justifyContent: "flex-start",
      paddingVertical: 20,
    },
    input: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.Border,
      padding: 5,
      width: "45%",
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
    },
    inputTitle: {
      width: "85%",
      alignSelf: "center",
      marginBottom: 15,
      fontSize: 16,
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
