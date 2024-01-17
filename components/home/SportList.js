import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import SearchBar from "../SearchBar";

const SportList = ({ allSports, onSelection }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFiltered, setSportFiltered] = useState([]);
  const [onFocus, setFocus] = useState(false);

  useEffect(() => {
    if (allSports) {
      const filteredSports = allSports.filter((sport) =>
        sport.sport.includes(searchTerm)
      );
      setSportFiltered(filteredSports);
    }
  }, [searchTerm]);

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };
  const clearInputTerm = () => {
    setSearchTerm("");
    closeKeyboard();
    setFocus(false);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const addTeam = (sport, e) => {
    setFocus(false);
    onSelection(sport);
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
        placeholder="Search for Sport..."
      ></SearchBar>
      {onFocus && (
        <View
          style={{
            flexGrow: 1,
            zIndex: 200,
            backgroundColor: colors.background,
          }}
        >
          <FlatList
            data={sportFiltered}
            renderItem={({ item }) => (
              <View>
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
                  <TouchableOpacity
                    onPress={(e) => addTeam(`Men's ${item.sport}`, e)}
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
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    paddingHorizontal: 20,
    zIndex: 100,
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  sportCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
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
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
    marginHorizontal: "auto",
    width: Dimensions.get("window").width - 60,
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
    backgroundColor: "#2b8648",
  },
});

export default SportList;
