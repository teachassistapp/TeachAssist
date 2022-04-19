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
    <SafeAreaView style={styles(colors).safeView}>
      <ScrollView style={styles(colors).scrollView}>
        <View style={styles(colors).container}>
          <View style={styles(colors).header}>
            <TouchableOpacity
              style={styles(colors).headerIcon}
              onPress={() =>
                navigation.navigate("Teacher Search", {
                  starred: id,
                })
              }
            >
              <FontAwesome
                name="chevron-left"
                size={24}
                color={colors.Primary1}
              />
            </TouchableOpacity>
            <Text style={styles(colors).headerTitle}>{name}</Text>
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
          {loading && (
            <ActivityIndicator
              size="large"
              color={colors.Primary1}
              style={{ marginBottom: 20 }}
            />
          )}
          {res && (
            <View>
              <View
                style={[styles(colors).div, styles(colors).generalContainer]}
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
                      <TeacherSection
                        data={d}
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

function TeacherSection({ data, colors }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={expanded ? styles(colors).div : styles(colors).divCollapse}
      onPress={() => setExpanded(!expanded)}
    >
      <Animatable.View duration={1} style={styles(colors).propertyHeader}>
        <Text style={styles(colors).propertyTitle}>{data.property}</Text>
        {expanded ? (
          <FontAwesome
            name="chevron-up"
            size={20}
            color={colors.Primary1}
            style={{ marginTop: -8 }}
          />
        ) : (
          <FontAwesome
            name="chevron-down"
            size={20}
            color={colors.Primary1}
            style={{ marginTop: -8 }}
          />
        )}
      </Animatable.View>
      <Animatable.View
        duration={expanded ? 300 : 100}
        animation={expanded ? "fadeInDown" : "fadeOutUp"}
        style={styles(colors).expand}
      >
        {data.content.map((e, i) => {
          return (
            <View key={String(i)}>
              <Text style={styles(colors).p}>
                {e.slice(0, e.indexOf("/") + 1).trim()}
                <Text
                  style={[
                    styles(colors).p,
                    { fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  {e.slice(e.indexOf("/") + 1)}
                </Text>
              </Text>
            </View>
          );
        })}
      </Animatable.View>
    </TouchableOpacity>
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
      paddingTop: 5,
      margin: 5,
      marginBottom: 24,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    divCollapse: {
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      width: 0.9 * vw,
      height: 55,
      paddingTop: 5,
      margin: 5,
      marginBottom: 24,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    headerIcon: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 20,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 29,
      paddingHorizontal: 27,
    },
    headerTitle: {
      flex: 8,
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      color: colors.Header,
      maxWidth: "70%",
      textAlign: "center",
      textTransform: "capitalize",
    },
    generalContainer: {
      minHeight: 126,
      color: colors.Header,
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 17,
      paddingTop: 12,
      paddingBottom: 12,
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
    propertyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
      width: 0.8 * vw,
      height: 49,
    },
    propertyTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
    },
    expand: {
      width: "100%",
      paddingTop: 8,
      paddingBottom: 12,
      paddingHorizontal: 17,
      borderTopColor: colors.GraphBackground,
      borderTopWidth: 1,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 14,
      marginVertical: 4,
    },
  });
