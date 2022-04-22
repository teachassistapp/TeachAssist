import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonContent from 'react-native-skeleton-content';

export default function SkeletonTeacherDetails() {
  const { colors } = useTheme();

  return (
    <>
        <SkeletonContent
            containerStyle={{alignSelf: 'stretch', alignItems: 'center'}}
            boneColor={colors.Container}
            highlightColor={colors.Selected}
            animationType="pulse"
            layout={[{
            key: 'info',
            marginTop: 13,
            marginBottom: 15,
            width: "88%",
            height: 135,
            borderRadius: 20
            }]}
        />
        <SkeletonContent
            containerStyle={{alignSelf: 'stretch', alignItems: 'center'}}
            boneColor={colors.Container}
            highlightColor={colors.Selected}
            animationType="pulse"
            layout={[{
            key: 'info',
            marginTop: 10,
            marginBottom: 15,
            width: "88%",
            height: 55,
            borderRadius: 20
            }]}
        />
        <SkeletonContent
            containerStyle={{alignSelf: 'stretch', alignItems: 'center'}}
            boneColor={colors.Container}
            highlightColor={colors.Selected}
            animationType="pulse"
            layout={[{
            key: 'info',
            marginTop: 10,
            marginBottom: 15,
            width: "88%",
            height: 55,
            borderRadius: 20
            }]}
        />
        <SkeletonContent
            containerStyle={{alignSelf: 'stretch', alignItems: 'center'}}
            boneColor={colors.Container}
            highlightColor={colors.Selected}
            animationType="pulse"
            layout={[{
            key: 'info',
            marginTop: 10,
            marginBottom: 15,
            width: "88%",
            height: 55,
            borderRadius: 20
            }]}
        />
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({

    skeleton: {
      alignSelf: 'center', 
      width: "88%", 
    },
  });
