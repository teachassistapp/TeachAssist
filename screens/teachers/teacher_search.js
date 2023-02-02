import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../globals/theme";
import TeacherResults from "./teacher_results";
import SkeletonTeacherLoading from "../../components/skeletonTeacherLoading";
import { FontAwesome } from "@expo/vector-icons";

import { handleFetchError } from "../../globals/alert";
import { GENERAL_STYLES } from "../../globals/styles";

const filterTeachers = (teachers) => {
  let validTeachers = [];
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].status.includes("Good Standing")) {
      validTeachers.push(teachers[i]);
    }
  }
  return validTeachers;
};

const parseResults = (res) => {
  if (res.length === 0) {
    return "NONE";
  }
  if (Array.isArray(res)) {
    let parsed = [];
    res.forEach((t) => {
      let name = t.phoenix_firstname;
      if (t.phoenix_middlename) {
        name += " " + t.phoenix_middlename;
      }
      name += " " + t.phoenix_surname;
      parsed.push({
        id: t.phoenix_regid,
        name: name,
        status: t.phoenix_fullstatusdescriptionml,
      });
    });
    return parsed;
  } else {
    return res;
  }
};

export default function TeacherSearch({ navigation }) {
  const { colors } = useTheme();
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [valid, setValid] = useState(null);
  const [error, setError] = useState(false);

  const navigateScreens = (res) => {
    if (res === "NONE") {
      setResults(res);
      return;
    }
    if (res.length === 1) {
      navigation.navigate("Teacher Details", {
        id: res[0].id,
        name: res[0].name,
        status: res[0].status,
      });
    }
    setResults(res);
    setValid(filterTeachers(res));
  };
  // sends api req
  const searchTeacher = () => {
    if (teacherName.length < 3) {
      setError(true);
      return;
    }
    if (loading) return;
    setError(false);
    setResults(null);
    setLoading(true);
    var requestOptions = {
      method: "GET",
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      Host: "apps.oct.ca",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
    };

    fetch(
      `https://apps.oct.ca/FindATeacherWebApiWrapper/api/publicregister/search?parameter=${teacherName.replaceAll(
        " ",
        "%20"
      )}&csid=f41uk_O3QGF1Mo0.tf_sTdl_EUedR6pksz`,
      requestOptions
    )
      .then((response) =>
        response
          .json()
          .then((result) => {
            navigateScreens(parseResults(result.value));
            setLoading(false);
          })
          .catch((e) => {
            throw e;
          })
      )
      .catch((e) => {
        console.log("error", e);
        setLoading(false);
      });

    // fetch(
    //   "https://oct-api.herokuapp.com/fetch-teacher?teacher=" +
    //     teacherName.replace(" ", "%20"),
    //   requestOptions
    // )
    //   .then((response) => response.text())
    //   .then((result) => {
    //     navigateScreens(result);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     handleFetchError();
    //     setLoading(false);
    //   });
  };

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View style={GENERAL_STYLES(colors).header}>
            <Text style={GENERAL_STYLES(colors).headerTitle}>Teachers</Text>
            <Text style={GENERAL_STYLES(colors).p}>Find Teachers</Text>
          </View>
          <View style={styles(colors).inputContainer}>
            <TextInput
              style={styles(colors).input}
              onChangeText={setTeacherName}
              value={teacherName}
              placeholder={"Search"}
              placeholderTextColor={colors.Placeholder}
              multiline={false}
              autoCorrect={false}
              maxLength={30}
              onSubmitEditing={() => searchTeacher()}
            />
            <TouchableOpacity
              style={styles(colors).icon}
              onPress={() => {
                searchTeacher();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <FontAwesome
                name="search"
                size={20}
                color={colors.Primary1}
                style={{ paddingBottom: 7 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {loading && (
          <>
            <SkeletonTeacherLoading />
          </>
        )}
        {error && (
          <View style={styles(colors).errorContainer}>
            <Text style={styles(colors).errorMessage}>
              Name must be at least 3 letters long.
            </Text>
          </View>
        )}
        {!results && !loading && (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={[
                GENERAL_STYLES(colors).p,
                {
                  color: colors.Subtitle,
                  textAlign: "center",
                  maxWidth: "85%",
                },
              ]}
            >
              (e.g. "Jennifer Wong")
            </Text>
          </View>
        )}
        {results === "NONE" ? (
          <View style={styles(colors).errorContainer}>
            <Text style={styles(colors).errorMessage}>No matches found.</Text>
          </View>
        ) : (
          results && (
            <>
              <TeacherResults
                data={results}
                valid={valid}
                navigation={navigation}
                colors={colors}
                actives={true}
              />
              <Text style={styles(colors).greenText}>
                Teacher not listed here? Try searching a full name!
              </Text>
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    inputContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "flex-end",
      width: "90%",
      height: 50,
      paddingLeft: 14,
      borderWidth: 1,
      borderColor: colors.Border,
      borderRadius: 15,
      marginTop: 5,
      marginBottom: 15,
      backgroundColor: colors.Container,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    input: {
      flex: 11,
      height: 50,
      paddingVertical: 0,
      paddingLeft: 2,
      paddingTop: 5,
      fontSize: 14,
      color: colors.Header,
      fontFamily: "Poppins_500Medium",
      textAlignVertical: "center",
    },
    icon: {
      flex: 1,
      paddingRight: 10,
      paddingTop: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    h: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Header,
      textAlign: "center",
      width: "90%",
      alignSelf: "center",
    },
    greenText: {
      fontSize: 13,
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      width: 0.8 * vw,
      marginTop: 20,
      fontFamily: "Poppins_400Regular",
      color: colors.Primary1,
    },
    hRule: {
      borderBottomColor: colors.Border,
      borderBottomWidth: 1,
      marginVertical: 25,
      alignSelf: "center",
      width: "80%",
    },
    errorContainer: {
      width: 0.9 * vw,
      alignSelf: "center",
      alignItems: "center",
    },
    errorMessage: {
      fontFamily: "Poppins_500Medium",
      color: colors.Red,
      marginVertical: 15,
      fontSize: 15,
    },
    skeletonTeacher: {
      alignSelf: "center",
      width: "88%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
