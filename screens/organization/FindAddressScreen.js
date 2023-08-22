import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { getAPIToken } from "../../actions/authActions";

const FindAddressScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const key = useSelector((state) => state.auth.apiKey);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSelectButton, setShowSelectButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(getAPIToken());
    getCachedLocation();
    getLocation();
  }, []);

  const getCachedLocation = async () => {
    const cachedLocation = await Location.getLastKnownPositionAsync({});
    if (cachedLocation) {
      setCurrentLocation(cachedLocation.coords);
    }
  };

  useEffect(() => {
    if (route.params.initialAddress) {
      let address = route.params.initialAddress;
      let latitude = route.params.initialLatitude;
      let longitude = route.params.initialLongitude.$numberDecimal;
      if (
        route.params &&
        address !== null &&
        latitude !== null &&
        longitude !== 0
      ) {
        // Set the selectedLocation and show the marker and address
        const location = { address, latitude, longitude };
        setSelectedLocation(location);
        setShowSelectButton(true);

        // Animate the map to the selectedLocation
        mapRef.current?.setCamera({
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          zoom: 12, // Adjust the zoom level as needed
        });
      }
    }
  }, [route.params]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});

      setCurrentLocation(location.coords);
      setLoading(false);
    }
  };

  const handleSearchSelect = (data, details) => {
    const { geometry, formatted_address } = details;
    const { location } = geometry;
    const selectedLocation = {
      latitude: location.lat,
      longitude: location.lng,
      address: formatted_address,
    };
    setSelectedLocation(selectedLocation);
    mapRef.current.animateToRegion({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setShowSelectButton(true);
  };

  // Function to handle the map drag event
  const handleMapDrag = () => {
    // Hide the button when the map is dragged
    setShowSelectButton(false);
  };

  const handleSelect = () => {
    const fromScreen = route.params?.fromScreen ?? null;
    navigation.navigate(fromScreen, { selectedLocation });
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search location..."
        onPress={handleSearchSelect}
        fetchDetails={true}
        styles={{
          container: {
            position: "absolute",
            top: 0,
            width: Dimensions.get("window").width - 10,
            zIndex: 1,
            backgroundColor: colors.card,
            borderRadius: 10,
          },
          row: {
            backgroundColor: colors.background,
            height: 70,
            alignItems: "center",
          },
          separator: {
            height: 1,
            backgroundColor: colors.card,
          },
          description: {
            color: colors.text,
          },
          textInput: {
            backgroundColor: colors.card,
            color: colors.text,
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 15,
            flex: 1,
          },
          listView: {
            backgroundColor: colors.background,
            borderRadius: 10,
          },
          poweredContainer: {
            backgroundColor: colors.background,
          },
        }}
        query={{
          key: key,
          language: "en",
        }}
        onFail={(error) => console.error(error)}
      />

      <View style={styles.mapContainer}>
        {currentLocation && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation?.latitude || currentLocation.latitude,
              longitude:
                selectedLocation?.longitude || currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            loadingEnabled={true}
            loadingIndicatorColor={colors.text}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
        )}
        {selectedLocation && (
          <View
            style={{ ...styles.buttonContainer, backgroundColor: colors.card }}
          >
            <Ionicons name="ios-pin" size={25} color="red" />
            <Text
              style={{
                color: colors.text,
                flex: 1,
                padding: 10,
              }}
            >
              {selectedLocation.address}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleSelect}>
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 60, // Adjust this value to set the space between Searchbar and Map
  },
  map: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width - 10,
    zIndex: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#3296f8",
    paddingVertical: 20,
    borderRadius: 10,
    flex: 0.4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FindAddressScreen;
