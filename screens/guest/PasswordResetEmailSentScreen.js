import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";
import InputField from "./../../components/InputField";
import CreateButton from "./../../components/CreateButton";
import { useDispatch, useSelector } from "react-redux";

const PasswordResetEmailSentScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const isResetLinkSent = useSelector(
    (state) => state.auth.passwordResetLinkSent
  );

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", ...styles.subtitle }}>
        {isResetLinkSent.msg}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    margin: 20,
    textAlign: "center",
  },
});

export default PasswordResetEmailSentScreen;
