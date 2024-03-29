import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GuidanceBook from "../components/guidanceBook";
import { ThemeContext } from "../globals/theme";
import GuidanceTime from "../components/guidanceTime";
import BookedAppointments from "../components/bookedAppointments";
import { GENERAL_STYLES } from "../globals/styles";
import { handleFetchError } from "../globals/alert";
import { test_guidance_times } from "../data/test";
import { TEST_USER, TEST_PASS } from "../data/keys";
import { encryptRSA } from "../components/rsa";
import SkeletonGuidanceLoading from "../components/skeletonGuidanceLoading";
import * as Device from "expo-device";
import { lightColors, darkColors } from "../globals/colors";

const Stack = createNativeStackNavigator();

export default function Guidance() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={GuidanceSearch} />
      <Stack.Screen name="Book" component={GuidanceBook} />
    </Stack.Navigator>
  );
}

function GuidanceSearch() {
  const { theme, setTheme } = useContext(ThemeContext);
  const colors = theme === "light" ? lightColors : darkColors;
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);
  const [noApps, setNoApps] = useState(false);
  const [showResults, setShowResults] = useState(true); //display times; hide times if user changes date
  const [loading, setLoading] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const minDate = new Date();
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const days = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];

  const retrieveAppointments = async () => {
    try {
      let a = await AsyncStorage.getItem("appointments");
      a = JSON.parse(a);
      if (a) {
        setBookedAppointments(a);
      }
    } catch {
      Alert.alert("Failed to load booked appointments.");
    }
  };

  const getAppointment = async () => {
    if (loading) return;
    setLoading(true);
    setNoApps(false);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const time =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const number = await AsyncStorage.getItem("number");
    const pass = await AsyncStorage.getItem("password");
    if (number == TEST_USER && pass == TEST_PASS) {
      setData(test_guidance_times);
      setNoApps(false);
      setLoading(false);
      setShowResults(true);
      return;
    }

    const enc_number = encryptRSA(number);
    const enc_pass = encryptRSA(pass);

    const url = `https://oct-api.herokuapp.com/fetch-guidance-times?time=${time}&number=${enc_number}&password=${enc_pass}&rsa=True`;
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result === "NASD") {
          setNoApps(true);
          setLoading(false);
        } else {
          setData(JSON.parse(result));
          setNoApps(false);
          setLoading(false);
          setShowResults(true);
        }
      })
      .catch(() => {
        handleFetchError();
        setLoading(false);
      });
  };

  const onChange = (selectedDate) => {
    const newDate = selectedDate || date;
    setShow(Device.osName === "iOS");
    setDate(newDate);
    setShowResults(false);
  };

  const updateAppointments = (a) => {
    setBookedAppointments(a);
  };

  useEffect(() => {
    retrieveAppointments();
  }, []);
  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View style={GENERAL_STYLES(colors).header}>
            <Text style={GENERAL_STYLES(colors).headerTitle}>Guidance</Text>
            <Text style={GENERAL_STYLES(colors).p}>Book Appointments</Text>
          </View>
          <TouchableOpacity
            style={styles(colors).button}
            onPress={() => setShow(!show)}
          >
            <Text style={styles(colors).buttonText}>Change Date</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={(date) => onChange(date)}
          onCancel={() => setShow(false)}
          minimumDate={minDate}
          date={date}
        />
        <Text
          style={[
            GENERAL_STYLES(colors).p,
            styles(colors).p,
            { marginBottom: 7 },
          ]}
        >
          Selected Date:{" "}
          <Text
            style={{
              color: colors.Primary1,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {`${days[date.getDay()]} ${
              months[date.getMonth()]
            } ${date.getDate()}, ${date.getFullYear()}`}
          </Text>
        </Text>
        <TouchableOpacity
          style={[styles(colors).button, { backgroundColor: colors.Primary1 }]}
          onPress={() => {
            //getAppointment();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[styles(colors).buttonText, { color: colors.Background }]}
          >
            Find Appointments
          </Text>
        </TouchableOpacity>
        <Text style={[styles(colors).errorMessage]}>
          Note: Guidance Booking is not supported at this time. We are working
          on fixing it!{"\n\n"}Sorry for the inconvenience :(
        </Text>
        {loading && <SkeletonGuidanceLoading />}
        {noApps && (
          <View style={styles(colors).errorContainer}>
            <Text style={styles(colors).errorMessage}>
              This date is not a school day.
            </Text>
          </View>
        )}
        {!loading && showResults && data && (
          <View>
            <View style={styles(colors).hRule} />
            <Text
              style={[
                GENERAL_STYLES(colors).p,
                styles(colors).p,
                { fontSize: 12, marginBottom: 0 },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: colors.Primary1,
                }}
              >
                Tap on a guidance consellor
              </Text>{" "}
              to reveal their available appointments.
            </Text>
            <Text
              style={[
                GENERAL_STYLES(colors).p,
                styles(colors).p,
                { fontSize: 12 },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: colors.Primary1,
                }}
              >
                Tap on a time
              </Text>{" "}
              to book an appointment with them.
            </Text>
            {data.map((item, index) => {
              return <GuidanceTime data={item} date={date} key={index} />;
            })}
          </View>
        )}
        {bookedAppointments.length > 0 && (
          <View>
            <View style={styles(colors).hRule} />
            <Text style={[GENERAL_STYLES(colors).p, styles(colors).p]}>
              Booked Appointments
            </Text>
            <BookedAppointments
              appointments={bookedAppointments}
              updateAppointments={updateAppointments}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    p: {
      flexWrap: "wrap",
      alignSelf: "center",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 24,
      maxWidth: 0.8 * vw,
    },
    button: {
      alignSelf: "center",
      marginVertical: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: colors.Background,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      fontSize: 14,
    },
    hRule: {
      borderBottomColor: colors.GraphBackground,
      borderBottomWidth: 2,
      marginVertical: 10,
      alignSelf: "center",
      width: "95%",
      maxWidth: 0.85 * vw,
    },
    errorContainer: {
      width: 0.9 * vw,
      alignSelf: "center",
    },
    errorMessage: {
      fontFamily: "Poppins_500Medium",
      textAlign: "center",
      color: colors.Red,
      marginVertical: 10,
      fontSize: 15,
    },
  });
