import React, {useContext} from "react";
import { View, Dimensions } from "react-native";
import { ThemeContext } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";
import { lightColors, darkColors } from "../globals/colors";

const vw = Dimensions.get("window").width;

export default function SkeletonLoading() {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  return (
    <View style={{ paddingBottom: 15 }}>
      <SkeletonAnimation>
        <View style={{ alignSelf: "center", alignItems: "center" }}>
          <View
            style={{
              marginTop: 25,
              marginBottom: 8,
              width: 180,
              height: 25,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
          <View
            style={{
              marginTop: 3,
              marginBottom: 8,
              width: 240,
              height: 25,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
          {[20, 10, 10, 10].map((m, i) => {
            return (
              <View
                style={{
                  marginTop: m,
                  marginBottom: 10,
                  width: 0.9 * vw,
                  height: 95,
                  borderRadius: 20,
                  backgroundColor: colors.Bone,
                }}
                key={String(i)}
              />
            );
          })}
        </View>
      </SkeletonAnimation>
    </View>
  );
}
