// TeamManagementAddEventScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import InputField from "../../components/InputField";
import CreateButton from "../../components/CreateButton";
import DateTimePicker2 from "../../components/DateTimePicker2";
import DropdownList from "./../../components/DrodownList";
import SearchBar from "./../../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { getAllOrganizations } from "../../actions/organizationActions";
import { useSelector } from "react-redux";
import { createEvent } from "./../../actions/eventActions";
import {
  RESET_EVENT_IS_CREATED,
  STREAM_LINK_SELECTED,
} from "../../actions/types";
import AddButton from "./../../components/AddButton";

const TeamManagementAddEventScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const foundOrganizations = useSelector(
    (state) => state.organization.allOrganizations
  );
  const orgId = useSelector((state) => state.organization.selected._id);
  const org = useSelector((state) => state.organization.selected);
  const eventCreated = useSelector((state) => state.event.isCreated);
  const selectedTeam = useSelector((state) => state.team.selected_team._id);
  const [eventOpponent, setEventOpponent] = useState("");
  const [msg1, setMsg1] = useState("");
  const [msg2, setMsg2] = useState("");
  const [msg3, setMsg3] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [homeAway, setHomeAway] = useState("");
  const [isLinkInfo, setIsLinkInfo] = useState(false);

  const toggleIsLinkInfo = () => {
    setIsLinkInfo(!isLinkInfo);
  };

  useEffect(() => {
    if (eventCreated) {
      dispatch({ type: RESET_EVENT_IS_CREATED }); //sets http loading variables back to false
      navigation.navigate("TeamManagement");
    }
  }, [eventCreated]);

  useEffect(() => {
    if (eventOpponent) {
      setMsg1("");
    }
  }, [eventOpponent]);

  useEffect(() => {
    if (homeAway) {
      setMsg2("");
    }
  }, [homeAway]);

  useEffect(() => {
    if (dateTime !== "") {
      setMsg3("");
    }
  }, [dateTime]);

  //returning from add location or update stream screen
  useEffect(() => {
    if (route.params && route.params.selectedOpponent) {
      const selectedOpponent = route.params.selectedOpponent;
      setEventOpponent(selectedOpponent);
    }
    //checks for any changes to streamlink and updates it
    let s_link = "";
    if (
      route.params &&
      route.params.stream_link !== undefined &&
      route.params.stream_link !== null
    ) {
      s_link = route.params.stream_link;
      setStreamLink(s_link);
    }
  }, [route.params]);

  const addNewEvent = (navigation) => {
    //do something
    const event = {
      orgid: orgId,
      teamid: selectedTeam,
      date_time: dateTime,
      competitor: eventOpponent._id,
      home_away: homeAway.trim(),
      link: streamLink.trim(),
      event_location: null,
    };

    if (!event.competitor) {
      setMsg1("* Add a competitor");
      return;
    }
    if (event.home_away === "") {
      setMsg2("* Select home or away");
      return;
    }
    if (event.date_time === "") {
      setMsg3("* Select a date and time");
      return;
    }

    // Determine event_location based on homeAway
    if (homeAway.trim().toLowerCase() === "home" && org.location) {
      event.event_location = org.location;
    } else if (
      homeAway.trim().toLowerCase() === "away" &&
      eventOpponent.location
    ) {
      event.event_location = eventOpponent.location;
    }

    dispatch(createEvent(event));
  };

  //fill in the stream link depending on away or home AND if available
  useEffect(() => {
    if (homeAway !== "" && eventOpponent) determineStreamLinkText();
  }, [homeAway, eventOpponent]);

  const determineStreamLinkText = () => {
    if (homeAway === "Home") {
      setStreamLink(org.stream_link || "");
    } else if (homeAway === "Away") {
      setStreamLink(eventOpponent.stream_link || "");
    }
  };

  //navigate to edit stream link page
  const handleStreamLinkClicked = (link) => {
    dispatch({ type: STREAM_LINK_SELECTED, payload: link });
    navigation.navigate("updateStreamLink", {
      fromScreen: "AddEvent",
    });
  };

  //dropdown options
  const dropdownOptions = ["Home", "Away"];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flex: 1.2 }}>
        <Text style={{ color: colors.text, ...styles.header }}>Opponent</Text>
        {msg1 && (
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                textAlign: "left",
              }}
            >
              {msg1}
            </Text>
          </View>
        )}
        {eventOpponent ? (
          <TouchableOpacity onPress={() => navigation.navigate("AddOpponent")}>
            <View
              style={{
                backgroundColor: colors.card,
                ...styles.organizationCard,
                zIndex: 1,
                borderWidth: 1,
                borderColor: colors.primary,
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
          </TouchableOpacity>
        ) : (
          <AddButton
            onPress={() => navigation.navigate("AddOpponent")}
            styling={{
              width: 60,
              height: 60,
              alignSelf: "center",
              marginTop: 10,
            }}
          ></AddButton>
        )}
      </View>

      <View style={{ flex: 1, zIndex: 1000 }}>
        <Text style={{ color: colors.text, ...styles.header }}>Home/Away</Text>
        {msg2 && (
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                textAlign: "left",
              }}
            >
              {msg2}
            </Text>
          </View>
        )}
        <DropdownList
          options={dropdownOptions}
          onSelect={setHomeAway}
          selectedValue={homeAway}
        ></DropdownList>
      </View>

      <View style={{ flex: 3, zIndex: 999 }}>
        <Text style={{ color: colors.text, ...styles.header }}>Date/Time</Text>
        {msg3 && (
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                textAlign: "left",
              }}
            >
              {msg3}
            </Text>
          </View>
        )}
        <DateTimePicker2 onDateTimeSelected={setDateTime}></DateTimePicker2>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, width: Dimensions.get("window").width - 30 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 10} // Adjust the offset as needed
      >
        <View style={{ flex: 1, zIndex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <Text style={{ color: colors.text, ...styles.header }}>
              Stream Link
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleStreamLinkClicked(streamLink)}
            style={{
              ...styles.addressContainer,
              backgroundColor: colors.card,
            }}
          >
            <Ionicons
              name="ios-videocam-outline"
              size={25}
              color={colors.text}
            />

            <Text
              style={{
                color: colors.text,
                paddingHorizontal: 10,
              }}
            >
              {streamLink === "" ? "Update Stream Link" : streamLink}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CreateButton
        styling={{ zIndex: 6000 }}
        onPress={() => addNewEvent(navigation)}
        label="Create"
      ></CreateButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: Dimensions.get("window").width,
    padding: 5,
    paddingVertical: 0,
  },
  addOpponentContainer: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    zIndex: 10,
  },
  addOpponentButton: {
    flex: 1,
    backgroundColor: "green",
  },
  componentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    zIndex: 0,
    flex: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: "center",
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
  addressContainer: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width - 30,
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default TeamManagementAddEventScreen;
