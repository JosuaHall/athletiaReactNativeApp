import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";
import DismissKeyboard from "../../components/DismissKeyboard";
import { getAllOrganizations } from "./../../actions/organizationActions";
import { FOUND_ORG_SELECTED } from "../../actions/types";

const SearchScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const foundOrganizations = useSelector(
    (state) => state.organization.allOrganizations
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOpponents, setFilteredOpponents] = useState("");
  const [onFocus, setFocus] = useState(false);

  /*
  useEffect(() => {
    if (eventCreated) {
      dispatch({ type: RESET_EVENT_IS_CREATED }); //sets http loading variables back to false
      navigation.navigate("TeamManagement");
    }
  }, [eventCreated]);*/

  useEffect(() => {
    setFilteredOpponents(foundOrganizations);
  }, [foundOrganizations]);

  useEffect(() => {
    if (searchTerm !== "")
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

  const opponentSelected = (org) => {
    dispatch({ type: FOUND_ORG_SELECTED, payload: org });
    navigation.navigate("OrganizationEvents");
  };

  return (
    <DismissKeyboard>
      <View style={{ backgroundColor: colors.background, ...styles.container }}>
        <SearchBar
          searchTerm={searchTerm}
          setFocus={setFocus}
          onFocus={onFocus}
          closeKeyboard={closeKeyboard}
          setSearchTerm={handleSearchTermChange}
          clearInputTerm={clearInputTerm}
          placeholder="Search for Organization.."
        ></SearchBar>
        {searchTerm !== "" ? (
          filteredOpponents.length === 0 ? (
            <Text style={{ color: colors.text }}>No results</Text>
          ) : (
            <View style={{ flexGrow: 1 }}>
              <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={filteredOpponents}
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
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    flexGrow: 1,
  },
  organizationCard: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 40,
    height: 70,
    marginVertical: 2,
    padding: 5,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 15,
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  orgName: {
    flex: 3,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});

export default SearchScreen;
