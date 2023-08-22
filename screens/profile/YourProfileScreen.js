// YourProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "../../config/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { loadTeamAdminRequests } from "./../../actions/teamActions";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";
import { getOrganizationAndTeam } from "../../actions/organizationActions";

const YourProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const requests = useSelector(
    (state) => state.team.team_admin_requests_profile
  );
  const onRequestAcceptedOrDenied = useSelector(
    (state) => state.team.adminRequestSent
  );
  const isLoading = useSelector((state) => state.team.isLoadingRequests);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  //useSelector = teamAdminRequests
  //useState = pendingList
  //useState = acceptedList

  //useEffect []
  /* load team admin requests */
  useEffect(() => {
    dispatch(loadTeamAdminRequests(user._id));
  }, []);

  //useEffect [teamAdminRequests]
  //filter user_recipient == userid && status == 1
  /* setState pending
  //filter user_recipient == userid && status == 2
  /* setState accepted
  */
  useEffect(() => {
    if (requests.length !== 0) {
      const pendingRequests = requests.filter(
        (request) => request.status === 1
      );
      setPendingRequests(pendingRequests);
      const acceptedRequests = requests.filter(
        (request) => request.status === 2
      );
      setAcceptedRequests(acceptedRequests);
    }
  }, [requests]);

  useEffect(() => {
    dispatch(loadTeamAdminRequests(user._id));
  }, [onRequestAcceptedOrDenied]);

  const teamSelected = (organizationId, teamId) => {
    dispatch(getOrganizationAndTeam(organizationId, teamId));
    navigation.navigate("TeamManagement");
  };

  return (
    <ScrollView>
      {!isLoading ? (
        <View style={styles.container}>
          <View style={{ backgroundColor: colors.card, ...styles.profileCard }}>
            {user.profileImg ? (
              <Image
                style={styles.profileImg}
                source={{
                  uri: `${user.profileImg}`,
                }}
              />
            ) : (
              <View style={styles.profileImg}>
                <Ionicons name="ios-person" size={24} color={colors.text} />
              </View>
            )}
            <View style={{}}>
              <Text style={{ color: colors.text, ...styles.name }}>
                {`@${user.name}`}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  ...styles.name,
                  fontWeight: "normal",
                }}
              >
                {`${user.firstName} ${user.lastName}`}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.text, ...styles.header }}>
            Manage Your Team(s):
          </Text>
          {acceptedRequests.length !== 0 ? (
            acceptedRequests.map((team) => (
              <TouchableOpacity
                key={team._id}
                onPress={() => teamSelected(team.organization._id, team.team)}
                style={{
                  backgroundColor: colors.card,
                  ...styles.organizationCard,
                }}
              >
                <Image
                  style={styles.logo}
                  source={{
                    uri: `${team.organization.logo}`,
                  }}
                />
                <View style={styles.headerLabel}>
                  <Text style={{ color: colors.text, ...styles.orgName }}>
                    {team.organization.name}
                  </Text>
                  <Text style={{ color: colors.text, ...styles.teamName }}>
                    {team.sport}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{
                color: colors.text,
                textAlign: "center",
              }}
            >
              You are currently not an Admin of a Team. Check your notifications
              on the top left for any invites.
            </Text>
          )}
        </View>
      ) : (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    width: Dimensions.get("window").width,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 110,
    marginVertical: 10,
    padding: 10,
    width: Dimensions.get("window").width - 20,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: "contain",
  },
  name: {
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
  },
  profileImg: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderWidth: 1,
    margin: 4,
    borderColor: "grey",
    overflow: "hidden",
    marginRight: 10,
  },
  organizationCard: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 10,
  },
  headerLabel: {
    flexDirection: "column",
    flex: 2,
    alignSelf: "center",
    justifySelf: "center",
    marginVertical: "auto",
    height: "45%",
  },

  orgName: {
    flex: 1,
    justifySelf: "center",
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
  },
  teamName: {
    flex: 1,
    justifySelf: "center",
    textAlign: "left",
    fontSize: 17,
  },
});

export default YourProfileScreen;
