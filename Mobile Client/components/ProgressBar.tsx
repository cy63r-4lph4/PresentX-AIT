import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface ProgressBarProps {
  total: number;
  completed: number;
  duration?: number; // optional animation duration
}

const ProgressBar = ({
  total,
  completed,
  duration = 500,
}: ProgressBarProps) => {
  const progress = Math.min(completed / total, 1); // Ensure it doesn't exceed 100%
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="w-full h-4 bg-white rounded-full overflow-hidden">
      <Animated.View
        className="bg-purple-500 h-full rounded-full"
        style={{ width: widthInterpolated }}
      />
    </View>
  );
};

export default ProgressBar;
