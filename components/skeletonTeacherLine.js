import React, {useContext} from "react";
import { View } from "react-native";
import { ThemeContext } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";
import { lightColors, darkColors } from "../globals/colors";

export default function SkeletonTeacherLine(props) {
  const { theme, setTheme } = useContext(ThemeContext);
const colors = theme === "light" ? lightColors : darkColors;

  return (
    <>
      <SkeletonAnimation>
        <View
          style={{
            alignSelf: "center",
            width: "88%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "flex-start" }}>
            <View
              style={{
                marginVertical: 15,
                width: props.w,
                height: 25,
                borderRadius: 20,
                backgroundColor: colors.Bone,
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            {["0", "1"].map((i) => (
              <View
                style={{
                  marginVertical: 15,
                  marginRight: 15,
                  width: 25,
                  height: 25,
                  borderRadius: 20,
                  backgroundColor: colors.Bone,
                }}
                key={i}
              />
            ))}
          </View>
        </View>
      </SkeletonAnimation>
    </>
  );
}
