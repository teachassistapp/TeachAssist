import React from "react";
import { View } from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";

export default function SkeletonTeacherDetails() {
  const { colors } = useTheme();
  const margins_heights = [
    [13, 135],
    [10, 55],
    [10, 55],
    [10, 55],
  ]; //[marginTop, height]
  return (
    <>
      {margins_heights.map((e, i) => {
        return (
          <SkeletonAnimation>
            <View style={{ alignSelf: "stretch", alignItems: "center" }}>
              <View
                style={{
                  marginTop: e[0],
                  marginBottom: 15,
                  width: "88%",
                  height: e[1],
                  borderRadius: 20,
                  backgroundColor: colors.Bone,
                }}
                key={String(i)}
              />
            </View>
          </SkeletonAnimation>
        );
      })}
    </>
  );
}
