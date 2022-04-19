import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../globals/theme";
import TeacherResults from "./teacher_results";

import { handleFetchError } from "../../globals/alert";

const filterTeachers = (teachers) => {
  let validTeachers = [];
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].status.includes("Good Standing")) {
      validTeachers.push(teachers[i]);
    }
  }
  return validTeachers;
};

export default function TeacherSearch({ navigation }) {
  const { colors } = useTheme();
  // state for teacher serach val
  const [teacherName, setTeacherName] = useState("");
  const [storedTeachers, setStoredTeachers] = useState([]); //starred teachers
  // loading val
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [valid, setValid] = useState(null);

  const setStoredTeachersChild = (t) => {
    setStoredTeachers(t);
  };

  const retrieveData = async () => {
    try {
      let datum = await AsyncStorage.getItem("teacher");
      datum = JSON.parse(datum);
      if (datum !== null) {
        setStoredTeachers(datum);
      }
    } catch (e) {
      Alert.alert("Failed to load saved teachers.");
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const navigateScreens = (res) => {
    if (res === "NONE") {
      setResults(res);
      return;
    }
    try {
      res = JSON.parse(res);
    } catch (e) {
      handleFetchError();
      return null;
    }
    if (res.length !== 0) {
      if (Array.isArray(res)) {
        setResults(res);
        setValid(filterTeachers(res));
      } else if (typeof res === "object" && res !== null) {
        navigation.navigate("Teacher Details", {
          id: res.registration_number,
          data: res,
          name: res.full_name,
          status: res.status,
          isStarred:
            storedTeachers.filter((t) => {
              return res.full_name === t.name;
            }).length > 0,
          starrable: true,
        });
      }
    }
  };
  // sends api req
  const searchTeacher = () => {
    setResults(null);
    setLoading(true);
    var requestOptions = {
      method: "GET",
    };

    fetch(
      "https://oct-api.herokuapp.com/fetch-teacher?teacher=" +
        teacherName.replace(" ", "%20"),
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        navigateScreens(result);
        setLoading(false);
      })
      .catch((error) => {
        handleFetchError();
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles(colors).safeView}>
      <ScrollView style={styles(colors).scrollView}>
        <View style={styles(colors).container}>
          <View style={styles(colors).header}>
            <Text style={styles(colors).headerTitle}>Teachers</Text>
            <Text style={styles(colors).headerSubtitle}>Find Teachers</Text>
          </View>
          <TextInput
            style={styles(colors).input}
            onChangeText={setTeacherName}
            value={teacherName}
            placeholder={"Search"}
            placeholderTextColor={colors.Placeholder}
            multiline={false}
            autoCorrect={false}
            onSubmitEditing={() => searchTeacher()}
          />
        </View>
        {loading && (
          <>
            <Text style={styles(colors).loadingText}>
              Hold on, this might take a while...
            </Text>
            <ActivityIndicator
              size="large"
              color={colors.Primary1}
              style={{ marginBottom: 30 }}
            />
          </>
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
                storedTeachers={storedTeachers}
                setStoredTeachers={setStoredTeachersChild}
                actives={true}
              />
              <Text style={styles(colors).loadingText}>
                Teacher not listed here? Try searching a full name!
              </Text>
            </>
          )
        )}
        <View style={{ marginBottom: 50 }}>
          <View style={styles(colors).hRule} />
          <Text style={styles(colors).h}>Saved Teachers</Text>
          {storedTeachers && storedTeachers.length > 0 ? (
            <TeacherResults
              data={storedTeachers}
              valid={valid}
              navigation={navigation}
              colors={colors}
              storedTeachers={storedTeachers}
              setStoredTeachers={setStoredTeachersChild}
              actives={false}
            />
          ) : (
            <Text
              style={[styles(colors).p, { textAlign: "center", marginTop: 10 }]}
            >
              No saved teachers
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
      maxWidth: 0.75 * vw,
      textAlign: "center",
    },
    headerSubtitle: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    input: {
      alignSelf: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 15,
      borderWidth: 1,
      width: "90%",
      height: 50,
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 5,
      margin: 5,
      color: colors.Header,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    h: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: colors.Header,
      textAlign: "center",
      width: "90%",
      alignSelf: "center",
    },
    p: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
    },
    loadingText: {
      fontSize: 13,
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      width: 0.8 * vw,
      marginTop: 40,
      marginBottom: 20,
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
      marginTop: 20,
      fontSize: 15,
    },
  });