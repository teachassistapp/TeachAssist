import React from "react";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { darkColors, lightColors } from "../../globals/colors";
import { useTheme } from "../../globals/theme";
import { GENERAL_STYLES } from "../../globals/styles";
import { BackHeader } from "../../components/BackHeader";

export default function ColorPicker({ navigation }) {
    const { colors } = useTheme();

    const setNewColor = (alt) => {
        darkColors.Primary1 = alt;
        lightColors.Primary1 = alt;
    }

    return (
        <SafeAreaView
        style={{ ...GENERAL_STYLES(colors).safeView, alignItems: "center" }}
        >
            <View style={GENERAL_STYLES(colors).container}>
                <BackHeader header="Change Colours" colors={colors} />
                <View style={styles(colors).options}>
                    <TouchableOpacity
                    onClick={() => {setNewColor(colors.Alt1)}}
                    >
                        <View style={[styles(colors).colorOption, {backgroundColor: colors.Alt1}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onClick={() => {setNewColor(colors.Alt2)}}
                    >
                        <View style={[styles(colors).colorOption, {backgroundColor: colors.Alt2}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onClick={() => {setNewColor(colors.Alt3)}}
                    >
                        <View style={[styles(colors).colorOption, {backgroundColor: colors.Alt3}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onClick={() => {setNewColor(colors.Alt4)}}
                    >
                        <View style={[styles(colors).colorOption, {backgroundColor: colors.Alt4}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onClick={() => {setNewColor(colors.Alt5)}}
                    >
                        <View style={[styles(colors).colorOption, {backgroundColor: colors.Alt5}]}/>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles(colors).hRule}/> */}
                <Text style={styles(colors).h}>Example:</Text>
                <View style={{...GENERAL_STYLES(colors).div, alignItems:"start", padding: 25}}>
                    <View
                        style={{
                        marginTop: 5,
                        marginBottom: 15,
                        width: 0.35*vw,
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: colors.Primary1,
                        }}
                    />
                    <View
                        style={{
                        marginTop: 15,
                        marginBottom: 5,
                        width: 0.25*vw,
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: colors.Placeholder,
                        }}
                    />
                    <View
                        style={{
                        marginTop: 15,
                        marginBottom: 5,
                        width: 0.4*vw,
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: colors.Placeholder,
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const styles = (colors) =>
  StyleSheet.create({
    options: {
        marginTop: 0.1 * vh,
        marginBottom: 0.08*vh,
        flexDirection: "row",
        width: vw * 0.7,
        justifyContent: "space-between",
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: colors.Primary1,
    },
    hRule: {
        borderBottomColor: colors.Subtitle,
        borderBottomWidth: 1,
        marginTop: 14,
        marginBottom: 8,
        width: vw * 0.8,
    },
    h: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 18,
      color: colors.Header,
      textAlign: "center",
      marginBottom: 15,
    },
    p1: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
      marginTop: 15,
      marginBottom: 12,
      maxWidth: 0.75 * vw,
    },
    p2: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Subtitle,
      textAlign: "center",
      fontSize: 15,
    },
  });
