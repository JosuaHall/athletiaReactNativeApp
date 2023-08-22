// PeopleGoingScreenScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import SearchBar from "./../../components/SearchBar";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const PeopleGoingScreenScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const userid = useSelector((state) => state.auth.user._id);
  const user_attending_list = useSelector(
    (state) => state.event.people_attending
  );
  const filteredAttendees = user_attending_list.filter(
    (attendee) => attendee.isPrivate === 0
  );
  const anonymousAttendees = user_attending_list.filter(
    (attendee) => attendee.isPrivate === 1
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [onFocus, setFocus] = useState(false);
  const [filtered_users, setFiltered_users] = useState([]);

  useEffect(() => {
    setFiltered_users(filteredAttendees);
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      const filtered_users = getFilteredUsers(searchTerm.toLowerCase());
      setFiltered_users(filtered_users);
    } else {
      setFiltered_users(filteredAttendees);
    }
  }, [searchTerm]);

  const getFilteredUsers = (search_term) => {
    //filter user_attending_list based on search_term
    const filtered_users = filteredAttendees.filter((user) =>
      user.name.toLowerCase().startsWith(search_term)
    );
    return filtered_users;
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <SearchBar
          searchTerm={searchTerm}
          setFocus={setFocus}
          onFocus={onFocus}
          closeKeyboard={closeKeyboard}
          setSearchTerm={handleSearchTermChange}
          clearInputTerm={clearInputTerm}
          placeholder="Search for users.."
        ></SearchBar>
      </View>

      {/* use flatlist to render all public people going */}
      {searchTerm !== "" && filtered_users.length === 0 ? (
        <Text>No results</Text>
      ) : (
        <FlatList
          data={filtered_users}
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
              <View style={{ ...styles.userName, justifyContent: "center" }}>
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
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      )}
      <Text
        style={{
          color: colors.text,
          alignSelf: "flex-start",
          paddingLeft: 20,
          fontWeight: "bold",
          paddingTop: 15,
        }}
      >
        Anonymous Users:
      </Text>
      <FlatList
        data={anonymousAttendees}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.card, ...styles.userCard }}>
            <View style={styles.profileImg}>
              <Ionicons name="ios-person" size={24} color={colors.text} />
            </View>

            <View style={{ ...styles.userName, justifyContent: "center" }}>
              <Text style={{ color: colors.text, ...styles.userName }}>
                {`Anonymous`}
              </Text>
              {item._id === userid ? (
                <Text
                  style={{
                    color: colors.text,
                    ...styles.userName,
                    fontWeight: "normal",
                  }}
                >
                  {`You`}
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.text,
                    ...styles.userName,
                    fontWeight: "normal",
                  }}
                >
                  {`Private Account`}
                </Text>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
  },
  search: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    width: Dimensions.get("window").width - 20,
    borderRadius: 10,
  },
  userCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
    height: 60,
    marginVertical: 2,
    padding: 15,
    marginLeft: "auto",
    marginRight: "auto",
  },
  userName: {
    flex: 2,
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileImg: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    width: 60,
    height: 60,
    resizeMode: "contain",

    marginRight: 10,
  },
});

export default PeopleGoingScreenScreen;
