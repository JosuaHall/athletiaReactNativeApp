import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getTeamAdminRequests } from "./../../actions/teamActions";
import { Ionicons } from "@expo/vector-icons";
import { TEAM_ADMIN_EDIT_SELECTED } from "./../../actions/types";

const HeadTeamAdmin = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user._id);
  const orgId = useSelector((state) => state.organization.selected.owner);
  const teamId = useSelector((state) => state.team.selected_team._id);
  const requestSent = useSelector((state) => state.team.adminRequestSent);
  const team_admin_requests = useSelector(
    (state) => state.team.team_admin_requests_list
  );
  const headAdmin = team_admin_requests.filter(
    (request) =>
      request.hasOwnProperty("isHeadAdmin") && request.isHeadAdmin === true
  );

  const editAdmin = (e, request) => {
    dispatch({ type: TEAM_ADMIN_EDIT_SELECTED, payload: request });
    navigation.navigate("EditAdmin");
  };

  return (
    <View style={styles.container}>
      {headAdmin.length !== 0 ? (
        headAdmin.map((request) => (
          <TouchableOpacity
            key={request._id}
            onPress={(e) => editAdmin(e, request)}
            disabled={userId !== orgId}
          >
            <View
              style={{
                backgroundColor: colors.card,
                ...styles.cardContainer,
              }}
            >
              {request.user_recipient.profileImg ? (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri: `${request.user_recipient.profileImg}`,
                  }}
                />
              ) : (
                <View style={styles.profileImg}>
                  <Ionicons name="ios-person" size={24} color={colors.text} />
                </View>
              )}
              <View
                style={{
                  color: colors.text,
                  ...styles.adminUsername,
                }}
              >
                {request.user_recipient._id === userId ? (
                  <Text>You</Text>
                ) : (
                  <View
                    style={{ ...styles.userName, justifyContent: "center" }}
                  >
                    <Text style={{ color: colors.text, ...styles.userName }}>
                      {`@${request.user_recipient.name}`}
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        ...styles.userName,
                        fontWeight: "normal",
                      }}
                    >
                      {`${request.user_recipient.firstName} ${request.user_recipient.lastName}`}
                    </Text>
                  </View>
                )}
              </View>
              {request.status === 1 ? (
                <Text
                  style={{
                    color: "white",
                    ...styles.pendingBadge,
                  }}
                >
                  Pending
                </Text>
              ) : (
                <Text
                  style={{
                    color: "white",
                    ...styles.adminBadge,
                  }}
                >
                  Head Admin
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: colors.text }}>
          This team does not have a Head Admin yet
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 5,
    paddingLeft: 1,
    overflow: "hidden",
    width: "90%",
  },
  adminUsername: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  adminBadge: {
    textAlign: "center",
    width: 100,
    paddingHorizontal: 0,
    paddingVertical: 20,
    backgroundColor: "#008080",
  },
  pendingBadge: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 0,
    paddingVertical: 20,
    backgroundColor: "#353a40",
  },
  profileImg: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderWidth: 1,
    marginRight: 10,
  },
  userName: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    justifyContent: "center",
  },
});

export default HeadTeamAdmin;
