import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InfoIcon = ({ height, onToggleInfo }) => {
  // Get the height of the screen
  const screenHeight = Dimensions.get("window").height;

  // Calculate the top position as a percentage of the screen height
  const topPosition = screenHeight * height; // Adjust the multiplier as needed
  return (
    <TouchableOpacity
      onPress={onToggleInfo}
      style={{
        position: "absolute",
        top: `${topPosition}%`,
        right: 30,
      }}
    >
      <Ionicons
        name="ios-information-circle-outline"
        size={25}
        color="orange"
      />
    </TouchableOpacity>
  );
};

export default InfoIcon;
