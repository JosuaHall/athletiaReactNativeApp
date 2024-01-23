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
import { RESET_EVENT_IS_CREATED } from "../../actions/types";
import AddButton from "./../../components/AddButton";

const TeamManagementAddEventScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const foundOrganizations = useSelector(
    (state) => state.organization.allOrganizations
  );
  const orgId = useSelector((state) => state.organization.selected._id);
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

  useEffect(() => {
    if (route.params && route.params.selectedOpponent) {
      const selectedOpponent = route.params.selectedOpponent;
      setEventOpponent(selectedOpponent);
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

    dispatch(createEvent(event));
  };

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
        keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 10} // Adjust the offset as needed
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
            <TouchableOpacity
              onPress={toggleIsLinkInfo}
              style={{
                right: 10,
                top: 20,
                position: "absolute",
              }}
            >
              <Ionicons
                name="ios-information-circle-outline"
                size={25}
                color="orange"
              />
            </TouchableOpacity>
          </View>

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
                Only valid URLs will work. E.g. https://www.url.com or
                http://www.url.com
              </Text>
            </View>
          )}

          <InputField
            placeholder="format: https://www.url.com"
            value={streamLink}
            onInput={setStreamLink}
          ></InputField>
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
});

export default TeamManagementAddEventScreen;
