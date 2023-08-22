import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
  Text,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getAPIToken } from "../../actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const LocationPicker = ({ onLocationSelect }) => {
  const dispatch = useDispatch();
  const key = useSelector((state) => state.auth.apiKey);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(getAPIToken());
    (async () => {
      if (Platform.OS === "ios") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location.coords);
        }
      } else if (Platform.OS === "android") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getLastKnownPositionAsync({});
          setCurrentLocation(location.coords);
        }
      }
    })();
  }, []);

  const openMapsApp = (latitude, longitude) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = "Selected Location";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handlePickLocation = () => {
    setModalVisible(true);
  };

  const handleSelectLocation = () => {
    setModalVisible(false);
    onLocationSelect(selectedLocation);
  };

  const handleSearchSelect = (data, details) => {
    const { geometry, formatted_address } = details;
    const { location } = geometry;
    handleLocationSelect({
      latitude: location.lat,
      longitude: location.lng,
      address: formatted_address,
    });
    mapRef.current.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View>
      <Button title="Add Address" onPress={handlePickLocation} />

      <Modal animationType="slide" transparent={false} visible={isModalVisible}>
        {currentLocation && (
          <View style={{ flex: 1 }}>
            {Platform.OS === "ios" ? (
              <View style={{ flex: 1 }}>
                <GooglePlacesAutocomplete
                  placeholder="Search location..."
                  onPress={handleSearchSelect}
                  styles={{
                    container: { flex: 0.4 },
                  }}
                  query={{
                    key: key,
                    language: "en",
                  }}
                  onFail={(error) => console.error(error)}
                />
                <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  onPress={(event) => {
                    const { latitude, longitude } =
                      event.nativeEvent.coordinate;
                    handleLocationSelect({
                      latitude,
                      longitude,
                      address: "", // You can fill the address if available
                    });
                  }}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <GooglePlacesAutocomplete
                  placeholder="Search location..."
                  onPress={(data, details = null) => {
                    const { geometry, formatted_address } = details;
                    const { location } = geometry;
                    handleLocationSelect({
                      latitude: location.lat,
                      longitude: location.lng,
                      address: formatted_address,
                    });
                  }}
                  styles={{
                    container: { position: "absolute", top: 0, width: "100%" },
                  }}
                />
                {selectedLocation && (
                  <MapView
                    style={{ flex: 1, height: 300 }} // Adjust the height as needed
                    initialRegion={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    <Marker coordinate={selectedLocation} />
                  </MapView>
                )}
              </View>
            )}

            <Button title="Select Location" onPress={handleSelectLocation} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        )}
      </Modal>
    </View>
  );
};

export default LocationPicker;
