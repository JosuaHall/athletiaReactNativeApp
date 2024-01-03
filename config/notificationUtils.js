import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize notification listeners
export function initializeNotificationListeners(handleNotificationClick) {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
      // Remove all delivered notifications when a notification is opened
      // Call the callback function with the notification data
      if (handleNotificationClick) {
        handleNotificationClick(response.notification.request.content.data);
      }
      //Notifications.removeAllDeliveredNotificationsAsync();
    });

  return { notificationListener, responseListener };
}

// Clean up notification listeners
export function cleanupNotificationListeners(listeners) {
  Notifications.removeNotificationSubscription(listeners.notificationListener);
  Notifications.removeNotificationSubscription(listeners.responseListener);
}

//24 hours before event date_time
// Function to calculate trigger seconds
function calculateTriggerSeconds(eventDateTime) {
  const eventDate = new Date(eventDateTime);
  const currentDate = new Date();

  // Calculate the difference in seconds between the event date and the current date
  return Math.max(Math.floor((eventDate - currentDate) / 1000) - 86400, 0);
}

// Function to retrieve stored notifications from AsyncStorage
async function getStoredNotifications() {
  const storedNotifications = await AsyncStorage.getItem(
    "scheduledNotifications"
  );
  return storedNotifications
    ? new Map(JSON.parse(storedNotifications))
    : new Map();
}

// Function to update stored notifications in AsyncStorage
async function updateStoredNotifications(scheduledNotifications) {
  await AsyncStorage.setItem(
    "scheduledNotifications",
    JSON.stringify([...scheduledNotifications])
  );
}

// Schedule a push notification /   orgid is the followed organization id
export async function schedulePushNotification(event, orgid) {
  const { _id, date_time } = event;
  const trigger = calculateTriggerSeconds(date_time);

  if (trigger > 0) {
    const notificationId = `${orgid}_${_id}`; // Create a unique identifier for the notification

    // Retrieve stored notifications from AsyncStorage
    const storedNotifications = await getStoredNotifications();

    // Check if the notification with the identifier already exists
    if (storedNotifications.has(notificationId)) {
      // Retrieve the stored date_time and original trigger values
      const storedDateTime = storedNotifications.get(notificationId).date_time;
      const originalTrigger = storedNotifications.get(notificationId).trigger;

      // Check if date_time has changed
      if (storedDateTime !== date_time) {
        // Cancel the existing notification
        await Notifications.cancelScheduledNotificationAsync(notificationId);

        // Schedule a new notification with the updated date_time and trigger
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Athletia",
            body: "See who is going to your next event.",
            data: { event_id: _id, date_time, orgid: orgid },
          },
          trigger: {
            seconds: trigger,
          },
        });

        // Update the date_time and trigger in the stored notifications map
        storedNotifications.set(notificationId, { date_time, trigger });

        // Update stored notifications in AsyncStorage
        await updateStoredNotifications(storedNotifications);

        console.log(`Notification updated for event: ${_id}`);
      } else {
        console.log(`Notification already scheduled for event: ${_id}`);
      }
    } else {
      // Schedule a new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Athletia",
          body: "See who is going to your next event.",
          data: { event_id: _id, date_time, orgid: orgid },
        },
        trigger: {
          seconds: trigger,
        },
      });

      // Add the identifier, date_time, and trigger to the map after scheduling
      storedNotifications.set(notificationId, { date_time, trigger });

      // Update stored notifications in AsyncStorage
      await updateStoredNotifications(storedNotifications);
    }
  }
}

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  });
  console.log(token);

  return token;
}

// Function to cancel notifications for a specific organization
export async function cancelNotificationsForOrganization(orgid) {
  try {
    // Get all scheduled notifications
    const allScheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    // Filter notifications based on the orgid
    const orgNotifications = allScheduledNotifications.filter(
      (notification) => {
        const data = notification.content.data;
        return data && data.orgid === orgid;
      }
    );

    // Cancel each notification
    for (const notification of orgNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
      console.log(
        `Cancelled notification for event: ${notification.content.data.event_id}`
      );
    }
  } catch (error) {
    console.error("Error cancelling notifications:", error.message);
  }
}
