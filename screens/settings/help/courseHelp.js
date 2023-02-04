import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../../../globals/theme";
import { courseHelp } from "../../../data/help";
import AnimatedCollapsible from "../../../components/animatedCollapsible";
import { GENERAL_STYLES } from "../../../globals/styles";
import { BackHeader } from "../../../components/backHeader";

export default function CourseHelp() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{ ...GENERAL_STYLES(colors).safeView, alignItems: "center" }}
    >
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <BackHeader header="Courses" colors={colors} />
          <View style={{ ...GENERAL_STYLES(colors).body, marginTop: 25 }}>
            {courseHelp.map((d, i) => {
              return (
                <AnimatedCollapsible
                  header={d.header}
                  description={
                    <Text
                      style={{
                        ...GENERAL_STYLES(colors).p,
                        fontSize: 14,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    >
                      {d.description}
                    </Text>
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
