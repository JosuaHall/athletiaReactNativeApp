import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../../actions/authActions";

const EmailVerificationScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const verifyCode = () => {
    if (!code) {
      return setMsg("Please enter your Verification Code!");
    }
    setMsg("");
    dispatch(verifyEmail({ verificationCode: code }));
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", ...styles.title }}>
        Email Verification
      </Text>
      <Text style={{ color: "white", ...styles.subtitle }}>
        Please verify your email to continue.
      </Text>
      {msg ? (
        <View style={styles.alert}>
          <Text style={{ color: colors.text }}>{msg}</Text>
        </View>
      ) : null}
      <TextInput
        style={{ color: colors.text, ...styles.input }}
        placeholder="Enter Code.."
        placeholderTextColor={Colors.placeholder}
        value={code}
        onChangeText={setCode}
      />
      <View style={{ color: colors.text, ...styles.button }}>
        <Button title="Verify" onPress={verifyCode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 60,
    width: Dimensions.get("window").width - 50,
    borderColor: "#d3d8dd",
    borderRadius: 10,
    borderWidth: 1,
    margin: 20,
    padding: 20,
    color: "white",
  },
  button: {
    alignItems: "center",
  },
  alert: {
    backgroundColor: "#FFA500",
    width: Dimensions.get("window").width - 50,
    borderRadius: 10,
    padding: 10,
  },
});

export default EmailVerificationScreen;
