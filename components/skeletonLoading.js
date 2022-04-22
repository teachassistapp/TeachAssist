import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonTeacher from './skeletonTeacher';
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
        <SkeletonTeacher w={180}/>
        <SkeletonTeacher w={140}/>
        <SkeletonTeacher w={170}/>
        <SkeletonTeacher w={180}/>
        <SkeletonTeacher w={140}/>
    </>
  );
}

const vw = Dimensions.get("window").width;

const styles = (colors) =>
  StyleSheet.create({

    skeletonTeacher: {
      alignSelf: 'center', 
      width: "88%", 
      flexDirection: "row", 
      justifyContent: 'space-between'
    },
  });
