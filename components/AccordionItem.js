import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
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
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";
import { calculateAverage } from "../globals/calculators";
import SubmitCheck, { verifyNumber } from "../globals/inputValidation";
import { useTheme } from "../globals/theme";

export default function AccordionItem({
  data,
  assignments,
  assignmentsSetter,
  originalAssignment,
  editable,
}) {
  const { colors } = useTheme();
  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [section, setSection] = useState(data);
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [edited, setEdited] = useState(false);

  const updateAssignments = (newAssignment) => {
    if (newAssignment === null) {
      const index = assignments.indexOf(data);
      const temp = [...assignments];
      if (index > -1) {
        temp.splice(index, 1);
      }
      assignmentsSetter(temp);
    } else {
      const index = assignments
        .map((el) => el.title)
        .indexOf(newAssignment.title);
      const temp = [...assignments];
      temp[index] = newAssignment;
      assignmentsSetter(temp);
      setSection(newAssignment);
    }
  };

  function CheckCustom({ section }) {
    try {
      if (section.deletable === true) {
        return (
          <TouchableOpacity
            onPress={() => updateAssignments(null)}
            hitSlop={{ top: 30, right: 10, bottom: 30, left: 10 }}
          >
            <AntDesign name="close" size={24} color={colors.Header} />
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

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
  let res = []; //for the calculator
  for (let i = 0; i < 6; i++) {
    res.push(
      <View style={styles(colors).inputContainer} key={labels[i]}>
        <View style={styles(colors).inputSubContainer}>
          <Text style={styles(colors).inputLabel}>{labels[i]}</Text>
          <TextInput
            style={styles(colors).input}
            onChangeText={categories[i][0][1]}
            value={String(categories[i][0][0])}
            keyboardType={"numeric"}
            textAlign={"center"}
          />
        </View>
        <View style={styles(colors).inputSubContainer}>
          <Text style={styles(colors).inputLabel}>Weight:</Text>
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
  let average = calculateAverage(
    [section.k, section.t, section.c, section.a, section.f, section.o],
    [
      section.kWeight,
      section.tWeight,
      section.cWeight,
      section.aWeight,
      section.fWeight,
      section.oWeight,
    ],
    section.weight_table
  );
  function TeacherComments() {
    if (section.comments === null) {
      return null;
    } else {
      return (
        <View style={styles(colors).expandComments}>
          <View style={styles(colors).hRule} />
          <Text style={styles(colors).expandCommentsTitle}>Comments:</Text>
          <Text style={styles(colors).expandCommentsText}>
            {section.comments}
          </Text>
        </View>
      );
    }
  }
  let display = !expanded ? (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      style={styles(colors).inactive}
    >
      <CheckCustom section={section} />
      <View>
        <Text style={styles(colors).assignmentTitle}>{section.title}</Text>
        <Text style={styles(colors).assignmentMark}>
          {average === "N/A" ? average : `${average}%`}
        </Text>
      </View>
      <View style={styles(colors).assignmentBarChart}>
        {section.finished ? (
          section.f == " " &&
          (section.k != " " ||
            section.t != " " ||
            section.c != " " ||
            section.a != " ") && (
            <>
              <View style={styles(colors).assignmentBar}>
                <Text style={styles(colors).barLabelsText}>
                  {section.k === " " ? section.k : Math.round(section.k)}
                </Text>
                <View style={styles(colors).progressBar}>
                  <ProgressBar
                    progress={section.k}
                    height={8}
                    trackColor={colors.GraphBackground}
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
                    trackColor={colors.GraphBackground}
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
                    trackColor={colors.GraphBackground}
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
                    trackColor={colors.GraphBackground}
                    backgroundColor={colors.Primary1}
                  />
                </View>
                <Text style={styles(colors).barLabelsText}>A</Text>
              </View>
            </>
          )
        ) : (
          <View style={{ width: "100%" }}>
            <Text style={[styles(colors).p, { textAlign: "center" }]}>
              <AntDesign
                name="exclamationcircleo"
                size={12}
                color={colors.Subtitle}
              />
              {"  "}
              This assignment was not finished.
            </Text>
          </View>
        )}
        {section.f != " " && (
          <View style={styles(colors).assignmentBar}>
            <Text style={styles(colors).barLabelsText}>
              {section.f === " " ? section.f : Math.round(section.f)}
            </Text>
            <View style={styles(colors).progressBar}>
              <ProgressBar
                progress={section.f}
                height={8}
                trackColor={colors.GraphBackground}
                backgroundColor={colors.Primary1}
              />
            </View>
            <Text style={styles(colors).barLabelsText}>F</Text>
          </View>
        )}
        {section.o != " " && (
          <View style={styles(colors).assignmentBar}>
            <Text style={styles(colors).barLabelsText}>
              {section.f === " " ? section.o : Math.round(section.o)}
            </Text>
            <View style={styles(colors).progressBar}>
              <ProgressBar
                progress={section.o}
                height={8}
                trackColor={colors.GraphBackground}
                backgroundColor={colors.Primary1}
              />
            </View>
            <Text style={styles(colors).barLabelsText}>O</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <View>
      {editable && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false); //if user taps outside the calculator, close the modal
            }}
            style={{
              width: "100%",
              flex: 1,
              backgroundColor: `${colors.Background}cc`,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles(colors).div,
                    { marginVertical: "auto", paddingHorizontal: 25 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles(colors).close}
                    hitSlop={{
                      top: 20,
                      left: 20,
                      bottom: 30,
                      right: 30,
                    }}
                  >
                    <AntDesign name="close" size={21} color={colors.Subtitle} />
                  </TouchableOpacity>
                  <Text style={styles(colors).modalTitle}>{section.title}</Text>
                  <View style={styles(colors).form}>
                    {res}
                    <TouchableOpacity
                      style={styles(colors).button}
                      onPress={() => {
                        if (
                          verifyNumber([
                            k,
                            kw,
                            t,
                            tw,
                            c,
                            cw,
                            a,
                            aw,
                            f,
                            fw,
                            o,
                            ow,
                          ])
                        ) {
                          const data = {
                            deletable: section.deletable,
                            title: section.title,
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
                            weight_table: section.weight_table,
                          };
                          updateAssignments(data);
                          setIsValid(true);
                          setModalVisible(false);
                          setEdited(true);
                        } else {
                          setIsValid(false);
                        }
                      }}
                    >
                      <Ionicons
                        name="calculator"
                        size={24}
                        color={colors.Background}
                      />
                      <Text style={styles(colors).buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <SubmitCheck check={isValid} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      )}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles(colors).expand}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {edited && !section.deletable && (
              <TouchableOpacity
                style={styles(colors).edit}
                onPress={() => {
                  updateAssignments(originalAssignment);
                  setEdited(false);
                }}
              >
                <Text style={styles(colors).p}>Undo</Text>
                <FontAwesome
                  name="undo"
                  size={12}
                  color={colors.Subtitle}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            )}
            {editable && (
              <TouchableOpacity
                style={styles(colors).edit}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles(colors).p}>Edit</Text>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={13}
                  color={colors.Subtitle}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles(colors).expandHeader}>
            <Text style={styles(colors).assignmentTitle}>{section.title}</Text>
            <Text style={styles(colors).assignmentMark}>
              {average === "N/A" ? average : `${average}%`}
            </Text>
          </View>
          {section.f != " " && (
            <>
              <View style={styles(colors).expandBar}>
                <Text style={styles(colors).barLabelsText}>F</Text>
                <View style={styles(colors).expandProgress}>
                  <ProgressBar
                    progress={section.f}
                    height={8}
                    trackColor={colors.GraphBackground}
                    backgroundColor={colors.Primary2}
                  />
                </View>
                <Text style={styles(colors).barLabelsText} numberOfLines={1}>
                  {Math.round(section.f * 10) / 10}%
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles(colors).expandBarMarks}>
                  (Weight: {section.fWeight})
                </Text>
                <Text style={styles(colors).expandBarMarks}>
                  {section.fMark}
                </Text>
              </View>
            </>
          )}
          {section.f == " " &&
            (section.kMark != " " ||
              section.tMark != " " ||
              section.cMark != " " ||
              section.aMark != " ") && (
              <>
                {section.kMark != " " && (
                  <>
                    <View style={styles(colors).expandBar}>
                      <Text style={styles(colors).barLabelsText}>K</Text>
                      <View style={styles(colors).expandProgress}>
                        <ProgressBar
                          progress={section.k}
                          height={8}
                          trackColor={colors.GraphBackground}
                          backgroundColor={colors.Primary1}
                        />
                      </View>
                      <Text style={styles(colors).barLabelsText}>
                        {Math.round(section.k * 10) / 10}%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles(colors).expandBarMarks}>
                        (Weight: {section.kWeight})
                      </Text>
                      <Text style={styles(colors).expandBarMarks}>
                        {section.kMark}
                      </Text>
                    </View>
                  </>
                )}
                {section.tMark != " " && (
                  <>
                    <View style={styles(colors).expandBar}>
                      <Text style={styles(colors).barLabelsText}>T</Text>
                      <View style={styles(colors).expandProgress}>
                        <ProgressBar
                          progress={section.t}
                          height={8}
                          trackColor={colors.GraphBackground}
                          backgroundColor={colors.Primary2}
                        />
                      </View>
                      <Text style={styles(colors).barLabelsText}>
                        {Math.round(section.t * 10) / 10}%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles(colors).expandBarMarks}>
                        (Weight: {section.tWeight})
                      </Text>
                      <Text style={styles(colors).expandBarMarks}>
                        {section.tMark}
                      </Text>
                    </View>
                  </>
                )}
                {section.cMark != " " && (
                  <>
                    <View style={styles(colors).expandBar}>
                      <Text style={styles(colors).barLabelsText}>C</Text>
                      <View style={styles(colors).expandProgress}>
                        <ProgressBar
                          progress={section.c}
                          height={8}
                          trackColor={colors.GraphBackground}
                          backgroundColor={colors.Primary1}
                        />
                      </View>
                      <Text style={styles(colors).barLabelsText}>
                        {Math.round(section.c * 10) / 10}%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles(colors).expandBarMarks}>
                        (Weight: {section.cWeight})
                      </Text>
                      <Text style={styles(colors).expandBarMarks}>
                        {section.cMark}
                      </Text>
                    </View>
                  </>
                )}
                {section.aMark != " " && (
                  <>
                    <View style={styles(colors).expandBar}>
                      <Text style={styles(colors).barLabelsText}>A</Text>
                      <View style={styles(colors).expandProgress}>
                        <ProgressBar
                          progress={section.a}
                          height={8}
                          trackColor={colors.GraphBackground}
                          backgroundColor={colors.Primary2}
                        />
                      </View>
                      <Text
                        style={styles(colors).barLabelsText}
                        numberOfLines={1}
                      >
                        {Math.round(section.a * 10) / 10}%
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles(colors).expandBarMarks}>
                        (Weight: {section.aWeight})
                      </Text>
                      <Text style={styles(colors).expandBarMarks}>
                        {section.aMark}
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          {section.o != " " && (
            <>
              <View style={styles(colors).expandBar}>
                <Text style={styles(colors).barLabelsText}>O</Text>
                <View style={styles(colors).expandProgress}>
                  <ProgressBar
                    progress={section.o}
                    height={8}
                    trackColor={colors.GraphBackground}
                    backgroundColor={colors.Primary2}
                  />
                </View>
                <Text style={styles(colors).barLabelsText} numberOfLines={1}>
                  {Math.round(section.o * 10) / 10}%
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles(colors).expandBarMarks}>
                  (Weight: {section.oWeight})
                </Text>
                <Text style={styles(colors).expandBarMarks}>
                  {section.oMark}
                </Text>
              </View>
            </>
          )}
          {section.finished === false && (
            <View
              style={{
                width: "100%",
                marginTop: 15,
                marginBottom: 0,
              }}
            >
              <Text style={[styles(colors).p, { textAlign: "center" }]}>
                <AntDesign
                  name="exclamationcircleo"
                  size={12}
                  color={colors.Subtitle}
                />
                {"  "}
                This assignment was not finished.
              </Text>
            </View>
          )}
          <TeacherComments />
        </View>
      </TouchableOpacity>
    </View>
  );
  if (!fontsLoaded) {
    return null;
  } else {
    return <View style={styles(colors).div}>{display}</View>;
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
      minHeight: 160,
      paddingHorizontal: 17,
      paddingVertical: 25,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 12,
    },
    barLabelsText: {
      fontSize: 10,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      alignSelf: "center",
    },
    edit: {
      width: 60,
      height: 20,
      paddingLeft: 14,
      marginLeft: 10,
      marginBottom: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    assignmentTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 15,
      color: colors.Header,
      maxWidth: 0.4 * vw,
      marginTop: 5,
      marginBottom: 5,
    },
    assignmentMark: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 23,
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
    barMarks: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 76,
      bottom: -5,
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
    inactive: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
      height: 115,
    },
    expand: {
      width: 0.8 * vw,
      paddingBottom: 10,
    },
    expandHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    expandBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 7,
    },
    expandProgress: {
      width: 0.65 * vw,
      height: 10,
    },
    expandBarMarks: {
      fontFamily: "Poppins_400Regular",
      fontSize: 10,
      color: colors.Subtitle,
    },
    expandComments: {
      marginTop: 5,
      lineHeight: 6,
    },
    expandCommentsTitle: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      fontSize: 15,
      marginTop: 5,
    },
    expandCommentsText: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 12,
    },
    hRule: {
      borderBottomColor: colors.Subtitle,
      borderBottomWidth: 1,
      marginTop: 14,
      marginBottom: 8,
    },
    close: {
      alignSelf: "flex-end",
      marginBottom: -25,
      marginTop: 10,
    },
    modalTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Header,
      maxWidth: 0.5 * vw,
      marginBottom: 20,
      textAlign: "center",
      alignSelf: "center",
    },
    calculator: {
      width: "90%",
      height: 100,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    form: {
      justifyContent: "flex-start",
      paddingBottom: 10,
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "center",
      width: "95%",
      marginBottom: 10,
    },
    inputSubContainer: {
      width: "48%",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.Border,
      padding: 5,
      width: "45%",
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
    },
    inputLabel: {
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
      color: colors.Subtitle,
      marginRight: 5,
    },
    checkText: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.Red,
      alignSelf: "center",
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Background,
      paddingTop: 3,
      paddingLeft: 8,
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
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 8,
      paddingBottom: 8,
      margin: 5,
    },
  });
