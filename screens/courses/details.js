import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import * as Haptics from "expo-haptics";
import SwitchSelector from "react-native-switch-selector";
import AssessmentsScreen from "./details/assessments";
import StatisticsScreen from "./details/statistics";
import AboutScreen from "./details/about";
import { useTheme } from "../../globals/theme";
import { GENERAL_STYLES } from "../../globals/styles";
import { BackHeader } from "../../components/BackHeader";
import * as Device from "expo-device";

function parseAssignments(data, weight_table) {
  let content = [];
  //console.log(data);
  for (let i = 0; i < data.length; i++) {
    content.push({
      title: data[i].name,
      comments: data[i].feedback ? data[i].feedback : null,
      k:
        !data[i].KU || !data[i].KU[0].finished
          ? " "
          : (data[i].KU[0].get * 100) / data[i].KU[0].total,
      kWeight:
        !data[i].KU || !data[i].KU[0].finished ? 0 : data[i].KU[0].weight,
      kMark: !data[i].KU
        ? " "
        : `(${data[i].KU[0].get}/${data[i].KU[0].total})`,
      t:
        !data[i].T || !data[i].T[0].finished
          ? " "
          : (data[i].T[0].get * 100) / data[i].T[0].total,
      tWeight: !data[i].T || !data[i].T[0].finished ? 0 : data[i].T[0].weight,
      tMark: !data[i].T ? " " : `(${data[i].T[0].get}/${data[i].T[0].total})`,
      c:
        !data[i].C || !data[i].C[0].finished
          ? " "
          : (data[i].C[0].get * 100) / data[i].C[0].total,
      cWeight: !data[i].C || !data[i].C[0].finished ? 0 : data[i].C[0].weight,
      cMark: !data[i].C ? " " : `(${data[i].C[0].get}/${data[i].C[0].total})`,
      a:
        !data[i].A || !data[i].A[0].finished
          ? " "
          : (data[i].A[0].get * 100) / data[i].A[0].total,
      aWeight: !data[i].A || !data[i].A[0].finished ? 0 : data[i].A[0].weight,
      aMark: !data[i].A ? " " : `(${data[i].A[0].get}/${data[i].A[0].total})`,
      o:
        !data[i].O || !data[i].O[0].finished
          ? " "
          : (data[i].O[0].get * 100) / data[i].O[0].total,
      oWeight: !data[i].O || !data[i].O[0].finished ? 0 : data[i].O[0].weight,
      oMark: !data[i].O ? " " : `(${data[i].O[0].get}/${data[i].O[0].total})`,
      f:
        !data[i].F || !data[i].F[0].finished
          ? " "
          : (data[i].F[0].get * 100) / data[i].F[0].total,
      fWeight: !data[i].F || !data[i].F[0].finished ? 0 : data[i].F[0].weight,
      fMark: !data[i].F ? " " : `(${data[i].F[0].get}/${data[i].F[0].total})`,
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

function DisplayScreen(
  code,
  block,
  room,
  name,
  overall_mark,
  assignments,
  weight_table,
  start_time,
  end_time,
  cached,
  check
) {
  let content = parseAssignments(assignments, weight_table);
  switch (check) {
    case 0:
      return (
        <AssessmentsScreen
          content={content}
          overall_mark={overall_mark}
          weight_table={weight_table}
          cached={cached}
        />
      );
    case 1:
      return (
        <StatisticsScreen
          assignments={content}
          mark={overall_mark}
          weight_table={weight_table}
        />
      );
    case 2:
      return (
        <AboutScreen
          code={code}
          block={block}
          room={room}
          name={name}
          start_time={start_time}
          end_time={end_time}
        />
      );
    default:
      return null;
  }
}
export default function Details({ route }) {
  const { colors } = useTheme();
  let {
    code,
    block,
    room,
    name,
    overall_mark,
    assignments,
    weight_table,
    start_time,
    end_time,
    cached,
  } = route.params;
  code = code === null ? "Unknown Code" : code;
  block = block === null ? "Unknown block" : block;
  room = room === null ? "Unknown Room" : room;
  name = name === null ? "Unnamed Course" : name;
  start_time = start_time === null ? "Unknown Time" : start_time;
  end_time = end_time === null ? "Unknown Time" : end_time;
  cached = cached === undefined ? false : cached;

  //toggle options
  const [isEnabled, setIsEnabled] = useState(0);

  const options = [
    { label: "Assessments", value: 0 },
    { label: "Statistics", value: 1 },
    { label: "Details", value: 2 },
  ];

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <KeyboardAvoidingView
        behavior={Device.osName === "iOS" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={GENERAL_STYLES(colors).scrollview}>
            <View style={GENERAL_STYLES(colors).container}>
              <BackHeader header={name} subtitle={code} colors={colors} />
              <SwitchSelector
                options={options}
                initial={0}
                textStyle={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 11.5,
                }}
                selectedTextStyle={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 11.5,
                }}
                textColor={colors.Subtitle}
                selectedColor={colors.Primary1}
                buttonColor={colors.Selected}
                backgroundColor={colors.SwitchBg}
                borderColor={colors.Border}
                borderWidth={1}
                hasPadding
                style={{ width: "90%", marginBottom: 10 }}
                onPress={(value) => {
                  setIsEnabled(value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                animationDuration={300}
              />
            </View>
            {DisplayScreen(
              code,
              block,
              room,
              name,
              overall_mark,
              assignments,
              weight_table,
              start_time,
              end_time,
              cached,
              isEnabled
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
