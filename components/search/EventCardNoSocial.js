import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const EventCardNoSocial = ({ item }) => {
  const { colors } = useTheme();
  const mongoDBDate = new Date(item.date_time);
  const orgLocation = useSelector(
    (state) => state.organization.foundOrg.location
  );
  const formattedDate = `${mongoDBDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}  @ ${mongoDBDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  })}`;

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

  const address = item.event_location?.address || orgLocation?.address || null;
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.card,
          borderColor: item.home_away === "Home" ? "#59db56" : "#ff9966",
        }}
      >
        <View style={styles.dateTime}>
          <Text>{formattedDate}</Text>
        </View>

        <Text style={styles.sport}>{item.sport}</Text>
        <View style={styles.opponent}>
          <Text
            style={{ color: item.home_away === "Home" ? "#59db56" : "#ff9966" }}
          >
            {item.home_away === "Home" ? "Home vs." : "Away @"}{" "}
          </Text>
          <Text style={{}}>{item.opponent.name}</Text>
        </View>
        <Image
          style={styles.image}
          source={{
            uri: `${item.opponent.logo}`,
          }}
        />

        <View style={{ flexDirection: "row", paddingTop: 20 }}>
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
                style={{ color: "grey" }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
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
          <Text stlye={{ color: colors.text }}>-</Text>
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
    flex: 1,
    height: 500,
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  socialHeader: {
    flex: 0.4,
    padding: 5,
  },
  attendingDescription: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  border: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    padding: 30,
    borderRadius: 30,
    borderColor: "grey",
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 50,
    width: "100%",
  },
  opponent: {
    flexDirection: "row",
  },
  dateTime: {
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: "lightgrey",
    padding: 0,
    width: "100%",
    alignItems: "center",
  },
  sport: {
    color: "red",
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "contain",
  },
  amenities: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
});

export default EventCardNoSocial;
