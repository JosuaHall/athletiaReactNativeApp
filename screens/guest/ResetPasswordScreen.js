import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";
import InputField from "./../../components/InputField";
import CreateButton from "./../../components/CreateButton";
import { useDispatch, useSelector } from "react-redux";
import { submitNewPassword } from "../../actions/authActions";
import { Ionicons } from "@expo/vector-icons";

const ResetPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const passwordResetToken = useSelector(
    (state) => state.auth.passwordResetToken
  );

  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifiedPassword, setShowVerifiedPassword] = useState(false);
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
      <View style={styles.passwordContainer}>
        <InputField
          placeholder={"New Password"}
          onInput={setPassword}
          secureTextEntry={!showPassword}
        />
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={20}
          color={"black"}
          style={styles.visibilityIcon}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <Text style={{ color: "white", ...styles.subtitle }}>
        Please verify your new Password:
      </Text>
      <View style={styles.passwordContainer}>
        <InputField
          placeholder={"Validate New Password"}
          onInput={setVerifiedPassword}
          secureTextEntry={!showVerifiedPassword}
        />
        <Ionicons
          name={showVerifiedPassword ? "eye-off" : "eye"}
          size={20}
          color={"black"}
          style={styles.visibilityIcon}
          onPress={() => setShowVerifiedPassword(!showVerifiedPassword)}
        />
      </View>
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
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  visibilityIcon: {
    position: "absolute",
    right: 15,
    top: 19,
  },
});

export default ResetPasswordScreen;
