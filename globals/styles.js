import { StyleSheet, StatusBar, Dimensions } from "react-native";
const vw = Dimensions.get("window").width;

export const GENERAL_STYLES = (colors) =>
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
      width: vw,
    },
    blockContainer: {
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingBottom: 15,
    },
    body: {
      width: vw,
      paddingHorizontal: 40,
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
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    expand: {
      width: "100%",
      paddingHorizontal: 17,
      borderTopColor: colors.GraphBackground,
      borderTopWidth: 1,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 39,
      width: vw,
      backgroundColor: colors.Background,
      marginBottom: 29,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 23,
      alignSelf: "center",
      color: colors.Header,
      maxWidth: 0.7 * vw,
      textAlign: "center",
    },
    headerSubtitle: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 13,
    },
    headerIcon: {
      position: "absolute",
      top: 50,
      left: 27,
      zIndex: 2,
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "center",
      width: "95%",
      marginBottom: 10,
    },
    inputSubContainer: {
      width: "48%",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    inputLabel: {
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
      color: colors.Subtitle,
      marginRight: 5,
    },
    modalTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      color: colors.Header,
      maxWidth: 0.5 * vw,
      marginBottom: 20,
      textAlign: "center",
      alignSelf: "center",
    },
    close: {
      alignSelf: "flex-end",
      marginBottom: -25,
      marginTop: 10,
    },
  });

export const ASSIGNMENT_STYLES = (colors) =>
  StyleSheet.create({
    assignmentBarChart: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      height: 90,
      width: 120,
      top: 2,
    },
    progressBar: {
      height: 90,
      width: 70,
      transform: [{ rotate: "270deg" }],
      position: "relative",
      right: -20,
      marginTop: -9,
      marginBottom: -9,
    },
    assignmentBar: {
      height: 90,
      width: 28,
      justifyContent: "center",
    },
    assignmentMark: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 23,
      color: colors.Primary1,
    },
    assignmentTitle: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 15,
      color: colors.Header,
      maxWidth: 0.4 * vw,
      marginTop: 5,
      marginBottom: 5,
    },
  });
