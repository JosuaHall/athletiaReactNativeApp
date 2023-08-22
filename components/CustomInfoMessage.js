import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomInfoMessage = ({ msg, toggle }) => {
  return (
    <>
      <View style={styles.infoContainer}>
        <Ionicons
          name="ios-information-circle-outline"
          size={20}
          color="orange"
        />
        <Text style={{ ...styles.infoText }}>{msg}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff761a",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: "57%",
    width: Dimensions.get("window").width - 80,
    zIndex: 1,
  },
  infoText: {
    color: colors.text,
    textAlign: "left",
    paddingLeft: 10,
  },
  alertCard: {
    padding: 10,
  },
});

export default CustomInfoMessage;
