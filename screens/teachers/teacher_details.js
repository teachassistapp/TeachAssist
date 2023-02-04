import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../globals/theme";
import { FontAwesome } from "@expo/vector-icons";
import { handleFetchError } from "../../globals/alert";
import AnimatedCollapsible from "../../components/AnimatedCollapsible";
import SkeletonTeacherDetails from "../../components/skeletonTeacherDetails";
import { GENERAL_STYLES } from "../../globals/styles";

export default function TeacherDetails({ route, navigation }) {
  const { colors } = useTheme();
  let { id, name, status } = route.params;
  name = name.toLowerCase();
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState({});

  const getTeacherData = () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
    };

    const url =
      "https://apps.oct.ca/FindATeacherWebApiWrapper/api/publicregister/";
    const params =
      "guid=814fd225-0c8b-eb11-b1ac-000d3a09d306&csid=f41uk_O3QGF1Mo0.tf_sTdl_EUedR6pksz";
    fetch(`${url}basicQualification?id=${id}&${params}`, requestOptions)
      .then((response) =>
        response
          .json()
          .then((basicQualifications) => {
            fetch(`${url}degreeCredentials?id=${id}&${params}`)
              .then((response) =>
                response
                  .json()
                  .then((degreeCredentials) => {
                    const result = {
                      id: id,
                      name: name,
                      status: status,
                      content: {
                        degrees: {
                          property: "Education",
                          content: [],
                        },
                        teaching: {
                          property: "Teaching Qualifications",
                          content: [],
                        },
                        additional: {
                          property: "Additional Qualifications",
                          content: [],
                        },
                      },
                    };
                    basicQualifications.forEach((item) => {
                      let type = "teaching";
                      if (
                        item.phoenix_qualificationtypename ===
                        "Additional Qualification"
                      ) {
                        type = "additional";
                      }
                      result.content[type].content.push({
                        name: item.phoenix_name,
                        institution: item.phoenix_institution_name,
                        date: item.phoenix_validfrom,
                        subject: item.phoenix_subject,
                      });
                    });
                    degreeCredentials.value.forEach((item) => {
                      result.content.degrees.content.push({
                        subject: item.phoenix_degree_name,
                        institution: item.phoenix_institution_name,
                        date: item.phoenix_issueddate,
                      });
                    });
                    setRes(result);
                    setLoading(false);
                  })
                  .catch((err) => {
                    throw err;
                  })
              )
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          })
      )
      .catch((err) => {
        handleFetchError();
        setLoading(false);
      });
  };

  useEffect(() => {
    getTeacherData();
  }, []);

  return (
    <SafeAreaView style={GENERAL_STYLES(colors).safeView}>
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <View
            style={{
              ...GENERAL_STYLES(colors).header,
              flexDirection: "row",
              paddingTop: 20,
              marginBottom: 29,
              paddingHorizontal: 27,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("Teacher Search")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                textTransform: "capitalize",
                flex: 8,
              }}
            >
              {name}
            </Text>
            <View style={{ flex: 1 }} />
          </View>
          {loading && <SkeletonTeacherDetails />}
          {res && !loading && (
            <View>
              <View
                style={[
                  GENERAL_STYLES(colors).div,
                  styles(colors).generalContainer,
                ]}
              >
                <View style={styles(colors).generalInfo}>
                  <Text style={styles(colors).generalText}>ID: </Text>
                  <Text
                    style={[
                      styles(colors).generalText,
                      { fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    {res.id}
                  </Text>
                </View>
                <View style={styles(colors).generalInfo}>
                  <Text style={styles(colors).generalText}>
                    Status:{" "}
                    {status.includes("Good Standing") ? (
                      <Text
                        style={[
                          styles(colors).generalText,
                          {
                            fontFamily: "Poppins_600SemiBold",
                            color: colors.Primary1,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles(colors).generalText,
                          {
                            fontFamily: "Poppins_600SemiBold",
                            color: colors.Red,
                          },
                        ]}
                      >
                        {status}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <View>
                {Object.values(res.content).map((detail, i) => {
                  if (detail.content.length > 0) {
                    return (
                      <AnimatedCollapsible
                        header={detail.property}
                        description={detail.content.map((e, i) => {
                          return (
                            <View
                              key={String(i)}
                              style={{
                                paddingVertical: 10,
                              }}
                            >
                              <Text
                                style={[
                                  GENERAL_STYLES(colors).p,
                                  styles(colors).p,
                                ]}
                              >
                                {e.subject} @ {e.institution}
                                <Text
                                  style={{
                                    ...GENERAL_STYLES(colors).p,
                                    ...styles(colors).p,
                                    fontFamily: "Poppins_600SemiBold",
                                  }}
                                >
                                  {" / "}
                                  {e.date}
                                </Text>
                              </Text>
                            </View>
                          );
                        })}
                        colors={colors}
                        key={String(i)}
                      />
                    );
                  }
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    generalContainer: {
      minHeight: 60,
      color: colors.Header,
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 17,
      paddingVertical: 12,
      margin: 5,
      marginBottom: 24,
    },
    generalInfo: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    generalText: {
      fontFamily: "Poppins_500Medium",
      color: colors.Header,
      fontSize: 16,
      flexWrap: "wrap",
    },
    p: {
      fontSize: 14,
      marginVertical: 4,
    },
  });
