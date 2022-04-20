import React, { useEffect, useState, useCallback } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../globals/theme";

const ProgressBar = (props) => {
  const { colors } = useTheme();
  let {
    height,
    progress,
    animated,
    indeterminate,
    progressDuration,
    indeterminateDuration,
    onCompletion,
    backgroundColor,
    useDriver,
  } = props;

  const [timer] = useState(new Animated.Value(0));
  const [width] = useState(new Animated.Value(0));

  const indeterminateAnimation = Animated.timing(timer, {
    duration: indeterminateDuration,
    toValue: 1,
    useNativeDriver: useDriver,
    isInteraction: false,
  });

  useEffect(() => {
    if (indeterminate || typeof progress === "number") {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [indeterminate, progress, startAnimation, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (indeterminate) {
      timer.setValue(0);
      Animated.loop(indeterminateAnimation).start();
    } else {
      Animated.timing(width, {
        duration: animated ? progressDuration : 0,
        toValue: progress,
        useNativeDriver: useDriver,
      }).start(() => {
        onCompletion();
      });
    }
  }, [
    animated,
    indeterminate,
    indeterminateAnimation,
    onCompletion,
    progress,
    progressDuration,
    timer,
    width,
  ]);

  const stopAnimation = useCallback(() => {
    if (indeterminateAnimation) indeterminateAnimation.stop();

    Animated.timing(width, {
      duration: 200,
      toValue: 0,
      useNativeDriver: useDriver,
      isInteraction: false,
    }).start();
  }, [indeterminateAnimation, width]);

  const styles = 
    StyleSheet.create({
      container: {
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 4,
      },
      progressBar: {
        flex: 1,
        borderRadius: height / 2,
      },
    });

  const styleAnimation = () => {
    return indeterminate
      ? {
          transform: [
            {
              translateX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [-0.6 * 320, -0.5 * 0.8 * 320, 0.7 * 320],
              }),
            },
            {
              scaleX: timer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.0001, 0.8, 0.0001],
              }),
            },
          ],
        }
      : {
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        };
  };

  return (
    <View>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.GraphBackground },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor,
              ...styleAnimation(),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

ProgressBar.defaultProps = {
  state: "black",
  height: 2,
  progress: 0,
  animated: true,
  indeterminate: false,
  indeterminateDuration: 1100,
  progressDuration: 1100,
  onCompletion: () => {},
  useDriver: false,
};

export default ProgressBar;
