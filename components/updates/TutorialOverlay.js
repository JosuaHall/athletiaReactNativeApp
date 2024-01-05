// TutorialOverlay.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const TutorialOverlay = ({ position }) => {
  const { colors } = useTheme();

  // Extract position information
  const { x, y, width, height } = position;

  // Calculate circle position and size based on the provided information
  const circleRadius = Math.max(width, height) / 2;
  const circlePosition = {
    top: y + height / 2 - circleRadius,
    left: x + width / 2 - circleRadius,
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.mask, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.circle,
            {
              width: circleRadius * 2,
              height: circleRadius * 2,
              borderRadius: circleRadius,
              backgroundColor: "transparent",
              borderColor: colors.text, // Set the color of the circular border
              borderWidth: 2, // Set the width of the circular border
              ...circlePosition,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // Adjust the zIndex to ensure the overlay is on top
  },
  mask: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Set the color and transparency of the overlay
  },
  circle: {
    position: "absolute",
  },
});

export default TutorialOverlay;
