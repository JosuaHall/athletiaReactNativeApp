import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import AddTeamAdmin from "../../components/teamManagement/AddTeamAdmin";
import OrganizationTeamHeader from "../../components/teamManagement/OrganizationTeamHeader";
import TeamAdminList from "../../components/teamManagement/TeamAdminList";
import EventList from "../../components/teamManagement/EventList";
import AddButton from "../../components/AddButton";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";
import { setEventSelected } from "./../../actions/eventActions";
import { RESET_EVENT_SELECTED } from "../../actions/types";
import AddHeadTeamAdmin from "../../components/teamManagement/AddHeadTeamAdmin";
import HeadTeamAdmin from "../../components/teamManagement/HeadTeamAdmin";
import { Ionicons } from "@expo/vector-icons";
import InfoIcon from "./../../components/InfoIcon";
import LeaderBoard from "../../components/teamManagement/LeaderBoard";

const OrganizationTeamManagementScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const team = useSelector((state) => state.team.selected_team);
  const organization = useSelector((state) => state.organization.selected);

  const addEvent = (navigation) => {
    dispatch({ type: RESET_EVENT_SELECTED });
    navigation.navigate("AddEvent");
  };

  const updateEvent = (event) => {
    dispatch(setEventSelected(event));
    navigation.navigate("EditEvent");
  };

  return (
    <ScrollView>
      {team && organization ? (
        <View style={styles.container}>
          <OrganizationTeamHeader></OrganizationTeamHeader>
          <AddHeadTeamAdmin navigation={navigation}></AddHeadTeamAdmin>
          <HeadTeamAdmin navigation={navigation}></HeadTeamAdmin>
          <AddTeamAdmin navigation={navigation}></AddTeamAdmin>
          <TeamAdminList navigation={navigation}></TeamAdminList>
          <View style={styles.headingContainer}>
            <Text
              style={{
                color: colors.text,
                ...styles.header,
              }}
            >
              Events
            </Text>
            <AddButton onPress={() => addEvent(navigation)}></AddButton>
          </View>

          <EventList
            onPress={(event) => updateEvent(event)}
            navigation={navigation}
          ></EventList>
        </View>
      ) : (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 20,
    paddingRight: 20,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default OrganizationTeamManagementScreen;
