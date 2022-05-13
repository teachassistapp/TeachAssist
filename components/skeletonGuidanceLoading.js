import React from "react";
import { View, Dimensions } from "react-native";
import { useTheme } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";

const vw = Dimensions.get("window").width;

export default function SkeletonLoading() {
  const { colors } = useTheme();
  return (
    <>
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
          <View
            style={{
              marginTop: 20,
              marginBottom: 10,
              width: 0.9 * vw,
              height: 95,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 0.9 * vw,
              height: 95,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 0.9 * vw,
              height: 95,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 0.9 * vw,
              height: 95,
              borderRadius: 20,
              backgroundColor: colors.Bone,
            }}
          />
        </View>
      </SkeletonAnimation>
    </>
  );
}
