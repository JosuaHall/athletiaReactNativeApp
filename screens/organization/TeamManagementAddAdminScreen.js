// TeamManagementAddAdminScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import SearchBar from "./../../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredUsers } from "../../actions/authActions";
import { Ionicons } from "@expo/vector-icons";
import { sendTeamAdminRequest } from "../../actions/teamActions";
import { RESET_TEAM_IS_CREATED } from "../../actions/types";

const TeamManagementAddAdminScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [onFocus, setFocus] = useState(false);
  const [filtered_users2, setFiltered_users2] = useState("");
  const user_id = useSelector((state) => state.auth.user._id);
  const orgId = useSelector((state) => state.organization.selected._id);
  const teamId = useSelector((state) => state.team.selected_team._id);
  const sport = useSelector((state) => state.team.selected_team.sport);
  const usersAlreadyInvited = useSelector(
    (state) =>
      state.team.team_admin_requests_list?.map(
        (req) => req.user_recipient._id
      ) ?? []
  );

  const filtered_users = useSelector((state) => state.auth.filtered_users);
  const requestSent = useSelector((state) => state.team.adminRequestSent);

  useEffect(() => {
    dispatch(getFilteredUsers(searchTerm.toLowerCase()));
  }, [searchTerm]);

  useEffect(() => {
    const filteredAndNotDuplicated = filtered_users.filter(
      (user) => !usersAlreadyInvited?.includes(user._id)
    );
    setFiltered_users2(filteredAndNotDuplicated);
  }, [filtered_users]);

  useEffect(() => {
    if (requestSent) {
      dispatch({ type: RESET_TEAM_IS_CREATED }); //sets http loading variables back to false
      navigation.navigate("TeamManagement");
    }
  }, [requestSent]);

  const closeKeyboard = () => {
    Keyboard.dismiss();
    setFocus(false);
  };
  const clearInputTerm = () => {
    setSearchTerm("");
    closeKeyboard();
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleInvite = (event, user_recipient) => {
    const status = 1;
    dispatch(
      sendTeamAdminRequest(
        user_id,
        user_recipient,
        orgId,
        teamId,
        sport,
        status
      )
    );
  };
  return (
    <View style={styles.container}>
      <SearchBar
        searchTerm={searchTerm}
        setFocus={setFocus}
        onFocus={onFocus}
        closeKeyboard={closeKeyboard}
        setSearchTerm={handleSearchTermChange}
        clearInputTerm={clearInputTerm}
        placeholder="Search for user.."
      ></SearchBar>
      <FlatList
        data={filtered_users2}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.card, ...styles.userCard }}>
            {item.profileImg ? (
              <Image
                style={styles.profileImg}
                source={{
                  uri: `${item.profileImg}`,
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
              }}
            >
              <Text style={{ color: colors.text, ...styles.userName }}>
                {`@${item.name}`}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  ...styles.userName,
                  fontWeight: "normal",
                }}
              >
                {`${item.firstName} ${item.lastName}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(event) => handleInvite(event, item._id)}
            >
              <View style={styles.inviteButton}>
                <Text style={{ color: "white" }}>invite</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  userCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 30,
    height: 60,
    marginVertical: 5,
    padding: 10,
  },
  userName: {
    flex: 2,
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
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
    borderColor: "grey",
  },
  inviteButton: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#008080",
  },
  adminUsername: {
    flex: 2,

    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default TeamManagementAddAdminScreen;
