import React, { useEffect, useState } from "react";
import { Appearance, useColorScheme, Alert, Platform } from "react-native";
import * as Linking from "expo-linking";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { useDispatch } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { loadUser } from "./actions/authActions";

import { verifyEmail, verifyPasswordResetLink } from "./actions/authActions";
import * as Location from "expo-location";

const AppMain = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  //let colorScheme = useColorScheme();
  const url = Linking.useURL();

  useEffect(() => {
    dispatch(loadUser());
    requestLocationPermission();
  }, []);

  const handleURL = (url) => {
    const { path, queryParams } = Linking.parse(url);
    if (path === "api/users/verify") {
      const { code } = queryParams;
      dispatch(verifyEmail({ verificationCode: code }));
    }
    if (path === "api/users/reset/password") {
      const { code } = queryParams;
      dispatch(verifyPasswordResetLink({ token: code }));
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      // Handle the case when the user denies location permission
      // You can show a message or take appropriate action based on your app's requirements
    } else {
      // Location permission is granted
      // You can do something here if needed
      console.log("Location permission granted");
    }
  };

  useEffect(() => {
    // Do something with URL
    if (url) {
      handleURL(url);
    }
  }, [url]);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppMain;
