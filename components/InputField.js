import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "../config/Colors";

const InputField = ({
  placeholder,
  onInput,
  value,
  styling,
  secureTextEntry,
}) => {
  const { colors } = useTheme();

  const clearInput = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.searchHeaderContainer}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={80}
    >
      <View
        style={{
          backgroundColor: colors.card,
          ...styles.searchContainer,
          ...styling,
        }}
      >
        <TextInput
          style={{ color: colors.text, ...styles.input, ...styling }}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          value={value}
          onBlur={clearInput}
          onChangeText={onInput}
          secureTextEntry={secureTextEntry ? secureTextEntry : false}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  searchHeaderContainer: {
    flexDirection: "row",
  },
  searchContainer: {
    flex: 1,
    width: Dimensions.get("window").width - 30,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  input: {
    flex: 1,
    textAlign: "center",
    height: "100%",
  },
});

export default InputField;
