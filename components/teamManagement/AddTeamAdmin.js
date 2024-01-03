import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const AddTeamAdmin = ({ navigation }) => {
  const { colors } = useTheme();
  const userId = useSelector((state) => state.auth.user._id);
  const team_admin_requests = useSelector((state) =>
    state.team.team_admin_requests_list.filter(
      (request) => !request.hasOwnProperty("isHeadAdmin")
    )
  );
  const hasCurrentUserAsAdmin = team_admin_requests.some(
    (request) =>
      request.user_recipient && request.user_recipient?._id === userId
  );
  const [teamAdminsInfoVisible, setTeamAdminsInfoVisible] = useState(false);

  const toggleTeamAdminsInfo = () => {
    setTeamAdminsInfoVisible(!teamAdminsInfoVisible);
  };

  const openAddTeamAdmin = (navigation) => {
    navigation.navigate("AddAdmin");
  };
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={{ color: colors.text, ...styles.heading }}>
          Team Admin
        </Text>
        {!hasCurrentUserAsAdmin ? (
          <TouchableOpacity
            onPress={() => openAddTeamAdmin(navigation)}
            style={{ backgroundColor: colors.card, ...styles.addButton }}
          >
            <Text style={{ color: colors.primary }}>+</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={toggleTeamAdminsInfo}
          style={{
            right: -40,
          }}
        >
          <Ionicons
            name="ios-information-circle-outline"
            size={25}
            color="orange"
          />
        </TouchableOpacity>
      </View>
      {teamAdminsInfoVisible && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ff761a",
            padding: 10,
            borderRadius: 5,
            width: Dimensions.get("window").width - 60,
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
            Team Admins can only manage the Events of this team
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    padding: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default AddTeamAdmin;
