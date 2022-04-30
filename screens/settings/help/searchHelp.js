import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../../../globals/theme";
import AnimatedCollapsible from "../../../components/AnimatedCollapsible";
import { searchHelp } from "../../../data/help";
import { GENERAL_STYLES } from "../../../globals/styles";
import { BackHeader } from "../../../components/BackHeader";

export default function SearchHelp() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{ ...GENERAL_STYLES(colors).safeView, alignItems: "center" }}
    >
      <ScrollView style={GENERAL_STYLES(colors).scrollview}>
        <View style={GENERAL_STYLES(colors).container}>
          <BackHeader header="Search" colors={colors} />
          <View style={{ ...GENERAL_STYLES(colors).body, marginTop: 25 }}>
            {searchHelp.map((d, i) => {
              return (
                <AnimatedCollapsible
                  header={d.header}
                  description={
                    <Text
                      style={{
                        ...GENERAL_STYLES(colors).p,
                        fontSize: 14,
                        marginTop: 5,
                        marginBottom: 5,
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
