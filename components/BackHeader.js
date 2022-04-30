import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GENERAL_STYLES } from "../globals/styles";

export const BackHeader = ({ header, colors }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        ...GENERAL_STYLES(colors).header,
        flexDirection: "row",
        paddingTop: 15,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center" }}
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
          paddingTop: 20,
          marginBottom: 20,
          flex: 4,
        }}
      >
        <Text style={GENERAL_STYLES(colors).headerTitle}>{header}</Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};
