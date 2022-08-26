import React from "react";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../globals/theme";
import { sendEmail } from "../../components/SendEmail";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import { GENERAL_STYLES } from "../../globals/styles";
import { BackHeader } from "../../components/BackHeader";

export default function Feedback() {
  const { colors } = useTheme();
  const [error, setError] = useState(false);
  const [text, onChangeText] = useState(null);

  const handleEmail = (body) => {
    sendEmail("ta.app.help@gmail.com", "Teach Assist App Feedback", body);
  };
  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <BackHeader header="Support & Feedback" colors={colors} />
          <View style={GENERAL_STYLES(colors).body}>
            <Text style={styles(colors).p1}>
              Contact us for support or feedback!
            </Text>
          </View>
          <TextInput
            style={styles(colors).input}
            onChangeText={(text) => onChangeText(text)}
            value={text}
            placeholder="Write something..."
            placeholderTextColor={colors.Placeholder}
            multiline={true}
          />
          <TouchableOpacity
            style={styles(colors).submit}
            onPress={() => {
              text ? handleEmail(text) : setError(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <FontAwesome name="send" size={16} color={colors.Primary1} />
            <Text style={styles(colors).buttonText}> Send</Text>
          </TouchableOpacity>
          {error ? (
            <Text style={styles(colors).error}>
              You cannot send a blank message.
            </Text>
          ) : (
            <View style={{ height: 34 }} />
          )}
          <View
            style={{
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles(colors).p1}>
              Or send us a message on{" "}
              <Text style={styles(colors).p2}>Instagram </Text>
              or through <Text style={styles(colors).p2}>our website</Text>:
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.instagram.com/teach.assist.app/")
              }
              hitSlop={{
                top: 20,
                bottom: 10,
                left: 20,
                right: 20,
              }}
              style={{ marginBottom: 10 }}
            >
              <Text style={styles(colors).linkText}>@teach.assist.app</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://teachassistapp.github.io/")
              }
              hitSlop={{
                top: 10,
                bottom: 20,
                left: 20,
                right: 20,
              }}
              style={{ marginBottom: 20 }}
            >
              <Text style={styles(colors).linkText}>Visit our website</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({
    notif: {
      alignItems: "flex-end",
      marginBottom: -26,
      width: "100%",
      paddingRight: 23,
    },
    h: {
      fontFamily: "Poppins_700Bold",
      fontSize: 18,
      color: colors.Primary1,
      textAlign: "center",
      marginBottom: 15,
    },
    p1: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 14,
      marginTop: 10,
      marginBottom: 12,
      maxWidth: 0.75 * vw,
    },
    p2: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 14,
    },
    error: {
      fontFamily: "Poppins_500Medium",
      color: colors.Red,
      textAlign: "center",
      fontSize: 13,
      marginTop: 6,
    },
    input: {
      alignSelf: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 15,
      borderWidth: 1,
      width: 0.9 * vw,
      minHeight: 150,
      paddingHorizontal: 15,
      // do not change below to paddingVertical, it doesn't work on iOS for textinputs for some reason
      paddingTop: 13,
      paddingBottom: 13,
      margin: 5,
      marginBottom: 15,
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      textAlignVertical: "top",
    },
    submit: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      height: "auto",
      width: "auto",
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 8,
      paddingBottom: 8,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
      paddingLeft: 8,
    },
    linkText: {
      color: colors.Primary1,
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
    },
  });
