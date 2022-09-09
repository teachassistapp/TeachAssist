import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Octicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GENERAL_STYLES } from "../../globals/styles";

// component for the teacher overview we map through, (id,name, and status)
function TeacherOverview({
  teacher,
  navigation,
  colors,
  initialStored,
  setStoredTeachers,
}) {
  if (initialStored === null) {
    initialStored = [];
  }
  const find_starred = initialStored.find((t) => {
    return t.id === teacher.id;
  });
  const [starred, setStarred] = useState(find_starred === true);
  const storeData = async (tc, stored) => {
    try {
      if (
        stored.filter((t) => {
          t.id === tc.id;
        }).length === 0
      ) {
        await AsyncStorage.setItem("teacher", JSON.stringify(tc));
      }
    } catch (error) {
      Alert.alert("Failed to store data.");
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
        newTeachers.push(teacher);
      } else {
        //unstarred
        newTeachers = newTeachers.filter((t) => {
          return t.id !== teacher.id;
        });
      }
      setStarred(!starred);
      storeData(newTeachers, datum);
      setStoredTeachers(newTeachers);
    } catch (e) {
      Alert.alert("Failed to save teacher.");
    }
  };
  let name = teacher.name;
  if (name.includes(", OCT")) {
    name = name.slice(0, -5);
  }
  if (name.length * 23 > Dimensions.get("window").width) {
    name = name.slice(0, Dimensions.get("window").width / 23) + "...";
  }

  useEffect(() => {
    setStarred(
      initialStored.filter((t) => {
        return t.id === teacher.id;
      }).length > 0
    );
  }, [initialStored]);
  return (
    <TouchableOpacity
      style={styles(colors).teacher}
      onPress={() => {
        navigation.navigate("Teacher Details", {
          id: teacher.id,
          data: find_starred ? find_starred.raw_data : null, //find_starred.raw_data
          name: teacher.name,
          status: teacher.status,
          isStarred: starred,
          starrable: false,
        });
      }}
    >
      <Text style={styles(colors).teacherName}>{name.toLowerCase()}</Text>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Octicons
          name="primitive-dot"
          size={20}
          color={
            teacher.status.includes("Good Standing")
              ? colors.Primary1
              : colors.Red
          }
        />
      </View>
      <TouchableOpacity
        style={{ flex: 2, alignItems: "center" }}
        onPress={() => handleStar()}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
      >
        {starred ? (
          <FontAwesome name="star" size={20} color={colors.Subtitle} />
        ) : (
          <FontAwesome name="star-o" size={20} color={colors.Subtitle} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function TeacherResults({
  data,
  valid,
  navigation,
  colors,
  storedTeachers,
  setStoredTeachers,
  actives,
}) {
  // method for rendering teachers onto screen
  const [green, setGreen] = useState(false);
  const [teachers, setTeachers] = useState(data);

  const handleToggle = () => {
    green ? setTeachers(data) : setTeachers(valid);
    setGreen(!green);
  };

  const setStoredTeachersChild = (t) => {
    setStoredTeachers(t);
  };
  if (data.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={GENERAL_STYLES(colors).p}>No teachers found.</Text>
      </View>
    );
  }
  const renderTeachers = () => {
    const temp_teachers = actives ? [...teachers] : [...data];
    return temp_teachers.map((teacherData) => {
      return (
        <TeacherOverview
          teacher={teacherData}
          key={teacherData.id}
          navigation={navigation}
          colors={colors}
          initialStored={storedTeachers}
          setStoredTeachers={setStoredTeachersChild}
        />
      );
    });
  };
  return (
    <View style={styles(colors).teacherContainer}>
      {actives && (
        <View>
          <TouchableOpacity
            onPress={() => {
              handleToggle();
            }}
            style={[
              styles(colors).button,
              { backgroundColor: green ? colors.Primary1 : colors.Container },
            ]}
          >
            <Text
              style={[
                styles(colors).buttonText,
                { color: green ? colors.Background : colors.Subtitle },
              ]}
            >
              Show Active Teachers
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles(colors).titles}>
        <Text style={[GENERAL_STYLES(colors).p, { flex: 8 }]}>Name</Text>
        <View style={{ flex: 2, alignText: "center", alignItems: "center" }}>
          <Text style={GENERAL_STYLES(colors).p}>Status</Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      {renderTeachers()}
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    button: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: colors.Border,
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 21,
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: -10,
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: colors.Subtitle,
    },
    teacherContainer: {
      padding: 12,
      paddingLeft: 16,
      margin: 12,
      width: "90%",
      alignSelf: "center"
    },
    titles: {
      flexDirection: "row",
    },
    teacher: {
      marginVertical: 12,
      flexDirection: "row",
    },
    teacherName: {
      flex: 8,
      fontFamily: "Poppins_500Medium",
      color: colors.Header,
      fontSize: 16,
      textTransform: "capitalize",
    },
  });
