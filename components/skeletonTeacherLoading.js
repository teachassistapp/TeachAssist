import React, {useContext} from "react";
import { View } from "react-native";
import { ThemeContext } from "../globals/theme";
import SkeletonTeacherLine from "./skeletonTeacherLine";
import SkeletonAnimation from "./skeletonAnimation";
import { lightColors, darkColors } from "../globals/colors";

export default function SkeletonLoading() {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;
  return (
    <>
      <SkeletonAnimation>
        <View style={{ alignSelf: "center", alignItems: "center" }}>
          <View
            style={{
              marginTop: 15,
              marginBottom: 15,
              width: 180,
              height: 30,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
        </View>
      </SkeletonAnimation>
      {[180, 140, 170, 180, 140].map((w, i) => {
        return <SkeletonTeacherLine w={w} key={String(i)} />;
      })}
    </>
  );
}
