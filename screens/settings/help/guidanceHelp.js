import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useTheme } from "../../../globals/theme";
import { guidanceHelp } from "../../../data/help";
import AnimatedCollapsible from "../../../components/AnimatedCollapsible";

export default function GuidanceHelp({ navigation }) {
  const { colors } = useTheme();
  let [fontsLoaded] = useFonts({
    //load custom fonts
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles(colors).safeView}>
        <ScrollView style={styles(colors).scrollView}>
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
              <Text style={styles(colors).headerTitle}>Guidance</Text>
            </View>
            <View style={styles(colors).body}>
              {guidanceHelp.map((d, i) => {
                return (
                  <AnimatedCollapsible
                    header={d.header}
                    description={
                      <Text style={styles(colors).p}>{d.description}</Text>
                    }
                    colors={colors}
                    key={String(i)}
                  />
                );
              })}
            </View>
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
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.Background,
      alignItems: "center",
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
      width: vw,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
      backgroundColor: colors.Background,
      marginBottom: 20,
      marginTop: 10,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 22,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 0.7 * vw,
    },
    headerIcon: {
      position: "absolute",
      top: 54,
      left: 27,
      zIndex: 2,
    },
    body: {
      width: vw,
      marginTop: 25,
      paddingHorizontal: 40,
    },
    h: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Primary1,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 14,
      marginTop: 5,
      marginBottom: 5,
    },
  });
