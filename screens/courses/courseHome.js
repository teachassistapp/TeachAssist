import React, { useState, useEffect, useCallback } from "react";
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
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import ProgressBar from "../../components/ProgressBar";
import { useTheme } from "../../globals/theme";

import { handleFetchError } from "../../globals/alert";
import { test_course_data } from "../../data/test";
import { TEST_PASS, TEST_USER } from "../../data/keys";
import { ASSIGNMENT_STYLES, GENERAL_STYLES } from "../../globals/styles";

function DisplayCourse({
  breakdown,
  code,
  block,
  room,
  name,
  overall_mark,
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
  const { colors } = useTheme();
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
  const displayMethod =
    breakdown === true ? (
      <View
        style={ASSIGNMENT_STYLES(colors).assignmentBarChart}
        key={index + "Breakdown"}
      >
        <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
          <Text style={styles(colors).barLabelsText}>
            {k ? Math.round(k) : " "}
          </Text>
          <View style={ASSIGNMENT_STYLES(colors).progressBar}>
            <ProgressBar
              progress={k}
              height={8}
              trackColor={colors.GraphBackground}
              backgroundColor={colors.Primary2}
            />
          </View>
          <Text style={styles(colors).barLabelsText}>K</Text>
        </View>
        <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
          <Text style={styles(colors).barLabelsText}>
            {t ? Math.round(t) : " "}
          </Text>
          <View style={ASSIGNMENT_STYLES(colors).progressBar}>
            <ProgressBar
              progress={t}
              height={8}
              trackColor={colors.GraphBackground}
              backgroundColor={colors.Primary1}
            />
          </View>
          <Text style={styles(colors).barLabelsText}>T</Text>
        </View>
        <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
          <Text style={styles(colors).barLabelsText}>
            {c ? Math.round(c) : " "}
          </Text>
          <View style={ASSIGNMENT_STYLES(colors).progressBar}>
            <ProgressBar
              progress={c}
              height={8}
              trackColor={colors.GraphBackground}
              backgroundColor={colors.Primary2}
            />
          </View>
          <Text style={styles(colors).barLabelsText}>C</Text>
        </View>
        <View style={ASSIGNMENT_STYLES(colors).assignmentBar}>
          <Text style={styles(colors).barLabelsText}>
            {a ? Math.round(a) : " "}
          </Text>
          <View style={ASSIGNMENT_STYLES(colors).progressBar}>
            <ProgressBar
              progress={a}
              height={8}
              trackColor={colors.GraphBackground}
              backgroundColor={colors.Primary1}
            />
          </View>
          <Text style={styles(colors).barLabelsText}>A</Text>
        </View>
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
        {(fill) => (
          <Text style={styles(colors).marks} key={index + "CircleProgressText"}>
            {overall_mark === "N/A" ? "N/A" : overall_mark.toString() + "%"}
          </Text>
        )}
      </AnimatedCircularProgress>
    );

  const navigation = useNavigation();
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
      </View>
      {displayMethod}
    </TouchableOpacity>
  );
}

export default function Home() {
  const { isDark, colors } = useTheme();
  const navigation = useNavigation();
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
      if (number == TEST_USER && password == TEST_PASS) {
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
    setLoading(true);
    if (number !== null && password !== null) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        number: number,
        password: password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch(
        "https://api.pegasis.site/public/yrdsb_ta/getmark_v2",
        requestOptions
      )
        .then((response) => {
          const status = response.status;
          if (status === 200) {
            response.json().then((datum) => {
              datum = checkNull(stored, datum);
              if (JSON.stringify(datum) !== JSON.stringify(stored)) {
                setNotifs({ isNotifs: true, current: stored, updated: datum });
                setData(datum);
                storeData(datum);
              } else {
                setNotifs({ isNotifs: false, current: stored, updated: datum });
              }
            });
          } else {
            handleFetchError();
          }
        })
        .catch((error) => {
          handleFetchError();
        });
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      const number = await AsyncStorage.getItem("number");
      const password = await AsyncStorage.getItem("password");
      if (number != TEST_USER && password != TEST_PASS) {
        setRefreshing(true);
        getMarks(stored, number, password);
      }
    } catch {
      Alert.alert("Failed to refresh.", "Please try again later.");
    }
  });

  const handleToggle = (x) => {
    if (x) {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  };
  useEffect(() => {
    retrieveData();
  }, []);

  let displayAverage = []; //format average course data
  let displayBreakdown = []; //format breakdown of course data
  let averages = [];
  for (let i = 0; i < data.length; i++) {
    let code = data[i].code === null ? "Unknown Code" : data[i].code;
    let block = data[i].block === null ? "Unknown Period" : data[i].block;
    let room = data[i].room === null ? "Unknown Room" : data[i].room;
    let name = data[i].name === null ? "Unnamed Course" : data[i].name;
    let k = data[i].weight_table === null ? "null" : data[i].weight_table.KU.SA;
    let t = data[i].weight_table === null ? "null" : data[i].weight_table.T.SA;
    let c = data[i].weight_table === null ? "null" : data[i].weight_table.C.SA;
    let a = data[i].weight_table === null ? "null" : data[i].weight_table.A.SA;
    let overall =
      data[i].overall_mark === null
        ? "N/A"
        : Math.round(data[i].overall_mark * 10) / 10;
    let weight_table =
      data[i].weight_table === null ? "null" : data[i].weight_table;
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
        <View style={GENERAL_STYLES(colors).container}>
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
          <AnimatedCircularProgress
            size={178}
            width={14.5}
            fill={averageOverall}
            tintColorSecondary={colors.Primary1}
            tintColor={colors.Primary2}
            backgroundColor={colors.GraphBackground}
            rotation={0}
            duration={800}
          >
            {() => (
              <>
                <Text style={styles(colors).progressMark}>
                  {averageOverall}%
                </Text>
                <Text style={styles(colors).progressLabel}>Average</Text>
              </>
            )}
          </AnimatedCircularProgress>
          <SwitchSelector
            options={options}
            initial={0}
            textStyle={{ fontFamily: "Poppins_500Medium" }}
            selectedTextStyle={{ fontFamily: "Poppins_600SemiBold" }}
            textColor={colors.Subtitle}
            selectedColor={colors.Primary1}
            buttonColor={colors.Selected}
            backgroundColor={colors.Container}
            borderColor={colors.Border}
            borderWidth={1}
            hasPadding
            style={{ width: "65%", marginTop: 20 }}
            animationDuration={300}
            onPress={(event) => {
              handleToggle(event);
            }}
          />
          {loading && (
            <ActivityIndicator
              size="large"
              style={{ marginTop: 40 }}
              color={colors.Primary1}
            />
          )}
          <View style={GENERAL_STYLES(colors).blockContainer}>
            <Text>{isEnabled}</Text>
            {isEnabled ? displayAverage : displayBreakdown}
          </View>
          <ExpoStatusBar style={isDark ? "light" : "dark"} />
        </View>
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
    progressMark: {
      position: "relative",
      fontFamily: "Poppins_700Bold",
      fontSize: 28,
      top: 10,
      color: colors.Header,
    },
    progressLabel: {
      position: "relative",
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
      top: 0,
      color: colors.Subtitle,
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
      marginTop: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      fontFamily: "Poppins_400Regular",
      fontSize: vw < 300 ? 12 : 13,
      color: colors.Subtitle,
    },
    marks: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: vw < 300 ? 14 : 16,
      color: colors.Header,
    },
    barLabelsText: {
      fontSize: 10,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      alignSelf: "center",
    },
  });
