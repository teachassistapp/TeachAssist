import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";

export default function SkeletonAnimation(props) {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1700);
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
        width: "100%",
      }}
    >
      {props.children}
    </Animated.View>
  );
}
