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

export default function TeacherSearch({ navigation }) {
  const { colors } = useTheme();
  // state for teacher serach val
  const [teacherName, setTeacherName] = useState("");
  const [storedTeachers, setStoredTeachers] = useState([]); //starred teachers
  // loading val
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [valid, setValid] = useState(null);
  const [error, setError] = useState(false);
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
    if (teacherName.length < 3) {
      setError(true);
      return;
    }
    setError(false);
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
      .catch((e) => {
        handleFetchError();
        setLoading(false);
      });
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
              onPress={() => searchTeacher()}
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
                storedTeachers={storedTeachers}
                setStoredTeachers={setStoredTeachersChild}
                actives={true}
              />
              <Text style={styles(colors).greenText}>
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
              style={[
                GENERAL_STYLES(colors).p,
                { textAlign: "center", marginTop: 10 },
              ]}
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
