import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import DisplayMarkUpdates from "../../components/displayMarkUpdates";
import { useTheme } from "../../globals/theme";
import { GENERAL_STYLES } from "../../globals/styles";
import { BackHeader } from "../../components/backHeader";

const vw = Dimensions.get("window").width;

function join_arrays(a1, a2) {
  let combined_array = [];
  const arr1 = a1.length > a2.length ? [...a1] : [...a2];
  const arr2 = a1.length > a2.length ? [...a2] : [...a1];

  for (let i = 0; i < arr1.length; i++) {
    const test = arr2.filter((c) => {
      return c.code === arr1[i].code;
    });
    if (test.length === 0) {
      combined_array.push(arr1[i]);
    }
  }

  combined_array = combined_array.concat(arr2);
  return combined_array;
}
export default function Notifications({ route }) {
  const { colors, isDark } = useTheme();
  const img = isDark
    ? require("../../assets/notif_graphic2.png")
    : require("../../assets/notif_graphic1.png");
  const { isNotifs, current, updated } = route.params;
  const [newData, setNewData] = useState(updated); //updated
  const [oldData, setOldData] = useState(current); //current
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
    } catch (error) {
      Alert.alert("Failed to store data.");
    }
  };

  const retrieveData = async () => {
    try {
      let datum = await AsyncStorage.getItem("data");
      datum = JSON.parse(datum);
      const retrieved = datum.length !== 0;
      setLoading(!retrieved);
      if (retrieved) {
        setOldData(datum);
      } else {
        getMarks();
      }
    } catch {
      getMarks();
    }
  };
  const getMarks = async () => {
    setLoading(true);
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
          if (status === 200) {
            response.json().then((datum) => {
              setNewData(datum);
              storeData(datum);
              retrieveData();
              setRefreshing(false);
            });
          } else {
            Alert.alert("Failed to fetch data.", "Please try again later.");
          }
          setLoading(false);
        })
        .catch(() =>
          Alert.alert("Failed to fetch data.", "Please try again later.")
        );
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
          return c.code === all_courses[i].code;
        });
        const new_data = newData.find((c) => {
          return c.code === all_courses[i].code;
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
      displayNotifs = !loading && (
        <View>
          <Image
            source={img}
            style={{
              width: 0.6 * vw,
              height: 0.6 * vw,
              marginTop: 120,
              marginBottom: 20,
            }}
          />
          <Text style={{ ...GENERAL_STYLES(colors).p, textAlign: "center" }}>
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

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView
        style={GENERAL_STYLES(colors).scrollview}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ ...GENERAL_STYLES(colors).container, paddingVertical: 15 }}
        >
          <BackHeader header="Notifications" colors={colors} />
          {loading && (
            <ActivityIndicator
              style={{ marginTop: 40 }}
              color={colors.Primary1}
              size="large"
            />
          )}
          <View>{displayNotifs}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
