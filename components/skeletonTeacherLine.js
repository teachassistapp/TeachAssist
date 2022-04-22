import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useTheme } from "../globals/theme";
import SkeletonContent from 'react-native-skeleton-content';

export default function SkeletonTeacherLine(props) {
  const { colors } = useTheme();

  return (
    <>
        <View style={styles(colors).skeletonTeacher}>
            <SkeletonContent
            containerStyle={{alignItems: 'flex-start'}}
            boneColor={colors.Bone}
            highlightColor={colors.Highlight}
            animationType="pulse"
            layout={[
            {
                key: 'name',
                marginTop: 15,
                marginBottom: 15,
                width: props.w,
                height: 25,
                borderRadius: 20
            }
            ]}
            />
            <SkeletonContent
            containerStyle={{ flexDirection: "row"}}
            boneColor={colors.Bone}
            highlightColor={colors.Highlight}
            animationType="pulse"
            layout={[
            {
                key: 'indicator1',
                marginTop: 15,
                marginBottom: 15,
                marginRight: 15,
                width: 25,
                height: 25,
                borderRadius: 20
            },
            {
                key: 'indicator2',
                marginTop: 15,
                marginBottom: 15,
                width: 25,
                height: 25,
                borderRadius: 20
            }
            ]}
            />
        </View>
    </>
  );
}

const styles = (colors) =>
  StyleSheet.create({

    skeletonTeacher: {
      alignSelf: 'center', 
      width: "88%", 
      flexDirection: "row", 
      justifyContent: 'space-between'
    },
  });
