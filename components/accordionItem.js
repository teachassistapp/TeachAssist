import React, { useState, useContext } from "react";
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
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ProgressBar from "./progressBar";
import { calculateAverage } from "../globals/calculators";
import SubmitCheck, { verifyNumber } from "../globals/inputValidation";
import { ThemeContext } from "../globals/theme";
import { ASSIGNMENT_STYLES, GENERAL_STYLES } from "../globals/styles";
import * as Device from "expo-device";
import { lightColors, darkColors } from "../globals/colors";

export default function AccordionItem({
  data,
  assignments,
  assignmentsSetter,
  originalAssignment,
  editable,
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
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
            style={{ flex: 1 }}
          >
            <AntDesign name="close" size={24} color={colors.Header} />
          </TouchableOpacity>
        );
      }
    } catch {}
    return null;
  }

  const [k, setK] = useState(String(Math.round(section.k * 10) / 10));
  const [kw, setKW] = useState(String(Math.round(section.kWeight * 10) / 10));
  const [t, setT] = useState(String(Math.round(section.t * 10) / 10));
  const [tw, setTW] = useState(String(Math.round(section.tWeight * 10) / 10));
  const [c, setC] = useState(String(Math.round(section.c * 10) / 10));
  const [cw, setCW] = useState(String(Math.round(section.cWeight * 10) / 10));
  const [a, setA] = useState(String(Math.round(section.a * 10) / 10));
  const [aw, setAW] = useState(String(Math.round(section.aWeight * 10) / 10));
  const [f, setF] = useState(String(Math.round(section.f * 10) / 10));
  const [fw, setFW] = useState(String(Math.round(section.fWeight * 10) / 10));
  const [o, setO] = useState(String(Math.round(section.o * 10) / 10));
  const [ow, setOW] = useState(String(Math.round(section.oWeight * 10) / 10));

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
      <View style={{ flex: section.deletable ? 4 : 5 }}>
        <Text style={ASSIGNMENT_STYLES(colors).assignmentTitle}>
          {section.title}
        </Text>
        <Text style={ASSIGNMENT_STYLES(colors).assignmentMark}>
          {average === "N/A" ? average : `${average}%`}
        </Text>
      </View>
      <View
        style={{ ...ASSIGNMENT_STYLES(colors).assignmentBarChart, flex: 3 }}
      >
        {section.finished ? (
          ["k", "t", "c", "a"].map((i, index) => {
            return (
              ((section.f === " " && section.o === " ") ||
                section[i] !== " ") && (
                <View style={ASSIGNMENT_STYLES(colors).assignmentBar} key={i}>
                  <Text
                    style={{
                      ...styles(colors).barLabelsText,
                      fontSize:
                        [
                          section.k,
                          section.t,
                          section.c,
                          section.a,
                          section.f,
                          section.o,
                        ].filter((i) => i !== " ").length *
                          -1 +
                        14,
                    }}
                  >
                    {section[i] === " " ? section[i] : Math.round(section[i])}
                  </Text>
                  <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                    <ProgressBar
                      progress={section[i]}
                      height={8}
                      trackColor={colors.GraphBackground}
                      backgroundColor={
                        index % 2 === 0 ? colors.Primary2 : colors.Primary1
                      }
                    />
                  </View>
                  <Text style={styles(colors).barLabelsText}>
                    {i.toUpperCase()}
                  </Text>
                </View>
              )
            );
          })
        ) : (
          <View style={{ width: "100%" }}>
            <Text
              style={{
                ...GENERAL_STYLES(colors).p,
                textAlign: "center",
                fontSize: 12,
              }}
            >
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
          <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
            <Text
              style={{
                ...styles(colors).barLabelsText,
                fontSize:
                  [
                    section.k,
                    section.t,
                    section.c,
                    section.a,
                    section.f,
                    section.o,
                  ].filter((i) => i !== " ").length *
                    -1 +
                  14,
              }}
            >
              {section.f === " " ? section.f : Math.round(section.f)}
            </Text>
            <View style={ASSIGNMENT_STYLES(colors).progressBar}>
              <ProgressBar
                progress={section.f}
                height={8}
                trackColor={colors.GraphBackground}
                backgroundColor={colors.Final}
              />
            </View>
            <Text style={styles(colors).barLabelsText}>F</Text>
          </View>
        )}
        {section.o != " " && (
          <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
            <Text
              style={{
                ...styles(colors).barLabelsText,
                fontSize:
                  [
                    section.k,
                    section.t,
                    section.c,
                    section.a,
                    section.f,
                    section.o,
                  ].filter((i) => i !== " ").length *
                    -1 +
                  14,
              }}
            >
              {section.f === " " ? section.o : Math.round(section.o)}
            </Text>
            <View style={ASSIGNMENT_STYLES(colors).progressBar}>
              <ProgressBar
                progress={section.o}
                height={8}
                trackColor={colors.GraphBackground}
                backgroundColor={colors.Other}
              />
            </View>
            <Text style={styles(colors).barLabelsText}>O</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <View style={{ marginTop: 8 }}>
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
              behavior={Device.osName === "iOS" ? "padding" : "height"}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    ...GENERAL_STYLES(colors).div,
                    marginVertical: "auto",
                    margin: 5,
                    paddingHorizontal: 25,
                    paddingVertical: 25,
                    minHeight: 160,
                  }}
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
                        var cats = [k, kw, t, tw, c, cw, a, aw, f, fw, o, ow];
                        cats = cats.map((i) => i.trim());
                        const valid = verifyNumber(cats);
                        if (valid) {
                          const keys = ["k", "t", "c", "a", "f", "o"];
                          const data = {
                            deletable: section.deletable,
                            title: section.title,
                            comments: null,
                            finished: true,
                            weight_table: section.weight_table,
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
                          updateAssignments(data);
                          setModalVisible(false);
                          setEdited(true);
                        }
                        setIsValid(valid);
                      }}
                    >
                      <Ionicons
                        name="calculator"
                        size={20}
                        color={colors.Background}
                      />
                      <Text style={styles(colors).buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <SubmitCheck check={isValid} colors={colors} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      )}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles(colors).expand}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }} />
          <View style={styles(colors).expandHeader}>
            <Text style={ASSIGNMENT_STYLES(colors).assignmentTitle}>
              {section.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={ASSIGNMENT_STYLES(colors).assignmentMark}>
                {average === "N/A" ? average : `${average}%`}
              </Text>
            </View>
          </View>
          <View style={{ alignSelf: "center" }}>
            <View style={{ flexDirection: "row" }}>
              {edited && !section.deletable && (
                <View style={styles(colors).editBtn}>
                  <TouchableOpacity
                    style={styles(colors).edit}
                    onPress={() => {
                      updateAssignments(originalAssignment);
                      setEdited(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={{
                        ...GENERAL_STYLES(colors).p,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      Undo
                    </Text>
                    <FontAwesome
                      name="undo"
                      size={12}
                      color={colors.Subtitle}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {editable && (
                <View style={styles(colors).editBtn}>
                  <TouchableOpacity
                    style={styles(colors).edit}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={{
                        ...GENERAL_STYLES(colors).p,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      Edit
                    </Text>
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={13}
                      color={colors.Subtitle}
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          {section.f !== " " && (
            <>
              <View style={styles(colors).expandBar}>
                <Text style={styles(colors).barLabelsText}>F</Text>
                <View style={styles(colors).expandProgress}>
                  <ProgressBar
                    progress={section.f}
                    height={8}
                    trackColor={colors.GraphBackground}
                    backgroundColor={colors.Final}
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

          {section.kMark !== " " && (
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
          {section.tMark !== " " && (
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
          {section.cMark !== " " && (
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
          {section.aMark !== " " && (
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
                <Text style={styles(colors).barLabelsText} numberOfLines={1}>
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
          {section.o !== " " && (
            <>
              <View style={styles(colors).expandBar}>
                <Text style={styles(colors).barLabelsText}>O</Text>
                <View style={styles(colors).expandProgress}>
                  <ProgressBar
                    progress={section.o}
                    height={8}
                    trackColor={colors.GraphBackground}
                    backgroundColor={colors.Other}
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
              <Text
                style={{
                  ...GENERAL_STYLES(colors).p,
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
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
  return (
    <View
      style={{
        ...GENERAL_STYLES(colors).div,
        margin: 5,
        paddingHorizontal: 17,
        paddingVertical: 10,
        minHeight: 150,
        justifyContent: "center",
      }}
    >
      {display}
    </View>
  );
}

const vw = Dimensions.get("window").width;
const styles = (colors) =>
  StyleSheet.create({
    barLabelsText: {
      fontSize: 10,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      alignSelf: "center",
    },
    edit: {
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
    },
    barMarks: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 76,
      bottom: -5,
    },
    inactive: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
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
      paddingHorizontal: 17,
      paddingVertical: 8,
      margin: 5,
    },
    editBtn: {
      padding: 2,
      borderRadius: 50,
      backgroundColor: colors.Placeholder,
      marginHorizontal: 5,
      marginBottom: 6,
    },
  });
