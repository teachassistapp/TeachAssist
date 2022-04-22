import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonTeacherLine from './skeletonTeacherLine';
import SkeletonContent from 'react-native-skeleton-content';

export default function SkeletonLoading() {
  const { colors } = useTheme();

  return (
    <>
        <SkeletonContent
            containerStyle={{alignSelf: 'center', alignItems: 'center'}}
            boneColor={colors.Container}
            highlightColor={colors.Selected}
            animationType="pulse"
            layout={[{
            key: 'button',
            marginTop: 15,
            marginBottom: 15,
            width: 180,
            height: 30,
            borderRadius: 20
            }]}
        />
        <SkeletonTeacherLine w={180}/>
        <SkeletonTeacherLine w={140}/>
        <SkeletonTeacherLine w={170}/>
        <SkeletonTeacherLine w={180}/>
        <SkeletonTeacherLine w={140}/>
    </>
  );
}
