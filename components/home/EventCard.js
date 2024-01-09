//EventCard.js
import React, { useState, useEffect, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CreateButton from "./../CreateButton";
import moment from "moment-timezone";
import * as Location from "expo-location";
import Colors from "../../config/Colors";
import debounce from "lodash/debounce";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DeleteButton from "../DeleteButton";
import { updatePoints } from "../../actions/organizationActions";

const EventCard = ({
  item,
  onPress,
  onUnattendingPress,
  onShowPeopleGoing,
  navigation,
  onShare,
}) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const userid = useSelector((state) => state.auth.user._id);
  const orgLocation = useSelector(
    (state) => state.organization.homeSelectedOrg.location
  );
  const orgid = useSelector((state) => state.organization.homeSelectedOrg._id);
  const user = useSelector((state) => state.auth.user);
  const leaderboards = useSelector(
    (state) => state.organization.allLeaderboards
  );

  const [isGoing, setIsGoing] = useState(false);
  const [loading, setLoading] = useState(false);
  const mongoDBDate = new Date(item.date_time);

  const getFormattedDate = (date) => {
    const mongoDBDate = new Date(date);
    const timeString = mongoDBDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const timezoneAbbreviation = mongoDBDate
      .toLocaleTimeString("en-US", {
        timeZoneName: "short",
      })
      .split(" ")[2];

    return `${mongoDBDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}  @ ${timeString} ${timezoneAbbreviation}`;
  };

  useEffect(() => {
    const isAttending = item.people_attending.some(
      (user) => user._id === userid
    );
    if (isAttending) {
      setIsGoing(true);
    } else {
      setIsGoing(false);
    }
  }, []);

  const toggleIsGoingButton = () => {
    setIsGoing(!isGoing);
  };

  const handleAttendingPress = (e, event) => {
    toggleIsGoingButton();
    onPress(e, event);
  };

  const handleUnattendingPress = (e, event) => {
    toggleIsGoingButton();
    onUnattendingPress(e, event);
  };

  const handleShowPeopleGoing = (event, attending_list) => {
    onShowPeopleGoing(event, attending_list);
  };

  const openStreamLink = async (link) => {
    const isValid = await Linking.canOpenURL(link);

    if (isValid) {
      Linking.openURL(link).catch((err) =>
        console.error("Failed to open link:", err)
      );
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show("Invalid link", ToastAndroid.SHORT);
      } else {
        Alert.alert("Invalid link", null, [{ text: "OK", onPress: () => {} }]);
      }
    }
  };

  const handleShareIconPress = () => {
    // Call the onShare callback to trigger the handleShare function
    if (typeof onShare === "function") {
      onShare();
    }
  };

  const openLocationInMaps = (address) => {
    const query = encodeURIComponent(address);
    let mapsUrl = "";

    if (Platform.OS === "ios") {
      // Apple Maps URL scheme
      mapsUrl = `maps://?q=${query}`;
    } else if (Platform.OS === "android") {
      // Google Maps URL
      mapsUrl = `https://maps.google.com/maps?q=${query}`;
    }

    Linking.canOpenURL(mapsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapsUrl);
        } else {
          console.log("Maps app is not installed.");
        }
      })
      .catch((error) => console.log("An error occurred", error));
  };

  const attendingNumber =
    item.people_attending.length !== 0
      ? isGoing
        ? item.people_attending.length - 1
        : item.people_attending.length
      : 0;

  const shouldDisplayButton = () => {
    const currentDate = new Date();
    const itemDateTime = new Date(item.date_time);
    const timeDifference = itemDateTime.getTime() - currentDate.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (leaderboards) {
      const hasMatchingLeaderboard = leaderboards?.some((leaderboard) => {
        if (leaderboard.organization._id === orgid && !leaderboard.team) {
          return (
            itemDateTime >= new Date(leaderboard.startDate) &&
            itemDateTime <= new Date(leaderboard.endDate)
          );
        }
        if (leaderboard.organization._id === orgid) {
          return (
            itemDateTime >= new Date(leaderboard.startDate) &&
            itemDateTime <= new Date(leaderboard.endDate) &&
            leaderboard.team === item.teamid
          );
        }
      });

      return (
        ((hoursDifference <= 3 && hoursDifference >= 0) ||
          isSameDay(currentDate, itemDateTime)) &&
        isWithinThreeHours(itemDateTime, currentDate) &&
        hasMatchingLeaderboard
      );
    } else {
      return false;
    }
  };

  //set eventsAttended to state, then compare if it changed. If it did rerender
  const pointsAlreadyClaimed = () => {
    const eventsAttended = [];

    for (const entry of leaderboards) {
      const ranking = entry.ranking || [];
      for (const userEntry of ranking) {
        if (userEntry.user._id === userid) {
          eventsAttended.push(...userEntry.events_attended);
        }
      }
    }

    if (eventsAttended.includes(item.key)) return true;
    else return false;
  };

  const isWithinThreeHours = (startTime, currentTime) => {
    const timeDifference = startTime.getTime() - currentTime.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    return hoursDifference >= -3 && hoursDifference <= 0;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleClaimPoints = async () => {
    // Check if the user is attending the event
    const isAttending = item.people_attending.some(
      (user2) => user2._id === user._id
    );

    try {
      setLoading(true);
      // Get the user's current location
      const location = await getCurrentLocation();

      const userLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const eventLocation = item.event_location
        ? {
            latitude: item.event_location.latitude,
            longitude: item.event_location.longitude.$numberDecimal,
          }
        : {
            latitude: orgLocation.latitude,
            longitude: orgLocation.longitude.$numberDecimal,
          };

      const isLocationProximity = checkLocationProximity(
        userLocation,
        eventLocation
      );

      if (isAttending && isLocationProximity) {
        // User is attending and location is in proximity
        // Show modal with success message

        //dispatch redux action: calculatePoints(orgid, teamid, userid)
        dispatch(updatePoints(userid, item.teamid, orgid, item.key));
        Alert.alert(
          "Congratulations",
          "You have earned points for attending this event."
        );
        setLoading(false);
      } else if (!isAttending) {
        // User is not attending the event
        // Show modal with message indicating that the user did not attend
        Alert.alert(
          "Event Attendance",
          "You are not attending this event. Click on attend and try again."
        );
        setLoading(false);
      } else {
        // User is attending but location is not in proximity
        // Show modal with message indicating that the user is not at the event location
        Alert.alert(
          "Event Location",
          "You are not at the event location. To receive points, you need to be at the event location"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error retrieving user location:", error);
      setLoading(false);
      // Show an error modal or handle the error appropriately
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getLastKnownPositionAsync({});

        // Add a timeout for getLastKnownPositionAsync
        const timeout = setTimeout(async () => {
          location = await Location.getCurrentPositionAsync({});
          handleLocation(location.coords); // Call handleLocation with the coordinates
        }, 5000); // 5 seconds timeout

        // Handle the last known location
        if (location) {
          clearTimeout(timeout); // Clear the timeout if location is available
          return location.coords; // Return the coordinates
        }
      } else {
        // Handle the case when the user denies location permission
        console.log("Location permission denied");
        // You can show a message or take appropriate action based on your app's requirements
        return null; // Return null or handle the case where permission is denied
      }
    } catch (error) {
      console.error("Error retrieving user location:", error);
      // Show an error modal or handle the error appropriately
      return null; // Return null or handle the error case
    }
  };

  const checkLocationProximity = (userLocation, eventLocation) => {
    // Implement your logic here to check the proximity between userLocation and eventLocation
    // You can use appropriate methods or libraries for calculating distances between coordinates
    // Return true if the user's location is in proximity to the event location, otherwise return false
    // Example implementation using a hypothetical proximity check function:
    const proximityThreshold = 100; // Assuming proximity threshold in meters
    const distance = calculateDistance(userLocation, eventLocation);
    return distance <= proximityThreshold;
  };

  const calculateDistance = (location1, location2) => {
    // Implement your logic here to calculate the distance between two locations
    // You can use appropriate methods or libraries for calculating distances between coordinates
    // Return the distance between location1 and location2
    // Example implementation using a hypothetical distance calculation function:
    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;

    // Haversine formula to calculate distance
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert distance to meters

    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleClaimPointsDebounced = debounce(handleClaimPoints, 1000);

  const isDateOlderBy4Hours = (date) => {
    const currentDate = new Date();
    const timeDifference = currentDate - date; // Calculate the time difference in milliseconds
    const fourHoursInMilliseconds = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

    // Compare the time difference with 4 hours
    return timeDifference > fourHoursInMilliseconds;
  };
  const address = item.event_location?.address || orgLocation?.address || null;
  return (
    <View style={styles.container}>
      <View style={styles.socialHeader}>
        <Text style={{ color: colors.text, ...styles.attendingDescription }}>
          {isGoing ? (
            <Text
              style={{ color: colors.text, ...styles.attendingDescription }}
            >
              You &
            </Text>
          ) : null}{" "}
          {attendingNumber} others are attending this event:
        </Text>
        <TouchableOpacity
          onPress={(e) => handleShowPeopleGoing(e, item.people_attending)}
          style={styles.userContainer}
        >
          {item.people_attending.length !== 0 ? (
            <>
              {
                //This part adds the users profilePicture to the people Attending Header of an Event -> in case he attends this event
                //its purpose is to always show a users profilePicture in the preview(social header) of an event
                isGoing ? (
                  <View key={user._id}>
                    {user.profileImg !== "" && !user.isPrivate ? (
                      <Image
                        style={{ ...styles.profileImg, marginRight: -25 }}
                        source={{
                          uri: `${user.profileImg}`,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          color: colors.text,
                          ...styles.borderNoProfileImg,
                          borderColor: "#CCE8DB",
                          backgroundColor: colors.background,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: -25,
                        }}
                      >
                        <Ionicons
                          name="ios-person"
                          size={30}
                          color={colors.text}
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  ""
                ) //************************************** */
              }
              {
                //up to two other users are rendered as well, besides if a user is attending this event
                item.people_attending
                  .slice(0, isGoing ? 4 : 5)
                  .filter((user) => user._id !== userid)
                  .map((user, index) => (
                    <View key={user._id}>
                      {user.profileImg !== "" && !user.isPrivate ? (
                        <Image
                          style={{
                            ...styles.profileImg,
                            borderColor: "#FF9AA2",
                            zIndex: index,
                            marginRight: -25,
                          }}
                          source={{
                            uri: `${user.profileImg}`,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            color: colors.text,
                            ...styles.borderStranger,
                            borderColor: "#FF9AA2",
                            backgroundColor: colors.background,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: -25,
                          }}
                        >
                          <Ionicons
                            name="ios-person"
                            size={30}
                            color={colors.text}
                          />
                        </View>
                      )}
                    </View>
                  ))
              }
            </>
          ) : null}
          <View>
            <Text
              style={{
                color: colors.text,
                ...styles.border,
                backgroundColor: colors.background,
                borderColor: "#FFB7B2",
              }}
            >
              ..
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {isGoing ? (
        <DeleteButton
          onPress={
            !isDateOlderBy4Hours(mongoDBDate)
              ? (e) => handleUnattendingPress(e, item)
              : null // Set onPress to undefined if the condition is not met
          }
          label="unattend"
          styling={{
            marginHorizontal: 0,
            marginTop: 5,
            marginBottom: 10,
            color: isDateOlderBy4Hours(mongoDBDate) ? "grey" : "",
          }}
        ></DeleteButton>
      ) : (
        <CreateButton
          onPress={
            !isDateOlderBy4Hours(mongoDBDate)
              ? (e) => handleAttendingPress(e, item)
              : null // Set onPress to undefined if the condition is not met
          }
          label="attend"
          styling={{
            marginHorizontal: 0,
            marginTop: 5,
            marginBottom: 10,
            backgroundColor: isDateOlderBy4Hours(mongoDBDate)
              ? Colors.placeholder
              : "#008080",
          }}
        ></CreateButton>
      )}

      <View
        style={{
          ...styles.card,
          borderColor: item.home_away === "Home" ? "#99cc33" : "#ff9966",
          backgroundColor: isDateOlderBy4Hours(mongoDBDate)
            ? Colors.placeholder
            : "white",
        }}
      >
        <View style={styles.dateTime}>
          <Text style={{ color: "black" }}>
            {getFormattedDate(mongoDBDate)}
          </Text>
        </View>

        <Text style={styles.sport}>{item.sport}</Text>
        <View style={styles.opponent}>
          <Text
            style={{ color: item.home_away === "Home" ? "#99cc33" : "#ff9966" }}
          >
            {item.home_away === "Home" ? "vs." : "@"}{" "}
          </Text>
          <Text style={{}}>{item.opponent.name}</Text>
        </View>
        <Image
          style={styles.image}
          source={{
            uri: `${item.opponent.logo}`,
          }}
        />

        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          {item.link ? (
            <TouchableOpacity onPress={() => openStreamLink(item.link)}>
              <Ionicons
                name="ios-videocam-outline"
                size={30}
                color="black"
                style={{ paddingRight: 15, color: "grey" }}
              />
            </TouchableOpacity>
          ) : null}
          {address ? (
            <TouchableOpacity
              onPress={() => openLocationInMaps(address)}
              stlye={{ color: colors.text }}
            >
              <Ionicons
                name="ios-navigate-outline"
                size={30}
                color="black"
                style={{ paddingRight: 15, color: "grey" }}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={handleShareIconPress}
            stlye={{ color: colors.text }}
          >
            <Ionicons name="ios-share-outline" size={30} color="grey" />
          </TouchableOpacity>
        </View>
        {/* Display the button based on the condition 
        {shouldDisplayButton() && !pointsAlreadyClaimed() ? (
          <TouchableOpacity
            onPress={handleClaimPointsDebounced}
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 15,
              paddingHorizontal: 10,
              bottom: -23,
              width: 294,
              alignItems: "center",
              borderBottomEndRadius: 35,
              borderBottomStartRadius: 35,
              borderWidth: 3,
              borderColor: "transparent",
              zIndex: -1,
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" /> // Show loading indicator while loading
            ) : (
              <Text style={{ color: "white" }}>Claim Your Points Now!</Text>
            )}
          </TouchableOpacity>
        ) : (
          ""
        )}*/}
      </View>

      <View style={styles.amenities}>
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          Amenities:
        </Text>
        {item.amenities?.length === 0 ? (
          <Text style={{ color: colors.text }}>-</Text>
        ) : (
          item.amenities.map((amenity) => {
            return (
              <View key={amenity}>
                <Text style={{ color: colors.text }}>{amenity}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    zIndex: 1,
  },
  socialHeader: {
    height: 130,
    alignItems: "center",
    zIndex: 1,
  },
  attendingDescription: {
    height: 40,
    width: "140%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
    zIndex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    zIndex: 1,
  },
  border: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    padding: 28,
    borderRadius: 35,
    minHeight: 70,
    borderColor: "grey",
    overflow: "hidden",
    zIndex: 1,
  },
  borderStranger: {
    textAlign: "center",
    borderWidth: 3,
    borderRadius: 35,
    height: 70,
    width: 70,
    minHeight: 70,
    minHeight: 70,
    paddingVertical: 15,
    zIndex: 1,
  },
  borderNoProfileImg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderRadius: 35,
    height: 70,
    width: 70,
    minHeight: 70,
    minHeight: 70,
    borderColor: "grey",
    zIndex: 1,
  },
  profileImg: {
    width: 70,
    height: 70,
    borderColor: "#CCE8DB",
    borderWidth: 3,
    borderRadius: 35,
    zIndex: 1,
  },
  card: {
    height: 320,
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    borderRadius: 40,
    borderWidth: 3,
    width: "100%",
  },
  opponent: {
    flexDirection: "column",
    paddingBottom: 10,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
  },
  dateTime: {
    color: "black",
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderColor: "lightgrey",
    padding: 0,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  sport: {
    color: "red",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    paddingTop: 15,
    resizeMode: "contain",
  },
  amenities: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  location: { flex: 0.5 },
});

export default EventCard;
