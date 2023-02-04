import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { GENERAL_STYLES } from "../../globals/styles";

// component for the teacher overview we map through, (id,name, and status)
function TeacherOverview({ teacher, navigation, colors }) {
  let name = teacher.name;
  if (name.includes(", OCT")) {
    name = name.slice(0, -5);
  }
  if (name.length * 15 > Dimensions.get("window").width) {
    name = name.slice(0, Dimensions.get("window").width / 15) + "...";
  }

  return (
    <TouchableOpacity
      style={styles(colors).teacher}
      onPress={() => {
        navigation.navigate("Teacher Details", {
          id: teacher.id,
          name: teacher.name,
          status: teacher.status,
        });
      }}
    >
      <Text style={styles(colors).teacherName}>{name.toLowerCase()}</Text>
      <View style={{ flex: 4, alignItems: "center" }}>
        <Octicons
          name="dot-fill"
          size={20}
          color={
            teacher.status.includes("Good Standing")
              ? colors.Primary1
              : colors.Red
          }
        />
      </View>
    </TouchableOpacity>
  );
}

export default function TeacherResults({
  data,
  valid,
  navigation,
  colors,
  actives,
}) {
  // method for rendering teachers onto screen
  const [green, setGreen] = useState(false);
  const [teachers, setTeachers] = useState(data);

  const handleToggle = () => {
    green ? setTeachers(data) : setTeachers(valid);
    setGreen(!green);
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
        <View style={{ flex: 4, alignText: "center", alignItems: "center" }}>
          <Text style={GENERAL_STYLES(colors).p}>Status</Text>
        </View>
      </View>
      {renderTeachers()}
    </View>
  );
}

const vw = Dimensions.get("window").width;

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
      alignSelf: "center",
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
