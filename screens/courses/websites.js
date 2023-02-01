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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { useTheme } from "../../globals/theme";
import { GENERAL_STYLES } from "../../globals/styles";
import { TEST_USER, TEST_PASS } from "../../data/keys";

var websites_data = [
  ["TeachAssist", "https://ta.yrdsb.ca/yrdsb/"],
  ["MyBlueprint", "https://myblueprint.ca/"],
  ["Google Classroom", "https://classroom.google.com/"],
  ["School Cash Online", "https://schoolcashonline.com/"],
  ["Moodle", "https://moodle2.yrdsb.ca/"],
  ["YRDSB Website", "https://www2.yrdsb.ca/"],
  ["YRDSB Twitter", "https://twitter.com/YRDSB"],
  [
    "YRDSB Report-It",
    "https://secure.yrdsb.ca/Forms/ReportIt/_layouts/FormServer.aspx?XsnLocation=https://secure.yrdsb.ca/FormServerTemplates/ReportItv2.xsn&Source=https://secure.yrdsb.ca&DefaultItemOpen=1",
  ],
  ["Our Website", "https://teachassistapp.github.io/"],
];

export default function Websites({ navigation }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [customWebsite, setCustomWebsite] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showError, setShowError] = useState("");
  const [websites, setWebsites] = useState([]);
  const [number, setNumber] = useState("");
  const [pass, setPass] = useState("");

  const storeData = async (w) => {
    try {
      await AsyncStorage.setItem("websites", JSON.stringify(w));
    } catch (error) {
      Alert.alert("Failed to save websites.");
    }
  };

  const retrieveData = async () => {
    try {
      const w = await AsyncStorage.getItem("websites");
      const n = await AsyncStorage.getItem("number");
      const p = await AsyncStorage.getItem("password");
      if (n && p && n !== TEST_USER && p !== TEST_PASS) {
        setNumber(n);
        setPass(p);
      }
      if (w) {
        setWebsites(JSON.parse(w));
      } else {
        setWebsites(websites_data);
      }
    } catch (error) {
      Alert.alert("Failed to load websites.");
    }
  };

  function openWebsite(link) {
    if (
      link === "https://ta.yrdsb.ca/yrdsb/" &&
      number !== TEST_USER &&
      pass !== TEST_PASS
    ) {
      link = `https://ta.yrdsb.ca/yrdsb/index.php?username=${number}&password=${pass}`;
    }
    Linking.openURL(link).catch(() => {
      alert.alert(
        "Failed to open website.",
        "Please check that the URL is valid."
      );
    });
  }

  function addWebsite() {
    var regex = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    );
    let tempWebsites = [...websites];
    var error = "";
    if (tempWebsites.includes([customTitle, customWebsite])) {
      error = "Website is already saved.";
    } else if (!customWebsite.match(regex)) {
      error = "Link must be a valid URL\n(e.g. https://www.example.com)";
    } else if (customTitle.length > 25) {
      error = "Name must be less than 25 characters.";
    } else {
      tempWebsites.unshift([customTitle, customWebsite]);
      setWebsites(tempWebsites);
      setModalVisible(false);
      storeData(tempWebsites);
    }
    setShowError(error);
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
    return (
      <MaterialIcons
        name="edit"
        size={24}
        color={editable ? colors.Primary1 : colors.Header}
        style={{ top: -3 }}
      />
    );
  }

  function AddIcon() {
    if (editable) {
      return (
        <View style={styles(colors).editIcons}>
          <TouchableOpacity
            style={styles(colors).addIcon}
            onPress={() => {
              setModalVisible(!modalVisible);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles(colors).addContainer}>
              <FontAwesome name="plus" size={23} color={colors.Primary1} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(colors).addIcon}
            onPress={() => {
              reset();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
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
          onPress={() => {
            removeWebsite(props.name);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
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
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View
            style={{
              ...GENERAL_STYLES(colors).header,
              flexDirection: "row",
              paddingTop: 8,
              paddingHorizontal: 5,
              marginBottom: 35,
              marginTop: 5,
            }}
          >
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
            <Text
              style={{
                ...GENERAL_STYLES(colors).headerTitle,
                flex: 8,
              }}
            >
              Websites
            </Text>
            <TouchableOpacity
              style={styles(colors).headerIcon}
              onPress={() => {
                setEditable(!editable);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              hitSlop={{
                top: 20,
                bottom: 50,
                left: 50,
                right: 20,
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
                    style={{
                      ...GENERAL_STYLES(colors).div,
                      marginVertical: "auto",
                      margin: 5,
                      paddingHorizontal: 25,
                      paddingVertical: 15,
                      minHeight: 110,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={GENERAL_STYLES(colors).close}
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
                    <Text style={GENERAL_STYLES(colors).modalTitle}>
                      Add website
                    </Text>
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
      fontFamily: "Poppins_600SemiBold",
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
      color: colors.Primary1,
      fontSize: 12,
    },
    form: {
      justifyContent: "flex-start",
      paddingBottom: 10,
      marginTop: 10,
    },
    input: {
      alignSelf: "center",
      backgroundColor: colors.Container,
      borderColor: colors.Placeholder,
      borderRadius: 15,
      borderWidth: 1,
      width: 0.8 * vw,
      height: 50,
      paddingHorizontal: 17,
      paddingTop: 5,
      margin: 5,
      marginBottom: 15,
      color: colors.Subtitle,
      fontFamily: "Poppins_500Medium",
      fontSize: 14,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      paddingTop: 11,
      paddingBottom: 9,
      paddingHorizontal: 20,
      backgroundColor: colors.Primary1,
      borderRadius: 20,
      borderWidth: 1,
      shadowColor: colors.Shadow,
      borderColor: colors.Border,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
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
