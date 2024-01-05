import React, { useEffect, useState, useRef } from "react";
import { useColorScheme } from "react-native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  loadUser,
  setNotificationData,
  setPushNotificationsForEventsOfFollowedOrganizations,
} from "./actions/authActions";
import * as Notifications from "expo-notifications";
//import * as Application from "expo-application";
//import { startTutorial } from "./actions/tutorialActions";

import { verifyEmail, verifyPasswordResetLink } from "./actions/authActions";
import * as Location from "expo-location";
import {
  initializeNotificationListeners,
  cleanupNotificationListeners,
  registerForPushNotificationsAsync,
} from "./config/notificationUtils";

const AppMain = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [expoPushToken, setExpoPushToken] = useState("");
  const user = useSelector((state) => state.auth.user);

  //let colorScheme = useColorScheme();
  const url = Linking.useURL();

  useEffect(() => {
    //checkFirstTimeUser();
    dispatch(loadUser());
    requestLocationPermission();

    // push notification
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // notification listeners setup with handleNotificationClick
    const listeners = initializeNotificationListeners(handleNotificationClick);

    return () => {
      // cleanup on unmount or app closure
      Notifications.removeNotificationSubscription(
        listeners.notificationListener
      );
      Notifications.removeNotificationSubscription(listeners.responseListener);
      cleanupNotificationListeners(listeners);
    };
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(
        setPushNotificationsForEventsOfFollowedOrganizations(
          user?.organizations_followed
        )
      );
    }
  }, [user]);

  const handleNotificationClick = (data) => {
    const { event_id, date_time, orgid } = data;

    // Dispatch Redux action with event_id and orgid
    dispatch(setNotificationData({ event_id, date_time, orgid }));
  };

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

  /*const checkFirstTimeUser = async () => {
    try {
      // Get the stored first-time user flag
      const isFirstTimeUser = await AsyncStorage.getItem("firstTimeUser");

      if (isFirstTimeUser === null || isFirstTimeUser === undefined) {
        // User is a first-time user
        // Display first-time user information/help messages
        // ...

        dispatch(startTutorial());
        // Uncomment the line below to update the first-time user flag
        // await AsyncStorage.setItem('firstTimeUser', 'true');
      }

      // Continue with your app initialization logic
    } catch (error) {
      console.error("Error checking first-time user:", error.message);
    }
  };*/

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
