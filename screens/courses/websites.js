import React, { useState, useEffect } from "react";
import { FontAwesome, AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { useTheme } from "../../globals/theme";

const websites_data = [
  ["TeachAssist", "https://ta.yrdsb.ca/yrdsb/"],
  ["MyBlueprint", "https://myblueprint.ca/"],
  ["Google Classroom", "https://classroom.google.com/"],
  ["School Cash Online", "https://schoolcashonline.com/"],
  ["Moodle", "https://moodle2.yrdsb.ca/"],
  ["YRDSB Website", "https://www2.yrdsb.ca/"],
  ["YRDSB Twitter", "https://twitter.com/YRDSB"],
  ["Our website", "https://teachassistapp.github.io/"],
];

export default function Websites({ navigation }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [customWebsite, setCustomWebsite] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showError, setShowError] = useState("");
  const [websites, setWebsites] = useState([]);

  const storeData = async (w) => {
    try {
      await AsyncStorage.setItem("websites", JSON.stringify(w));
    } catch (error) {
      Alert.alert("Failed to save websites.");
    }
  };

  const retrieveData = async () => {
    try {
      let w = await AsyncStorage.getItem("websites");
      if (w !== null) {
        w = JSON.parse(w);
        setWebsites(w);
      } else {
        setWebsites(websites_data);
      }
    } catch (error) {
      Alert.alert("Failed to load websites.");
    }
  };

  function openWebsite(link) {
    Linking.openURL(link).catch((e) => {
      alert.alert(
        "Failed to open website.",
        "Please check that the URL is valid."
      );
    });
  }

  function addWebsite() {
    regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var regex = new RegExp(regex);
    let tempWebsites = [...websites];
    if (tempWebsites.includes([customTitle, customWebsite])) {
      setShowError("Website is already saved.");
    } else if (!customWebsite.match(regex)) {
      setShowError("Link must be a valid URL\n(e.g. https://www.example.com)");
    } else if (customTitle.length > 25) {
      setShowError("Name must be less than 25 characters.");
    } else {
      tempWebsites.unshift([customTitle, customWebsite]);
      setWebsites(tempWebsites);
      setShowError("");
      setModalVisible(false);
      storeData(tempWebsites);
    }
  }

  function removeWebsite(name) {
    let newWebsites = websites.filter((site) => site[0] !== name);
    setWebsites(newWebsites);
    storeData(newWebsites);
  }

  function reset() {
    setWebsites(websites_data);
    storeData(websites_data);
  }
  function EditIcon() {
    if (editable) {
      return <MaterialIcons name="edit" size={24} color={colors.Primary1} />;
    } else {
      return <MaterialIcons name="edit" size={24} color={colors.Header} />;
    }
  }

  function AddIcon() {
    if (editable) {
      return (
        <View style={styles(colors).editIcons}>
          <TouchableOpacity
            style={styles(colors).addIcon}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View style={styles(colors).addContainer}>
              <FontAwesome name="plus" size={23} color={colors.Primary1} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(colors).addIcon}
            onPress={() => reset()}
          >
            <View style={styles(colors).addContainer}>
              <FontAwesome name="undo" size={23} color={colors.Primary1} />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  function CloseIcon(props) {
    if (editable) {
      return (
        <TouchableOpacity
          onPress={() => removeWebsite(props.name)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          style={{ flex: 1, alignItems: "center", paddingRight: 5 }}
        >
          <AntDesign name="close" size={18} color={colors.Red} />
        </TouchableOpacity>
      );
    } else {
      return <View style={{ paddingRight: 23 }} />;
    }
  }

  function DisplayRow({ name, link }) {
    return (
      <View style={styles(colors).websiteContainer}>
        <CloseIcon name={name} />
        <Text style={styles(colors).websiteLabel}>{name}</Text>
        <TouchableOpacity
          style={styles(colors).websiteButton}
          onPress={() => openWebsite(link)}
        >
          <Text style={styles(colors).websiteButtonText}>Visit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let rows = [];
  for (let i = 0; i < websites.length; i++) {
    rows.push(
      <DisplayRow
        key={websites[i][0]}
        name={websites[i][0]}
        link={websites[i][1]}
      />
    );
  }

  useEffect(() => {
    retrieveData();
  }, []);
  return (
    <SafeAreaView style={styles(colors).safeView}>
      <ScrollView style={styles(colors).scrollView}>
        <View style={styles(colors).container}>
          <View style={styles(colors).header}>
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
            <Text style={styles(colors).headerTitle}>Websites</Text>
            <TouchableOpacity
              style={styles(colors).headerIcon}
              onPress={() => setEditable(!editable)}
              hitSlop={{
                top: 20,
                bottom: 50,
                left: 20,
                right: 50,
              }}
            >
              <EditIcon />
            </TouchableOpacity>
          </View>
          <AddIcon />
          {rows}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false); //if user taps outside the calculator, close the modal
              }}
              style={{
                width: "100%",
                flex: 1,
                backgroundColor: `${colors.Background}cc`,
              }}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={[
                      styles(colors).div,
                      { marginVertical: "auto", paddingHorizontal: 25 },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles(colors).close}
                      hitSlop={{
                        top: 20,
                        left: 20,
                        bottom: 30,
                        right: 30,
                      }}
                    >
                      <AntDesign
                        name="close"
                        size={21}
                        color={colors.Subtitle}
                      />
                    </TouchableOpacity>
                    <Text style={styles(colors).modalTitle}>Add website</Text>
                    <View style={styles(colors).form}>
                      <TextInput
                        style={styles(colors).input}
                        placeholder="Name"
                        placeholderTextColor={colors.Placeholder}
                        multiline={false}
                        onChangeText={(t) => {
                          setCustomTitle(t);
                        }}
                      />
                      <TextInput
                        style={styles(colors).input}
                        placeholder="Link"
                        placeholderTextColor={colors.Placeholder}
                        multiline={false}
                        onChangeText={(w) => {
                          setCustomWebsite(w);
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles(colors).button}
                      onPress={() => addWebsite()}
                    >
                      <Text style={styles(colors).buttonText}>Create</Text>
                    </TouchableOpacity>
                    <Text style={styles(colors).error}>{showError}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 20,
      paddingHorizontal: 20,
      width: vw,
      backgroundColor: colors.Background,
      marginBottom: 35,
      marginTop: 10,
    },
    headerTitle: {
      fontFamily: "Poppins_700Bold",
      fontSize: 24,
      textAlign: "center",
      color: colors.Header,
      flex: 8,
    },
    headerIcon: {
      flex: 2,
      alignItems: "center",
    },
    addContainer: {
      flex: 2,
      alignItems: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 50,
      borderWidth: 1,
      paddingHorizontal: 13,
      paddingVertical: 11,
      marginTop: -20,
      marginBottom: 25,
    },
    addIcon: {
      alignItems: "center",
      marginHorizontal: 10,
    },
    editIcons: {
      flexDirection: "row",
    },
    websiteContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 28,
      paddingLeft: 15,
      paddingRight: 25,
    },
    websiteLabel: {
      fontFamily: "Poppins_700Bold",
      color: colors.Header,
      fontSize: 16,
      flex: 7,
    },
    websiteButton: {
      borderRadius: 20,
      borderColor: colors.Border,
      borderWidth: 2,
      width: 80,
      padding: 5,
      backgroundColor: colors.Container,
      alignItems: "center",
      justifyContent: "center",
      flex: 2,
    },
    websiteButtonText: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Primary2,
      fontSize: 12,
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
      minHeight: 125,
      paddingHorizontal: 17,
      paddingVertical: 15,
      margin: 5,
      shadowColor: colors.Shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    p: {
      fontFamily: "Poppins_400Regular",
      color: colors.Subtitle,
      fontSize: 12,
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
    form: {
      justifyContent: "flex-start",
      paddingBottom: 10,
    },
    input: {
      alignSelf: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Border,
      borderRadius: 15,
      borderWidth: 1,
      width: 0.8 * vw,
      height: 50,
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 5,
      margin: 5,
      marginBottom: 15,
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
    },
    close: {
      alignSelf: "flex-end",
      marginBottom: -25,
      marginTop: 10,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
      paddingTop: 12,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.Primary1,
      borderRadius: 20,
      borderWidth: 1,
      shadowColor: colors.Shadow,
      borderColor: colors.Border,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      width: 0.3 * vw,
    },
    buttonText: {
      fontFamily: "Poppins_600SemiBold",
      color: colors.Background,
      fontSize: 16,
    },
    error: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.Red,
      alignSelf: "center",
      textAlign: "center",
    },
  });
