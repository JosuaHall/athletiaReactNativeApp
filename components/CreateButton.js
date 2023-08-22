import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

const CreateButton = ({ onPress, label, styling, isDisabled }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        ...styles.createButton,
        ...styling,
      }}
    >
      <Text style={{ color: "white" }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#008080",
  },
});

export default CreateButton;
