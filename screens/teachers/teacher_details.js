import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../globals/theme";
import { FontAwesome } from "@expo/vector-icons";
import { handleFetchError } from "../../globals/alert";
import AnimatedCollapsible from "../../components/AnimatedCollapsible"; //add this
import SkeletonTeacherDetails from "../../components/skeletonTeacherDetails";
import { GENERAL_STYLES } from "../../globals/styles";

function parseData(data) {
  const keys = ["degrees", "education", "qualifications"];
  const properties = [
    "Qualifications",
    "Teacher Education",
    "Teacher Qualifications",
  ];
  let content = [];
  for (let i = 0; i < 3; i++) {
    content.push({ property: properties[i], content: data[keys[i]] });
  }
  return content;
}

export default function TeacherDetails({ route, navigation }) {
  const { colors } = useTheme();
  let { id, data, name, status, isStarred, starrable } = route.params;
  name = name.toLowerCase();
  const [starred, setStarred] = useState(isStarred);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(data);
  const storeData = async (tc, stored) => {
    try {
      if (
        stored.filter((t) => {
          t.id === tc.id;
        }).length === 0
      ) {
        await AsyncStorage.setItem("teacher", JSON.stringify(tc));
      }
    } catch {
      Alert.alert("Failed to store data.");
    }
  };

  const onLoad = async (id, result, starred) => {
    try {
      let datum = await AsyncStorage.getItem("teacher");
      datum = JSON.parse(datum);
      if (starred) {
        let newTeachers = [];
        let thisTeacher;
        for (let i = 0; i < datum.length; i++) {
          if (datum[i].id !== id) {
            newTeachers.push(datum[i]);
          } else {
            thisTeacher = datum[i];
          }
        }
        thisTeacher.raw_data = { ...result };
        newTeachers.push(thisTeacher);
        setRes(result);
        storeData(newTeachers, datum);
      }
    } catch (e) {
      Alert.alert("Failed to load saved teachers.");
    }
  };

  const handleStar = async () => {
    try {
      let datum = await AsyncStorage.getItem("teacher");
      if (datum === null) {
        datum = [];
      } else {
        datum = JSON.parse(datum);
      }
      let newTeachers = [...datum];
      if (!starred) {
        //starred
        let newTeacher = {
          id: id,
          name: name,
          raw_data: { ...data },
          status: status,
        };
        newTeachers.push(newTeacher);
      } else {
        //unstarred
        newTeachers = newTeachers.filter((t) => {
          return t.id !== data.id;
        });
      }
      setStarred(!starred);
      storeData(newTeachers, datum);
    } catch (e) {
      Alert.alert("Failed to save teacher.");
    }
  };

  const checkStarredData = async (id) => {
    try {
      let datum = await AsyncStorage.getItem("teacher");
      datum = JSON.parse(datum);
      let thisTeacher = datum.find((t) => {
        return t.id === id;
      });
      if (thisTeacher.raw_data) {
        setRes(thisTeacher.raw_data);
      } else {
        getTeacherData();
      }
    } catch (e) {
      Alert.alert("Failed to load stored teachers.");
    }
  };
  const getTeacherData = () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://oct-api.herokuapp.com/fetch-teacher-id?id=" + id,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setRes(result);
        onLoad(id, result, starred);
        setLoading(false);
      })
      .catch((error) => {
        handleFetchError();
        setLoading(false);
      });
  };

  useEffect(() => {
    if (starred) {
      checkStarredData(id);
    } else if (!data) {
      getTeacherData();
    }
  }, []);

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View
            style={{
              ...GENERAL_STYLES(colors).header,
              flexDirection: "row",
              paddingTop: 20,
              marginBottom: 29,
              paddingHorizontal: 27,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("Teacher Search")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome
                name="chevron-left"
                size={24}
                color={colors.Primary1}
              />
            </TouchableOpacity>
            <Text
              style={{
                ...GENERAL_STYLES(colors).headerTitle,
                textTransform: "capitalize",
                flex: 8,
              }}
            >
              {name}
            </Text>
            {starrable ? (
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center" }}
                onPress={() => handleStar()}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {starred ? (
                  <FontAwesome name="star" size={24} color={colors.Subtitle} />
                ) : (
                  <FontAwesome
                    name="star-o"
                    size={24}
                    color={colors.Subtitle}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          {loading && <SkeletonTeacherDetails />}
          {res && (
            <View>
              <View
                style={[
                  GENERAL_STYLES(colors).div,
                  styles(colors).generalContainer,
                ]}
              >
                <View style={styles(colors).generalInfo}>
                  <Text style={styles(colors).generalText}>
                    Registration #:{" "}
                  </Text>
                  <Text
                    style={[
                      styles(colors).generalText,
                      { fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    {res.registration_number}
                  </Text>
                </View>
                <View style={styles(colors).generalInfo}>
                  <Text style={styles(colors).generalText}>
                    Status:{" "}
                    {status.includes("Good Standing") ? (
                      <Text
                        style={[
                          styles(colors).generalText,
                          {
                            fontFamily: "Poppins_600SemiBold",
                            color: colors.Primary1,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles(colors).generalText,
                          {
                            fontFamily: "Poppins_600SemiBold",
                            color: colors.Red,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    )}
                  </Text>
                </View>
                <View style={styles(colors).generalInfo}>
                  <Text style={styles(colors).generalText}>Date Issued: </Text>
                  <Text
                    style={[
                      styles(colors).generalText,
                      { fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    {res.date}
                  </Text>
                </View>
              </View>
              <View>
                {parseData(res).map((d, i) => {
                  if (d.content.length > 0) {
                    return (
                      <AnimatedCollapsible
                        header={d.property}
                        description={d.content.map((e, i) => {
                          return (
                            <View key={String(i)}>
                              <Text
                                style={[
                                  GENERAL_STYLES(colors).p,
                                  styles(colors).p,
                                ]}
                              >
                                {e.slice(0, e.indexOf("/") + 1).trim()}
                                <Text
                                  style={{
                                    ...GENERAL_STYLES(colors).p,
                                    ...styles(colors).p,
                                    fontFamily: "Poppins_600SemiBold",
                                  }}
                                >
                                  {e.slice(e.indexOf("/") + 1)}
                                </Text>
                              </Text>
                            </View>
                          );
                        })}
                        colors={colors}
                        key={String(i)}
                      />
                    );
                  }
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    generalContainer: {
      minHeight: 126,
      color: colors.Header,
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 17,
      paddingVertical: 12,
      margin: 5,
      marginBottom: 24,
    },
    generalInfo: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    generalText: {
      fontFamily: "Poppins_500Medium",
      color: colors.Header,
      fontSize: 16,
      flexWrap: "wrap",
    },
    p: {
      fontSize: 14,
      marginVertical: 4,
    },
  });
