// EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  acceptRequest,
  deleteTeamAdminRequestEntry,
} from "../../actions/teamActions";

const Notifications = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const requests = useSelector(
    (state) => state.team.team_admin_requests_profile
  );
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (requests.length !== 0) {
      const pendingRequests = requests.filter(
        (request) => request.status === 1
      );
      setPendingRequests(pendingRequests);
    }
  }, [requests]);

  const handleAcceptRequest = (requestid) => {
    dispatch(acceptRequest(requestid));
    navigation.navigate("Profile");
  };

  const handleDeclineRequest = (requestid) => {
    dispatch(deleteTeamAdminRequestEntry(requestid));
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <>
            <Ionicons
              name="ios-chatbox-outline"
              size={25}
              color={colors.text}
              style={{
                color: colors.text,
                textAlign: "center",
                paddingTop: 100,
                paddingHorizontal: 10,
              }}
            />
            <Text
              style={{
                color: colors.text,
                textAlign: "center",

                paddingHorizontal: 10,
              }}
            >
              You do not have any Invites yet. Your Organization/Team needs to
              send you an invite.
            </Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.inviteContainer} key={item._id}>
            <Image
              style={styles.logo}
              source={{
                uri: `${item.organization.logo}`,
              }}
            />
            <Text
              style={{
                color: colors.text,
                ...styles.orgName,
                fontWeight: "bold",
              }}
            >
              {item.organization.name}{" "}
              <Text style={{ color: colors.text, ...styles.orgName }}>
                {item.sport}{" "}
              </Text>
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={{ flex: 1, paddingRight: 10 }}
                onPress={() => handleDeclineRequest(item._id)}
              >
                <Ionicons
                  name={"ios-close-outline"}
                  color={colors.text}
                  size={40}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleAcceptRequest(item._id)}
              >
                <Ionicons
                  name={"ios-checkmark-circle-outline"}
                  color={colors.text}
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "left",
    width: Dimensions.get("window").width - 10,
    paddingHorizontal: 10,
  },
  inviteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  logo: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 35,
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 10,
  },
  orgName: {
    flex: 2.5,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default Notifications;
