import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../actions/authActions";
import { useTheme } from "@react-navigation/native";
import Colors from "../../config/Colors";

const LoginScreen = (/*{ onLogin }*/ { navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);

  useEffect(() => {
    // Check for login error
    if (error.id === "LOGIN_FAIL") {
      setMsg(error.msg.msg);
    } else {
      setMsg(null);
    }
  }, []);

  const handleLogin = () => {
    const user = {
      email,
      password,
    };

    //Attempt to Login
    dispatch(login(user));
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Athletia !</Text>
      {msg ? (
        <View style={styles.alert}>
          <Text style={{ color: colors.text }}>{msg}</Text>
        </View>
      ) : null}
      <TextInput
        style={{ color: colors.text, ...styles.input }}
        placeholder="Email"
        placeholderTextColor={Colors.placeholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.forgotPasswordLink}
        onPress={handleForgotPassword}
      >
        <Text
          style={{
            color: colors.text,
            ...styles.buttonForgotPassword,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View stlye={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text
            style={{
              color: colors.text,
              ...styles.buttonLabel,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text
            style={{
              color: colors.text,
              ...styles.buttonLabel,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.blue,
    flexGrow: 1,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    color: "white",
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
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: 340,
    marginVertical: 10,
  },
  forgotPasswordLink: {
    alignItems: "flex-start",
    width: 340,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 20,
    padding: 10,
    color: "#24a0ed",
  },
  alert: {
    backgroundColor: "#FFA500",
    width: Dimensions.get("window").width - 50,
    borderRadius: 10,
    padding: 10,
  },
  buttonForgotPassword: {
    fontSize: 15,
    color: "#24a0ed",
  },
});

export default LoginScreen;
