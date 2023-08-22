// CreateTeamScreen.js
import React, { useEffect, useState, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getSports, createTeam } from "../../actions/teamActions";
import { FlatList } from "react-native-gesture-handler";
import SearchBar from "./../../components/SearchBar";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";

const CreateTeamScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [onFocus, setFocus] = useState(false);
  const [sportFiltered, setSportFiltered] = useState([]);
  const sports = useSelector((state) => state.team.all_sports);
  const userid = useSelector((state) => state.auth.user._id);
  const orgId = useSelector((state) => state.organization.selected._id);
  const exisitingTeams = useSelector((state) =>
    state.organization.selected.teams.map((team) => team.sport)
  );
  const isCreated = useSelector((state) => state.team.isCreated);
  const isCreating = useSelector((state) => state.team.isCreating);

  useEffect(() => {
    dispatch(getSports());
  }, []);

  useEffect(() => {
    if (isCreated) {
      navigation.navigate("OrganizationTeams");
    }
  }, [isCreated]);

  useEffect(() => {
    if (sports) {
      const filteredSports = sports.filter((sport) =>
        sport.sport.startsWith(searchTerm)
      );
      setSportFiltered(filteredSports);
    }
  }, [searchTerm]);

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

  const addTeam = (sport, e) => {
    const team = {
      userid,
      organizationid: orgId,
      sport,
    };

    // Check if the button is already disabled
    if (disabledButtons.includes(sport)) {
      return;
    }

    // Disable the button
    setDisabledButtons([...disabledButtons, sport]);

    dispatch(createTeam(team));
    //do something
    //navigate back after
  };

  return (
    <View style={styles.container}>
      {isCreating ? (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      ) : (
        <Fragment>
          <Text style={{ color: colors.text, ...styles.header }}>Sport</Text>
          <SearchBar
            searchTerm={searchTerm}
            setFocus={setFocus}
            onFocus={onFocus}
            closeKeyboard={closeKeyboard}
            setSearchTerm={handleSearchTermChange}
            clearInputTerm={clearInputTerm}
            placeholder="Search for Sport..."
          ></SearchBar>
          <FlatList
            data={sportFiltered}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.cardContainer,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      ...styles.adminUsername,
                    }}
                  >
                    {`Men's ${item.sport}`}
                  </Text>
                  {!exisitingTeams.includes(`Men's ${item.sport}`) ? (
                    <TouchableOpacity
                      onPress={(e) => addTeam(`Men's ${item.sport}`, e)}
                      disabled={disabledButtons.includes(`Men's ${item.sport}`)}
                    >
                      <Text
                        style={{
                          color: "white",
                          ...styles.adminBadge,
                        }}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={{
                        color: "#009fe3",
                        ...styles.addedBadge,
                      }}
                    >
                      Added
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.cardContainer,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      ...styles.adminUsername,
                    }}
                  >
                    {`Women's ${item.sport}`}
                  </Text>
                  {!exisitingTeams.includes(`Women's ${item.sport}`) ? (
                    <TouchableOpacity
                      onPress={(e) => addTeam(`Women's ${item.sport}`, e)}
                    >
                      <Text
                        style={{
                          color: "white",
                          ...styles.adminBadge,
                        }}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={{
                        color: "#009fe3",
                        ...styles.addedBadge,
                      }}
                    >
                      Added
                    </Text>
                  )}
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
        </Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  name: {
    flex: 1,
    textAlign: "center",
  },
  sportCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginVertical: 5,
    padding: 10,
  },
  sportName: {
    flex: 2,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
    width: Dimensions.get("window").width - 40,
  },
  adminUsername: {
    flex: 2,
    padding: 20,
  },
  adminBadge: {
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#008080",
  },
  addedBadge: {
    textAlign: "center",
    flex: 0.69,
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
});

export default CreateTeamScreen;
