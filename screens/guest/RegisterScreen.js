import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "../../config/Colors";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/authActions";
import DropDownUserRole from "../../components/register/DropDownUserRole";
import DropDownProfileSetting from "../../components/register/DropDownProfileSetting";

const RegisterScreen = ({ navigation }) => {
  const [selectedUserRole, setSelectedUserRole] = useState(0);
  const [selectedProfileSetting, setSelectedProfileSetting] = useState(0);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { colors } = useTheme();
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for login error
    if (error.id === "REGISTER_FAIL") {
      setMsg(error.msg.msg);
    } else {
      setMsg(null);
    }
  }, []);

  const handleRegister = () => {
    const userRole = selectedUserRole !== undefined ? selectedUserRole : 0;
    const userSetting =
      selectedProfileSetting !== undefined ? selectedProfileSetting : 0;
    const user = {
      name: username,
      firstName,
      lastName,
      email,
      password,
      isAdminAccount: userRole,
      isPrivate: userSetting,
    };

    if (!validateUsername(username)) {
      setUsernameError(
        "Username can only contain letters, numbers, underscores, and periods. No spaces allowed."
      );
      return;
    }
    setUsernameError(""); // Clear username error message

    if (!validateName(firstName)) {
      setFirstNameError("Please enter a valid first name.");
      return;
    }
    setFirstNameError(""); // Clear first name error message

    if (!validateName(lastName)) {
      setLastNameError("Please enter a valid last name.");
      return;
    }
    setLastNameError(""); // Clear last name error message

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(""); // Clear email error message

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must have a minimum length of 8 characters and contain at least one lowercase letter, one uppercase letter, and one digit."
      );
      return;
    }
    setPasswordError(""); // Clear password error message

    // Attempt to register
    dispatch(register(user));
  };

  const handleUserRoleSelect = (index) => {
    setSelectedUserRole(index);
  };

  const handleProfileSettingSelect = (index) => {
    setSelectedProfileSetting(index);
  };

  const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.]+$/;
    return (
      username.trim() !== "" &&
      usernamePattern.test(username) &&
      !/\s/.test(username)
    );
  };

  const validateName = (name) => {
    const namePattern = /^[a-zA-Z]+$/;
    return namePattern.test(name);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\s*$/i;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.blue }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView style={{ backgroundColor: Colors.blue }}>
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome to Athletia!</Text>
          {msg ? (
            <View style={styles.alert}>
              <Text style={{ color: colors.text }}>{msg}</Text>
            </View>
          ) : null}
          <Text style={{ color: "orange", width: "100%" }}>
            * Organization Admins can create/manage Organizations
          </Text>
          <DropDownUserRole
            selectedValue={selectedUserRole}
            onSelect={handleUserRoleSelect}
          />

          <Text style={{ color: "orange", width: "100%" }}>
            * Public: anyone can see which events you are attending
          </Text>
          <Text style={{ color: "orange", width: "100%" }}>
            {`   you can change this setting later`}
          </Text>
          <DropDownProfileSetting
            selectedValue={selectedProfileSetting}
            onSelect={handleProfileSettingSelect}
            listColor={{ color: "black" }}
          />

          <TextInput
            style={{
              color: colors.text,
              ...styles.input,
            }}
            placeholder={"Username"}
            placeholderTextColor={Colors.placeholder}
            value={username}
            onChangeText={setUsername}
          />

          {usernameError ? (
            <View style={{ alignSelf: "left" }}>
              <Text style={{ color: "#FFA500" }}>* {usernameError}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={Colors.placeholder}
            value={firstName}
            onChangeText={setFirstName}
          />
          {firstNameError ? (
            <View style={{ alignSelf: "left" }}>
              <Text style={{ color: "#FFA500" }}>* {firstNameError}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={Colors.placeholder}
            value={lastName}
            onChangeText={setLastName}
          />
          {lastNameError ? (
            <View style={{ alignSelf: "left" }}>
              <Text style={{ color: "#FFA500" }}>* {lastNameError}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder={
              selectedUserRole === 0 ? "Email" : "Organization Email"
            }
            placeholderTextColor={Colors.placeholder}
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? (
            <View style={{ alignSelf: "left" }}>
              <Text style={{ color: "#FFA500" }}>* {emailError}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? (
            <View style={{ alignSelf: "left" }}>
              <Text style={{ color: "#FFA500" }}>* {passwordError}</Text>
            </View>
          ) : null}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text
                style={{
                  color: colors.text,
                  ...styles.buttonLabel,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text
                style={{
                  color: colors.text,
                  ...styles.buttonLabel,
                }}
              >
                Already a User?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: Dimensions.get("window").width - 40,
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
  buttonLabel: {
    fontSize: 20,
    padding: 10,
    color: "#24a0ed",
  },
  alert: {
    backgroundColor: "#FFA500",
    width: Dimensions.get("window").width - 40,
    borderRadius: 10,
    padding: 10,
  },
});

export default RegisterScreen;
