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
import {
  loadTeamAdminRequests,
  getOrganizationAndTeam,
} from "../../actions/teamActions";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";

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

  useEffect(() => {
    dispatch(loadTeamAdminRequests(user._id));
  }, [onRequestAcceptedOrDenied]);

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

  const teamSelected = (organizationId, teamId) => {
    dispatch(getOrganizationAndTeam(organizationId, teamId));
    navigation.navigate("TeamManagement");
  };

  const renderProfileImage = () => {
    if (user.profileImg) {
      return (
        <Image
          style={styles.profileImg}
          source={{
            uri: `${user.profileImg}`,
          }}
        />
      );
    }
    return (
      <View style={styles.profileImg}>
        <Ionicons name="ios-person" size={24} color={colors.text} />
      </View>
    );
  };

  const renderAcceptedRequests = () => {
    if (acceptedRequests.length !== 0) {
      return acceptedRequests.map((team) => (
        <TouchableOpacity
          key={team._id}
          onPress={() => teamSelected(team.organization._id, team.team)}
          style={{ ...styles.organizationCard, backgroundColor: colors.card }}
        >
          <Image
            style={styles.logo}
            source={{
              uri: `${team.organization.logo}`,
            }}
          />
          <View style={styles.headerLabel}>
            <Text style={{ ...styles.orgName, color: colors.text }}>
              {team.organization.name}
            </Text>
            <Text style={{ ...styles.teamName, color: colors.text }}>
              {team.sport}
            </Text>
          </View>
        </TouchableOpacity>
      ));
    }

    return (
      <Text style={{ color: colors.text, textAlign: "center" }}>
        You are currently not an Admin of a Team. Check your notifications on
        the top left for any invites.
      </Text>
    );
  };

  return (
    <ScrollView>
      {!isLoading ? (
        <View style={styles.container}>
          <View style={{ ...styles.profileCard, backgroundColor: colors.card }}>
            {renderProfileImage()}
            <View style={{}}>
              <Text style={{ ...styles.name, color: colors.text }}>
                {`@${user.name}`}
              </Text>
              <Text
                style={{
                  ...styles.name,
                  color: colors.text,
                  fontWeight: "normal",
                }}
              >
                {`${user.firstName} ${user.lastName}`}
              </Text>
            </View>
          </View>
          <Text style={{ ...styles.header, color: colors.text }}>
            Manage Your Team(s):
          </Text>
          {renderAcceptedRequests()}
        </View>
      ) : (
        <LoadingSpinnerStackScreen />
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
