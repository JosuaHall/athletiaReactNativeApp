import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";
import InputField from "./../../components/InputField";
import CreateButton from "./../../components/CreateButton";
import { useDispatch, useSelector } from "react-redux";
import { sendResetPasswordLink } from "../../actions/authActions";

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const isResetLinkSent = useSelector((state) => state.auth.isResetLinkSent);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    // Check for login error
    if (error.id === "RESET_PASSWORD_LINK_FAILED") {
      setEmailError(error.msg.msg);
    } else {
      setEmailError(null);
    }
  }, [error]);

  const handleResetLink = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(""); // Clear email error message
    dispatch(sendResetPasswordLink(email.trim()));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\s*$/i;
    return emailPattern.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", ...styles.title }}>
        Forgot your Password?
      </Text>
      <Text style={{ color: "white", ...styles.subtitle }}>
        Please enter your Email address:
      </Text>
      {emailError ? (
        <View style={{ alignSelf: "left" }}>
          <Text style={{ color: "#FFA500" }}>* {emailError}</Text>
        </View>
      ) : null}
      <InputField
        placeholder={"Email Adress"}
        onInput={setEmail}
        styling={{ backgroundColor: "white", color: "black" }}
      ></InputField>
      <CreateButton
        onPress={handleResetLink}
        label={"Request a reset link"}
      ></CreateButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.blue,
    padding: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    margin: 20,
  },
});

export default ForgotPasswordScreen;
