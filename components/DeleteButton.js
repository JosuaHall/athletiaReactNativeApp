import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

const DeleteButton = ({ onPress, label, styling }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        ...styles.deleteButton,
        ...styling,
      }}
    >
      <Text style={{ color: "white" }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#7F0000",
  },
});

export default DeleteButton;
