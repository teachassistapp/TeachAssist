import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonAnimation from "./skeletonAnimation";


export default function SkeletonTeacherDetails() {
  const { colors } = useTheme();

  return (
    <>
      <SkeletonAnimation>
        <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
          <View
          style={{
            marginTop: 13,
            marginBottom: 15,
            width: "88%",
            height: 135,
            borderRadius: 20,
            backgroundColor: colors.Bone
          }}
          />
        </View>
      </SkeletonAnimation>
      <SkeletonAnimation>
        <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
          <View
            style={{
              marginTop: 10,
              marginBottom: 15,
              width: "88%",
              height: 55,
              borderRadius: 20,
              backgroundColor: colors.Bone
            }}
          />
        </View>
      </SkeletonAnimation>
      <SkeletonAnimation>
        <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
          <View
            style={{
              marginTop: 10,
              marginBottom: 15,
              width: "88%",
              height: 55,
              borderRadius: 20,
              backgroundColor: colors.Bone
            }}
          />
        </View>
      </SkeletonAnimation>
      <SkeletonAnimation>
        <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
          <View
            style={{
              marginTop: 10,
              marginBottom: 15,
              width: "88%",
              height: 55,
              borderRadius: 20,
              backgroundColor: colors.Bone
            }}
          />
        </View>
      </SkeletonAnimation>
    </>
  );
}
