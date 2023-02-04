import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GENERAL_STYLES } from "../globals/styles";

export const BackHeader = ({ header, subtitle, colors }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        ...GENERAL_STYLES(colors).header,
        flexDirection: "row",
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 5,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 22,
          height: "100%",
        }}
        onPress={() => navigation.goBack()}
        hitSlop={{
          top: 20,
          bottom: 50,
          left: 20,
          right: 50,
        }}
      >
        <FontAwesome name="chevron-left" size={24} color={colors.Primary1} />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 4,
        }}
      >
        <Text style={GENERAL_STYLES(colors).headerTitle}>{header}</Text>
        {subtitle && <Text style={GENERAL_STYLES(colors).p}>{subtitle}</Text>}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};
