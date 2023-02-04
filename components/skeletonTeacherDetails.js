import React, {useContext} from "react";
import { View } from "react-native";
import { ThemeContext } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";
import { lightColors, darkColors } from "../globals/colors";

export default function SkeletonTeacherDetails() {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  const margins_heights = [
    [2, 80],
    [22, 80],
    [5, 80],
    [5, 80],
  ]; //[marginTop, height]
  return (
    <>
      {margins_heights.map((e, i) => {
        return (
          <SkeletonAnimation key={String(i)}>
            <View style={{ alignSelf: "stretch", alignItems: "center" }}>
              <View
                style={{
                  marginTop: e[0],
                  marginBottom: 10,
                  width: "88%",
                  height: e[1],
                  borderRadius: 20,
                  backgroundColor: colors.Bone,
                }}
              />
            </View>
          </SkeletonAnimation>
        );
      })}
    </>
  );
}
