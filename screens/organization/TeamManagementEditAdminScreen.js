// TeamManagementEditAdminScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import DeleteButton from "./../../components/DeleteButton";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { deleteTeamAdminRequestEntry } from "../../actions/teamActions";
import { RESET_TEAM_IS_CREATED } from "../../actions/types";

const TeamManagementEditAdminScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const request = useSelector((state) => state.team.selected_team_admin);
  const requestSent = useSelector((state) => state.team.adminRequestSent);

  useEffect(() => {
    if (requestSent) {
      dispatch({ type: RESET_TEAM_IS_CREATED }); //sets loading, isCreated variables back to false
      navigation.navigate("TeamManagement");
    }
  }, [requestSent]);

  const removeAdmin = () => {
    dispatch(deleteTeamAdminRequestEntry(request._id));
    //navigation.navigate("TeamManagement");
  };
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text, ...styles.header }}>User</Text>
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
            ...styles.adminUsername,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.text,
              ...styles.userName,
              fontWeight: "bold",
            }}
          >
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
            Admin
          </Text>
        )}
      </View>
      <DeleteButton onPress={() => removeAdmin()} label="Delete"></DeleteButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
  },
  adminUsername: {
    flex: 2,

    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  adminBadge: {
    textAlign: "center",
    flex: 1,
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
});

export default TeamManagementEditAdminScreen;
