import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";
import InputField from "./../../components/InputField";
import CreateButton from "./../../components/CreateButton";
import { useDispatch, useSelector } from "react-redux";
import { submitNewPassword } from "../../actions/authActions";

const ResetPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const passwordResetToken = useSelector(
    (state) => state.auth.passwordResetToken
  );

  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [msg, setMsg] = useState("");

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  const handleResetLink = () => {
    if (password !== verifiedPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setMsg("");

    // Additional password validation
    if (!validatePassword(password)) {
      setMsg(
        "Password should contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long"
      );
      return;
    }

    // Dispatch the action to submit the new password

    dispatch(submitNewPassword(passwordResetToken, password.trim()));
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", ...styles.title }}>User Details</Text>
      <Text style={{ color: "white", ...styles.subtitle }}>
        Please enter your new Password:
      </Text>
      <InputField
        placeholder={"New Password"}
        onInput={setPassword}
        secureTextEntry
      />
      <Text style={{ color: "white", ...styles.subtitle }}>
        Please verify your new Password:
      </Text>
      <InputField
        placeholder={"Validate New Password"}
        onInput={setVerifiedPassword}
        secureTextEntry
      />
      {msg !== "" && <Text style={styles.errorText}>{msg}</Text>}
      <CreateButton onPress={handleResetLink} label={"Submit"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    padding: 20,
    paddingVertical: 80,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default ResetPasswordScreen;
