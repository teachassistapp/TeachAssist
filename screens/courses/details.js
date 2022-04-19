import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import AssessmentsScreen from "./details/assessments";
import StatisticsScreen from "./details/statistics";
import AboutScreen from "./details/about";
import { useTheme } from "../../globals/theme";

function parseAssignments(data, weight_table) {
  let content = [];
  for (let i = 0; i < data.length; i++) {
    content.push({
      title: data[i].name,
      comments: data[i].feedback,
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
        (data[i].KU && data[i].KU[0].finished === false) ||
        (data[i].T && data[i].T[0].finished === false) ||
        (data[i].C && data[i].C[0].finished === false) ||
        (data[i].A && data[i].A[0].finished === false) ||
        (data[i].F && data[i].F[0].finished === false) ||
        (data[i].O && data[i].O[0].finished === false)
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
export default function Details({ route, navigation }) {
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

  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles(colors).safeView}>
        <ScrollView style={styles(colors).scrollView}>
          <View style={styles(colors).container}>
            <TouchableOpacity
              style={styles(colors).headerIcon}
              onPress={() => navigation.goBack()}
              hitSlop={{
                top: 50,
                bottom: 50,
                left: 20,
                right: 50,
              }}
            >
              <FontAwesome
                name="chevron-left"
                size={24}
                color={colors.Primary1}
              />
            </TouchableOpacity>
            <View style={styles(colors).header}>
              <Text style={styles(colors).headerTitle}>{name}</Text>
              <Text style={styles(colors).headerSubtitle}>{code}</Text>
            </View>
            <SwitchSelector
              options={options}
              initial={0}
              textStyle={{ fontFamily: "Poppins_600SemiBold", fontSize: 12 }}
              selectedTextStyle={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
              }}
              textColor={colors.Subtitle}
              selectedColor={colors.Primary1}
              buttonColor={colors.Selected}
              backgroundColor={colors.Container}
              borderColor={colors.Border}
              borderWidth={1}
              hasPadding
              style={{ width: "90%" }}
              onPress={(value) => setIsEnabled(value)}
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
      </SafeAreaView>
    );
  }
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

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
      maxWidth: "70%",
      textAlign: "center",
    },
    headerSubtitle: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    headerIcon: {
      position: "absolute",
      top: 50,
      left: 27,
      zIndex: 2,
    },
  });
