import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import SwitchSelector from "react-native-switch-selector";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import ProgressBar from "../../components/progressBar";
import { DisplayProgress } from "../../components/charts";
import { ThemeContext } from "../../globals/theme";

import { calculateCourseAverage } from "../../globals/calculators";
import { parseAssignments } from "../../components/displayMarkUpdates";
import { handleFetchError } from "../../globals/alert";
import { test_course_data } from "../../data/test";
import { TEST_PASS, TEST_USER } from "../../data/keys";
import { ASSIGNMENT_STYLES, GENERAL_STYLES } from "../../globals/styles";
import { lightColors, darkColors } from "../../globals/colors";

function DisplayCourse({
  breakdown,
  code,
  block,
  room,
  name,
  overall_mark,
  isFinal,
  isMidterm,
  assignments,
  weight_table,
  k,
  t,
  c,
  a,
  start_time,
  end_time,
  cached,
  index,
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();

  if (k === "null") {
    k = 0;
  }
  if (t === "null") {
    t = 0;
  }
  if (c === "null") {
    c = 0;
  }
  if (a === "null") {
    a = 0;
  }
  const categories = [k, t, c, a];
  const labels = ["K", "T", "C", "A"];
  const bar_colors = [
    colors.Primary2,
    colors.Primary1,
    colors.Primary2,
    colors.Primary1,
  ];
  const displayMethod =
    breakdown === true ? (
      <View
        style={ASSIGNMENT_STYLES(colors).assignmentBarChart}
        key={index + "Breakdown"}
      >
        {categories.map((cat, i) => {
          return (
            <View
              style={ASSIGNMENT_STYLES(colors).assignmentBar}
              key={String(i)}
            >
              <Text style={styles(colors).barLabelsText}>
                {cat ? Math.round(cat) : " "}
              </Text>
              <View style={ASSIGNMENT_STYLES(colors).progressBar}>
                <ProgressBar
                  progress={cat}
                  height={8}
                  trackColor={colors.GraphBackground}
                  backgroundColor={bar_colors[i]}
                />
              </View>
              <Text style={styles(colors).barLabelsText}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
    ) : (
      <AnimatedCircularProgress
        size={Dimensions.get("window").width < 300 ? 70 : 90}
        width={Dimensions.get("window").width < 300 ? 7 : 9}
        fill={overall_mark === "N/A" ? 0 : overall_mark}
        tintColorSecondary={colors.Primary1}
        tintColor={colors.Primary2}
        backgroundColor={colors.GraphBackground}
        rotation={0}
        duration={800}
        key={index + "CircleProgress"}
      >
        {() => (
          <Text style={styles(colors).marks} key={index + "CircleProgressText"}>
            {overall_mark === "N/A"
              ? "N/A"
              : overall_mark === 100
              ? "100%"
              : overall_mark.toFixed(1) + "%"}
          </Text>
        )}
      </AnimatedCircularProgress>
    );

  return (
    <TouchableOpacity
      style={{
        ...GENERAL_STYLES(colors).div,
        flexDirection: "row",
        minHeight: 125,
        paddingHorizontal: 17,
        paddingVertical: 15,
        margin: 5,
      }}
      onPress={() => {
        navigation.navigate("Details", {
          code: code,
          block: block,
          room: room,
          name: name,
          overall_mark: overall_mark,
          assignments: assignments,
          weight_table: weight_table,
          start_time: start_time,
          end_time: end_time,
          cached: cached,
        });
      }}
    >
      <View style={{ maxWidth: "55%" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles(colors).title}>{code}</Text>
          {cached && (
            <View style={styles(colors).cachedContainer}>
              <AntDesign
                name="exclamationcircleo"
                size={17}
                color={colors.Subtitle}
              />
            </View>
          )}
        </View>
        <Text style={styles(colors).subtitle}>
          Period {block} — Room {room}
        </Text>
        <Text style={styles(colors).subtitle}>{name}</Text>
        {isFinal ? (
          <Text style={styles(colors).markType}>Final</Text>
        ) : (
          isMidterm && <Text style={styles(colors).markType}>Midterm</Text>
        )}
      </View>
      {displayMethod}
    </TouchableOpacity>
  );
}

export default function Home({ navigation }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const [isEnabled, setIsEnabled] = useState(true);
  const [data, setData] = useState([]);
  const [stored, setStored] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [notifs, setNotifs] = useState({
    isNotifs: false,
    current: [],
    updated: [],
  });
  const options = [
    { label: "Average", value: 0 },
    { label: "Breakdown", value: 1 },
  ];

  const checkNull = (oldData, newData) => {
    if (oldData !== null) {
      for (let i = 0; i < newData.length; i++) {
        const oldCourse = oldData.find((a) => a.code === newData[i].code);
        if (newData[i].assignments.length === 0) {
          if (oldCourse !== undefined) {
            if (oldCourse.assignments.length !== 0) {
              newData[i] = oldCourse;
            }
            newData[i].cached = true;
          }
        } else {
          newData[i].cached = false;
        }
      }
    }
    return newData;
  };

  const initScheme = async () => {
    try {
      const storedScheme = await AsyncStorage.getItem("scheme");
      if (!storedScheme) {
        if (scheme === "dark") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } else {
        setTheme(storedScheme);
      }
    } catch {}
  };

  const storeData = async (datum) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(datum));
      setStored(datum);
    } catch (error) {
      Alert.alert("Failed to store data.");
    }
  };

  const retrieveData = async () => {
    try {
      const number = await AsyncStorage.getItem("number");
      const password = await AsyncStorage.getItem("password");
      if (number === TEST_USER && password === TEST_PASS) {
        setStored(test_course_data);
        setData(test_course_data);
      } else {
        let datum = await AsyncStorage.getItem("data");
        datum = JSON.parse(datum);
        if (datum) {
          setStored(datum);
          setData(datum);
          setLoading(false);
          setNotifs({
            isNotifs: notifs.isNotifs,
            current: datum,
            updated: datum,
          });
          getMarks(datum, number, password);
        } else {
          getMarks([], number, password);
        }
      }
    } catch {
      Alert.alert("Failed to load data.");
    }
  };

  const getMarks = (stored, number, password) => {
    if (loading || refreshing) return;
    setLoading(true);
    if (number !== null && password !== null) {
      var requestOptions = {
        headers: {
          "content-type": "application/json",
        },
        body: `{"username":"${number}","password":"${password}"}`,
        method: "POST",
      };

      fetch("https://ta-api.vercel.app/api/getCourses", requestOptions)
        .then((response) => {
          const status = response.status;
          if (status === 200) {
            response
              .json()
              .then((datum) => {
                datum = datum.response;
                datum = checkNull(stored, datum);
                if (JSON.stringify(datum) !== JSON.stringify(stored)) {
                  setNotifs({
                    isNotifs: true,
                    current: stored,
                    updated: datum,
                  });
                  setData(datum);
                  storeData(datum);
                } else {
                  setNotifs({
                    isNotifs: false,
                    current: stored,
                    updated: datum,
                  });
                }
              })
              .catch((err) => {});
          } else {
            handleFetchError();
          }
          setLoading(false);
          setRefreshing(false);
        })
        .catch(() => {
          setLoading(false);
          setRefreshing(false);
          handleFetchError();
        });
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      const number = await AsyncStorage.getItem("number");
      const password = await AsyncStorage.getItem("password");
      if (number !== TEST_USER && password !== TEST_PASS) {
        setRefreshing(true);
        getMarks(stored, number, password);
      } else {
        setStored(test_course_data);
        setData(test_course_data);
      }
    } catch {
      Alert.alert("Failed to refresh.", "Please try again later.");
    }
  });

  useEffect(() => {
    const reLogIn = navigation.addListener("focus", () => {
      initScheme();
      retrieveData();
    });
    return reLogIn;
  }, [navigation]);

  let displayAverage = []; //format average course data
  let displayBreakdown = []; //format breakdown of course data
  let averages = [];
  for (let i = 0; i < data.length; i++) {
    let code = !data[i].code ? "Unknown Code" : data[i].code;
    let block = !data[i].block ? "Unknown Period" : data[i].block;
    let room = !data[i].room ? "Unknown Room" : data[i].room;
    let name = !data[i].name ? "Unnamed Course" : data[i].name;

    let weight_table_exists =
      data[i].weight_table && Object.keys(data[i].weight_table).length !== 0;
    let k = weight_table_exists ? data[i].weight_table.KU.SA : "null";
    let t = weight_table_exists ? data[i].weight_table.T.SA : "null";
    let c = weight_table_exists ? data[i].weight_table.C.SA : "null";
    let a = weight_table_exists ? data[i].weight_table.A.SA : "null";
    let overall = data[i].overall_mark;
    if (
      overall == "N/A" &&
      weight_table_exists &&
      data[i].assignments.length > 0
    ) {
      const parsed = parseAssignments(
        data[i].assignments,
        data[i].weight_table
      );
      if (parsed.length > 0) {
        overall = calculateCourseAverage(parsed);
      }
    }
    let isFinal = data[i].isFinal ? data[i].isFinal : false;
    let isMidterm = data[i].isMidterm ? data[i].isMidterm : false;
    let weight_table = weight_table_exists ? data[i].weight_table : {};
    let assignments = data[i].assignments === [] ? "null" : data[i].assignments;
    let start_time = data[i].start_time;
    let end_time = data[i].end_time;
    let cached =
      data[i].cached === undefined
        ? data[i].assignments === []
        : data[i].cached;
    if (overall != "N/A") {
      averages.push(overall);
    }
    displayAverage.push(
      <DisplayCourse
        breakdown={false}
        code={code}
        block={block}
        room={room}
        name={name}
        overall_mark={overall}
        assignments={assignments}
        weight_table={weight_table}
        isFinal={isFinal}
        isMidterm={isMidterm}
        start_time={start_time}
        end_time={end_time}
        cached={cached}
        key={code + "_average_" + String(i)}
        index={String(i)}
      />
    );
    displayBreakdown.push(
      <DisplayCourse
        breakdown={true}
        code={code}
        block={block}
        room={room}
        name={name}
        k={k}
        t={t}
        c={c}
        a={a}
        overall_mark={overall}
        isFinal={isFinal}
        isMidterm={isMidterm}
        assignments={assignments}
        weight_table={weight_table}
        start_time={start_time}
        end_time={end_time}
        cached={cached}
        key={code + "_breakdown_" + String(i)}
        index={String(i)}
      />
    );
  }

  let partMark = [];
  averages.forEach((value) => partMark.push(value / averages.length));
  let averageOverall =
    Math.round(partMark.reduce((a, b) => a + b, 0) * 10) / 10;
  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView
        style={GENERAL_STYLES(colors).scrollview}
        alwaysBounceVertical={"true"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ ...GENERAL_STYLES(colors).container, paddingTop: 16 }}>
          <View style={styles(colors).headerIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Websites")}
              hitSlop={{
                top: 20,
                bottom: 50,
                left: 20,
                right: 50,
              }}
            >
              <MaterialCommunityIcons
                name="web"
                size={26}
                color={colors.Primary1}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notifications", notifs);
              }}
              style={{
                flexDirection: "row",
                width: 26,
              }}
              hitSlop={{
                top: 20,
                bottom: 50,
                left: 50,
                right: 20,
              }}
            >
              <Ionicons
                name="notifications"
                size={26}
                color={colors.Primary1}
              />
              {notifs.isNotifs && (
                <View style={styles(colors).notifActive1}>
                  <View style={styles(colors).notifActive2} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <DisplayProgress value={averageOverall} subtitle="Average" />
          <SwitchSelector
            options={options}
            initial={0}
            textStyle={{ fontFamily: "Poppins_500Medium" }}
            selectedTextStyle={{
              fontFamily: "Poppins_600SemiBold",
            }}
            textColor={colors.Subtitle}
            selectedColor={colors.Primary1}
            buttonColor={colors.Selected}
            backgroundColor={colors.SwitchBg}
            borderColor={colors.Border}
            borderWidth={1}
            hasPadding
            style={{ width: "65%", marginTop: 1, marginBottom: 17 }}
            animationDuration={300}
            onPress={(e) => {
              setIsEnabled(!e);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
          {loading && !data && (
            <ActivityIndicator
              size="large"
              style={{ marginTop: 20, marginBottom: 30 }}
              color={colors.Primary1}
            />
          )}
          <View style={GENERAL_STYLES(colors).blockContainer}>
            {isEnabled ? displayAverage : displayBreakdown}
          </View>
        </View>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    headerIcons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: -24,
      width: "100%",
      paddingLeft: 23,
      paddingRight: 23,
    },
    notifActive1: {
      position: "relative",
      width: 12,
      height: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.Background,
      borderRadius: 6,
      left: -11,
    },
    notifActive2: {
      position: "relative",
      width: 7,
      height: 7,
      backgroundColor: colors.Red,
      borderRadius: 3.5,
    },
    title: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: vw < 300 ? 16 : 20,
      color: colors.Header,
      position: "relative",
      top: -3,
    },
    cachedContainer: {
      height: 20,
      width: 20,
      marginLeft: 10,
      marginTop: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      fontFamily: "Poppins_400Regular",
      fontSize: vw < 300 ? 12 : 13,
      color: colors.Subtitle,
    },
    markType: {
      fontFamily: "Poppins_600SemiBold",
      textTransform: "uppercase",
      fontSize: vw < 300 ? 14 : 16,
      color: colors.Primary1,
    },
    marks: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: vw < 300 ? 13 : 15,
      color: colors.Header,
      top: 1,
    },
    barLabelsText: {
      fontSize: 10,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      alignSelf: "center",
    },
  });
