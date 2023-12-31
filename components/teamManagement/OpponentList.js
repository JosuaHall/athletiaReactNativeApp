import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../SearchBar";
import { getAllOrganizations } from "../../actions/organizationActions";

const OpponentList = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const foundOrganizations = useSelector(
    (state) => state.organization.allOrganizations
  );
  const orgId = useSelector((state) => state.organization.selected._id);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOpponents, setFilteredOpponents] = useState("");
  const [onFocus, setFocus] = useState(false);

  const [itemsToShow, setItemsToShow] = useState(20);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setFilteredOpponents(foundOrganizations);
  }, [foundOrganizations]);

  useEffect(() => {
    dispatch(getAllOrganizations(searchTerm.toLowerCase()));
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

  const opponentSelected = (opponent) => {
    setSearchTerm("");
    navigation.navigate("AddEvent", { selectedOpponent: opponent });
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
        placeholder="Search for Opponents.."
      ></SearchBar>
      {searchTerm !== "" ? (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreateOrganizationWithoutOwner")
            }
          >
            <View
              style={{
                backgroundColor: colors.card,
                ...styles.organizationCard,
                padding: 10,
              }}
            >
              <Ionicons
                size={20}
                name="ios-information-circle-outline"
                color="orange"
              />
              <Text style={{ color: colors.text, ...styles.orgName }}>
                {" "}
                Can't find Opponent? Click on me!
              </Text>
            </View>
          </TouchableOpacity>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
            }}
            data={filteredOpponents.slice(0, itemsToShow)}
            onEndReached={() => {
              setItemsToShow(itemsToShow + ITEMS_PER_PAGE);
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => opponentSelected(item)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.organizationCard,
                  }}
                >
                  <Image
                    style={styles.logo}
                    source={{
                      uri: `${item.logo}`,
                    }}
                  />
                  <Text style={{ color: colors.text, ...styles.orgName }}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    width: Dimensions.get("window").width,
    padding: 5,
  },
  addOpponentContainer: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    zIndex: 10,
  },
  componentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    zIndex: 0,
    flex: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  organizationCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 30,
    height: 50,
    marginVertical: 2,
    padding: 5,
  },
  logo: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 14,
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginRight: 15,
  },
  orgName: {
    flex: 2,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default OpponentList;
