// TeamManagementEditEventScreen.js
import React, { useEffect, useState, Fragment } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import InputField from "../../components/InputField";
import DeleteButton from "./../../components/DeleteButton";
import CreateButton from "../../components/CreateButton";
import DateTimePicker2 from "../../components/DateTimePicker2";
import DropdownList from "./../../components/DrodownList";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AddAmenityList from "./../../components/teamManagement/AddAmenityList";
import { deleteEvent } from "./../../actions/eventActions";
import { updateEvent } from "./../../actions/eventActions";
import { Ionicons } from "@expo/vector-icons";

import { RESET_EVENT_DELETED } from "../../actions/types";
import { RESET_EVENT_UPDATED } from "./../../actions/types";
import DateTimePickerWithStart from "../../components/DateTimePickerWithStart";

const TeamManagementEditEventScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  //const eventCreated = useSelector((state) => state.event.isCreated);  later event updated
  const selectedTeam = useSelector((state) => state.team.selected_team._id);
  const selectedOrg = useSelector((state) => state.organization.selected._id);
  const org = useSelector((state) => state.organization.selected);
  const eventDeleted = useSelector((state) => state.event.isDeleted);
  const eventUpdated = useSelector((state) => state.event.isUpdated);
  const event = useSelector((state) => state.event.event_selected);
  const [eventLocation, setEventLocation] = useState("");
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [eventOpponent, setEventOpponent] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [homeAway, setHomeAway] = useState("");
  const [isLinkInfo, setIsLinkInfo] = useState(false);

  const toggleIsLinkInfo = () => {
    setIsLinkInfo(!isLinkInfo);
  };

  useEffect(() => {
    setEventOpponent(event.opponent);
    setDateTime(new Date(event.date_time));
    setAmenitiesList(event.amenities);
    setHomeAway(event.home_away);
    setStreamLink(event.link);
    setEventLocation(event.event_location);
  }, []);

  useEffect(() => {
    if (eventDeleted) {
      navigation.navigate("TeamManagement");
      dispatch({ type: RESET_EVENT_DELETED }); //sets isDeleted back to false
    }
    if (eventUpdated) {
      navigation.navigate("TeamManagement");
      dispatch({ type: RESET_EVENT_UPDATED }); //sets isDeleted back to false
    }
  }, [eventDeleted, eventUpdated]);

  useEffect(() => {
    if (route.params && route.params.selectedLocation) {
      const selectedLocation = route.params.selectedLocation;
      setEventLocation(selectedLocation);
    }
  }, [route.params]);

  const setAmenities = (list) => {
    setAmenitiesList(list);
  };

  const updateEventClicked = () => {
    // orgid, teamid, eventid -> to find
    // data: date_time, home_away, amenities
    const updatedData = {
      date_time: dateTime,
      home_away: homeAway,
      link: streamLink,
      event_location: eventLocation,
    };
    const eventObj = {
      orgid: selectedOrg,
      teamid: selectedTeam,
      eventid: event._id,
    };
    const amenities = amenitiesList;
    if (updatedData.date_time && updatedData.home_away) {
      dispatch(updateEvent(updatedData, amenitiesList, eventObj));
    }
  };

  /*const updateEvent = () => {
    navigation.navigate("TeamManagement");
  };*/

  const deleteEventObj = () => {
    //{orgid, teamid, eventid}
    const obj = {
      orgid: selectedOrg,
      teamid: selectedTeam,
      eventid: event._id,
    };
    dispatch(deleteEvent(obj));
  };

  const dropdownOptions = ["Home", "Away"];
  const address = eventLocation?.address || org.location?.address;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 10}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {event ? (
          <Fragment>
            <Text style={{ color: colors.text, ...styles.header }}>
              Opponent
            </Text>

            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: colors.card,
                  ...styles.organizationCard,
                }}
              >
                <Image
                  style={styles.logo}
                  source={{
                    uri: `${eventOpponent.logo}`,
                  }}
                />
                <Text style={{ color: colors.text, ...styles.orgName }}>
                  {eventOpponent.name}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <View style={{ flex: 1, zIndex: 9000, alignItems: "center" }}>
              <Text style={{ color: colors.text, ...styles.header }}>
                Home/Away
              </Text>
              <DropdownList
                options={dropdownOptions}
                onSelect={setHomeAway}
                selectedValue={homeAway}
              ></DropdownList>
            </View>

            <View style={{ flex: 1, zIndex: 1000, alignItems: "center" }}>
              <Text style={{ color: colors.text, ...styles.header }}>
                Location
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("findPlace", {
                    fromScreen: "EditEvent",
                    initialAddress: eventLocation
                      ? eventLocation.address
                      : org.location.address,
                    initialLatitude: eventLocation
                      ? eventLocation.latitude
                      : org.location.latitude,
                    initialLongitude: eventLocation
                      ? eventLocation.longitude
                      : org.location.longitude,
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.organizationCard,
                    paddingHorizontal: 20,
                  }}
                >
                  <Ionicons
                    name="ios-pin"
                    size={25}
                    color="red"
                    style={{ paddingRight: 10 }}
                  />
                  {address ? (
                    <Text style={{ color: colors.text }}>{address}</Text>
                  ) : (
                    <Text style={{ color: colors.text }}>
                      Select Facility Location
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <Text style={{ color: colors.text, ...styles.header }}>
              Date/Time
            </Text>

            <DateTimePickerWithStart
              onDateTimeSelected={setDateTime}
              startDateTime={event.date_time}
            ></DateTimePickerWithStart>

            <View style={{ flex: 2, alignItems: "center" }}>
              <Text style={{ color: colors.text, ...styles.header }}>
                Special Event Amenities
              </Text>

              <AddAmenityList
                updateAmenities={(list) => setAmenities(list)}
              ></AddAmenityList>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                width: Dimensions.get("window").width - 20,
                zIndex: 2000,
              }}
            >
              <Text style={{ color: colors.text, ...styles.header }}>
                Stream Link
              </Text>
              <TouchableOpacity
                onPress={toggleIsLinkInfo}
                style={{
                  right: 10,
                  top: 10,
                  position: "absolute",
                }}
              >
                <Ionicons
                  name="ios-information-circle-outline"
                  size={25}
                  color="orange"
                />
              </TouchableOpacity>

              {isLinkInfo && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ff761a",
                    padding: 10,
                    borderRadius: 5,
                    width: Dimensions.get("window").width - 30,
                    zIndex: 1,
                  }}
                >
                  <Ionicons
                    name="ios-information-circle-outline"
                    size={20}
                    color="orange"
                  />
                  <Text
                    style={{
                      color: "black",
                      ...styles.infoText,
                      paddingHorizontal: 10,
                    }}
                  >
                    Only valid URLs will work. E.g. http://www.url.com or
                    http://www.url.com
                  </Text>
                </View>
              )}

              <InputField
                placeholder="Enter http link.."
                value={streamLink}
                onInput={setStreamLink}
              ></InputField>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <DeleteButton
                styling={{ flex: 1 }}
                onPress={() => deleteEventObj()}
                label="Delete"
              ></DeleteButton>
              <CreateButton
                styling={{ flex: 1 }}
                onPress={() => updateEventClicked()}
                label="Update"
              ></CreateButton>
            </View>
          </Fragment>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  organizationCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 30,
    height: 50,
    marginVertical: 2,
    padding: 0,
  },
  logo: {
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 14,
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginRight: 15,
  },
  orgName: {
    flex: 2,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default TeamManagementEditEventScreen;
