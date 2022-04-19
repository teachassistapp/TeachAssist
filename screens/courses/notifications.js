import React, { useState, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import DisplayMarkUpdates from "../../components/DisplayMarkUpdates";
import { useTheme } from "../../globals/theme";

function join_arrays(a1, a2) {
  let combined_array = [];
  const arr1 = a1.length > a2.length ? [...a1] : [...a2];
  const arr2 = a1.length > a2.length ? [...a2] : [...a1];

  for (let i = 0; i < arr1.length; i++) {
    const test = arr2.filter((c) => {
      return c.name === arr1[i].name;
    });
    if (test.length === 0) {
      combined_array.push(arr1[i]);
    }
  }

  combined_array = combined_array.concat(arr2);
  return combined_array;
}
export default function Notifications({ route, navigation }) {
  const { colors, isDark } = useTheme();
  const img = isDark
    ? require("../../assets/notif_graphic2.png")
    : require("../../assets/notif_graphic1.png");
  const { isNotifs, current, updated } = route.params;
  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_400Regular,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [newData, setNewData] = useState(updated); //updated
  const [oldData, setOldData] = useState(current); //current
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      console.log("stored marks");
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveData = async () => {
    try {
      let datum = await AsyncStorage.getItem("data");
      datum = JSON.parse(datum);
      if (datum.length !== 0) {
        setOldData(datum);
        setLoading(false);
        console.log("retrieved stored marks");
      } else {
        setLoading(true);
        getMarks();
      }
    } catch (e) {
      getMarks();
      console.log(e);
    }
  };
  const getMarks = async () => {
    setLoading(true);
    console.log("getting marks...");
    const number = await AsyncStorage.getItem("number");
    const password = await AsyncStorage.getItem("password");
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
          console.log("status", status);
          if (status === 200) {
            response.json().then((datum) => {
              setNewData(datum);
              setLoading(false);
              storeData(datum);
              retrieveData();
              setRefreshing(false);
            });
          } else {
            console.log("Wrong credentials");
            setLoading(true);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getMarks();
  });

  let displayNotifs = [];
  try {
    if (isNotifs) {
      const all_courses = join_arrays(newData, oldData);
      for (let i = 0; i < all_courses.length; i++) {
        const old_data = oldData.find((c) => {
          return c.name === all_courses[i].name;
        });
        const new_data = newData.find((c) => {
          return c.name === all_courses[i].name;
        });
        displayNotifs.push(
          <DisplayMarkUpdates
            newData={new_data}
            oldData={old_data}
            key={String(i)}
          />
        );
      }
    } else {
      displayNotifs = (
        <View>
          <Image source={img} style={styles(colors).graphic} />
          <Text style={[styles(colors).p, { textAlign: "center" }]}>
            No new updates
          </Text>
        </View>
      );
    }
  } catch {
    Alert.alert(
      "Failed to load notifications.",
      "An error occured and notifications could not be displayed."
    );
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles(colors).safeView}>
        <ScrollView
          style={styles(colors).scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles(colors).container}>
            <TouchableOpacity
              style={styles(colors).headerIcon}
              onPress={() => navigation.goBack()}
              hitSlop={{
                top: 20,
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
              <Text style={styles(colors).headerTitle}>Notifications</Text>
            </View>
            {loading && (
              <ActivityIndicator
                style={{ marginTop: 40 }}
                color={colors.Primary1}
              />
            )}
            <View>{displayNotifs}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    safeView: {
      backgroundColor: colors.Background,
      flex: 1,
      paddingTop: StatusBar.currentHeight,
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
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 5,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    notif: {
      alignItems: "flex-end",
      marginBottom: -26,
      width: "100%",
      paddingRight: 23,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 15,
      marginTop: 10,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      alignSelf: "center",
      color: colors.Header,
    },
    headerIcon: {
      position: "absolute",
      top: 54,
      left: 27,
      zIndex: 2,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      fontSize: 13,
      color: colors.Subtitle,
    },
    graphic: {
      width: 0.6 * vw,
      height: 0.6 * vw,
      marginTop: 120,
      marginBottom: 20,
    },
  });
