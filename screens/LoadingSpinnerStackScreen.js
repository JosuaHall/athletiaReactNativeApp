// LoadingSpinnerStackScreen.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const LoadingSpinnerStackScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background, ...styles.container }}>
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: options.background,
    //color: options.text,
  },
});

export default LoadingSpinnerStackScreen;
