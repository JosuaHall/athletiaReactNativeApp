// OrganizationSetupScreen.js
import React, { Fragment, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  FlatList,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET_IS_CREATED,
  FOUND_ORG_SELECTED,
  STREAM_LINK_SELECTED,
} from "../../actions/types";
import SearchBar from "./../../components/SearchBar";
import {
  getAllOrganizations,
  updateOrganizationLocation,
  setCurrentOrganization,
  getOrganizationList,
  sendOwnerRequest,
  getOrganizationAdminRequests,
  getLeaderboard,
  updateOrganizationStreamLink,
} from "../../actions/organizationActions";
import DismissKeyboard from "../../components/DismissKeyboard";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";
import LeaderBoard from "../../components/teamManagement/LeaderBoard";
import InputField from "./../../components/InputField";

const OrganizationSetupScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const userid = useSelector((state) => state.auth.user._id);
  const orgList = useSelector((state) => state.organization.organization_list);
  const isCreated = useSelector((state) => state.organization.isCreated);
  const hasLeaderboard = useSelector(
    (state) => state.organization.orgLeaderboard
  );
  const sentOwnerRequests = useSelector(
    (state) => state.organization.ownerRequestsSent
  );
  const sentChangeOwnerRequests = useSelector(
    (state) => state.organization.ownerChangeRequestsSent
  );
  const yourListIsLoading = useSelector(
    (state) => state.organization.yourListIsLoading
  );
  const foundOrganizations = useSelector(
    (state) => state.organization.allOrganizations
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOpponents, setFilteredOpponents] = useState("");
  const [onFocus, setFocus] = useState(false);

  useEffect(() => {
    dispatch(getOrganizationList(userid));
    dispatch(getOrganizationAdminRequests(userid));
  }, [dispatch, userid]);

  useEffect(() => {
    if (orgList?.length !== 0 && orgList[0])
      dispatch(getLeaderboard(orgList[0]._id));
  }, [, orgList]);

  useEffect(() => {
    if (isCreated) {
      dispatch(getOrganizationList(userid));
      dispatch({ type: RESET_IS_CREATED });
    }
  }, [isCreated, dispatch, userid]);

  const organizationSelected = (orgId, status) => {
    //if Organization is approved, user will be able to manage his organization
    if (status === 1) {
      dispatch(setCurrentOrganization(orgId));
      navigation.navigate("OrganizationTeams");
    }
  };

  //display only organizations whose do not have an owner yet
  useEffect(() => {
    setFilteredOpponents(foundOrganizations);
  }, [foundOrganizations]);

  useEffect(() => {
    if (searchTerm !== "")
      dispatch(getAllOrganizations(searchTerm.toLowerCase())); //get all approved organizations
  }, [searchTerm]);

  useEffect(() => {
    if (route.params && route.params.selectedLocation) {
      const selectedLocation = route.params.selectedLocation;
      dispatch(updateOrganizationLocation(selectedLocation, orgList[0]._id));
    }
    if (route.params && route.params.stream_link) {
      const stream_link = route.params.stream_link;
      console.log("udpate stream link: ", stream_link);
      //CREATE A ACTION FOR UPDATING THE ORGANIZATION LINK
      dispatch(updateOrganizationStreamLink(stream_link, orgList[0]._id));
    }
  }, [route.params]);

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

  const handleOwnerRequest = (orgid) => {
    dispatch(sendOwnerRequest(orgid, userid));
  };

  const opponentSelected = (org) => {
    dispatch({ type: FOUND_ORG_SELECTED, payload: org });
    navigation.navigate("OrganizationEvents");
  };

  const handleStreamLinkClicked = ({ stream_link }) => {
    const link = stream_link ? stream_link : "";
    dispatch({ type: STREAM_LINK_SELECTED, payload: link });
    navigation.navigate("updateStreamLink", {
      fromScreen: "YourOrganizations",
    });
  };

  return (
    <View>
      <View style={styles.container}>
        {orgList === false ? (
          <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
        ) : (
          <View style={{ marginBottom: 20 }}>
            {orgList.length !== 0 ? (
              <Fragment key={orgList[0]._id}>
                <TouchableOpacity
                  key={orgList[0]._id}
                  style={{
                    backgroundColor: colors.card,
                    ...styles.organizationCard,
                  }}
                  onPress={() =>
                    organizationSelected(orgList[0]._id, orgList[0].status)
                  }
                >
                  <Image
                    style={{
                      ...styles.logo,
                    }}
                    source={{
                      uri: `${orgList[0].logo}`,
                    }}
                  />
                  <Text style={{ color: colors.text, ...styles.name }}>
                    {orgList[0].name}
                  </Text>
                  {orgList[0].status === 1 ? (
                    <Text
                      style={{
                        color: "#59db56",
                        borderColor: "#59db56",
                        ...styles.statusBadge,
                      }}
                    >
                      approved
                    </Text>
                  ) : orgList[0].status === 2 ? (
                    <Text
                      style={{
                        color: "red",
                        borderColor: "red",
                        ...styles.statusBadge,
                      }}
                    >
                      denied
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "orange",
                        borderColor: "orange",
                        ...styles.statusBadge,
                      }}
                    >
                      pending
                    </Text>
                  )}
                </TouchableOpacity>

                {/* organization location */}
                <Text
                  style={{
                    color: colors.text,
                    ...styles.heading,
                    marginVertical: 10,
                  }}
                >
                  Location
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("findPlace", {
                      fromScreen: "YourOrganizations",
                    })
                  }
                  style={{
                    ...styles.addressContainer,
                    backgroundColor: colors.card,
                  }}
                >
                  <Ionicons name="ios-pin" size={25} color="red" />
                  {orgList[0].location ? (
                    <Text style={{ color: colors.text, paddingRight: 10 }}>
                      {orgList[0].location.address}
                    </Text>
                  ) : (
                    <Text style={{ color: colors.text }}>
                      Select Facility Location
                    </Text>
                  )}
                </TouchableOpacity>

                {/* organization stream */}
                <Text
                  style={{
                    color: colors.text,
                    ...styles.heading,
                    marginVertical: 10,
                  }}
                >
                  Default Stream Link for Events
                </Text>

                <TouchableOpacity
                  onPress={() => handleStreamLinkClicked(orgList[0])}
                  style={{
                    ...styles.addressContainer,
                    backgroundColor: colors.card,
                  }}
                >
                  <Ionicons
                    name="ios-videocam-outline"
                    size={25}
                    color={colors.text}
                  />
                  {orgList[0].stream_link !== undefined &&
                  orgList[0].stream_link !== null &&
                  orgList[0].stream_link !== "" ? (
                    <Text
                      style={{
                        color: colors.text,
                        paddingHorizontal: 10,
                      }}
                    >
                      {orgList[0].stream_link}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.text,
                        paddingHorizontal: 10,
                      }}
                    >
                      Set Stream Link for Events
                    </Text>
                  )}
                </TouchableOpacity>
              </Fragment>
            ) : null}

            {orgList.length === 0 ? (
              <Fragment>
                <View
                  style={{
                    backgroundColor: colors.card,
                    ...styles.listContainer,
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    You are not an admin of any Organization.
                  </Text>
                  <Text style={{ color: colors.text, ...styles.bulletPoint }}>
                    To become an admin:
                  </Text>
                  <View stlye={{ alignItems: "flex-start" }}>
                    <Text style={{ color: colors.text }}>
                      1. Search below if your Organization already exists
                    </Text>
                    <Text style={{ color: colors.text }}>
                      2. Request to become the admin of your Organization.
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.text, ...styles.heading }}>
                  Organization Admin Request
                </Text>
                <DismissKeyboard>
                  <View
                    style={{
                      backgroundColor: colors.background,
                      paddingTop: 10,
                    }}
                  >
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
                      <View style={{ flexGrow: 1 }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("CreateOrganization")
                          }
                        >
                          <View
                            style={{
                              backgroundColor: colors.card,
                              ...styles.organizationCardRequest,
                              padding: 10,
                            }}
                          >
                            <Ionicons
                              size={15}
                              name="ios-information-circle-outline"
                              color="orange"
                            />
                            <Text
                              style={{ color: colors.text, ...styles.orgName }}
                            >
                              {" "}
                              Can't find your Organization? Click on me!
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <FlatList
                          contentContainerStyle={{}}
                          data={filteredOpponents}
                          renderItem={({ item }) => {
                            const isDisabled =
                              sentOwnerRequests.some(
                                (request) => request.organization === item._id
                              ) ||
                              sentChangeOwnerRequests.some(
                                (request) => request.organization === item._id
                              );

                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  if (!isDisabled) {
                                    opponentSelected(item);
                                  }
                                }}
                                disabled={isDisabled}
                              >
                                <View
                                  style={{
                                    backgroundColor: colors.card,
                                    ...styles.organizationCardRequest,
                                  }}
                                >
                                  <Image
                                    style={styles.logoRequest}
                                    source={{
                                      uri: `${item.logo}`,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      color: colors.text,
                                      ...styles.orgName,
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => handleOwnerRequest(item._id)}
                                    disabled={isDisabled}
                                  >
                                    <View
                                      style={
                                        isDisabled
                                          ? styles.inviteButtonDisabled
                                          : styles.inviteButton
                                      }
                                    >
                                      <Text
                                        style={{
                                          color: isDisabled
                                            ? colors.text
                                            : "white",
                                        }}
                                      >
                                        {isDisabled ? "Sent" : "Request"}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                          keyExtractor={(item) => item._id}
                        />
                      </View>
                    ) : null}
                  </View>
                </DismissKeyboard>
              </Fragment>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
  },
  organizationCard: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 30,
    marginVertical: 2,
    padding: 5,
  },
  addressContainer: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width - 30,
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  organizationCardRequest: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 30,
    marginVertical: 2,
    padding: 5,
    minHeight: 70,
  },
  logoRequest: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: "contain",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 110,
    height: 110,
    marginRight: 10,
    resizeMode: "contain",
  },
  orgName: {
    flex: 2,
    textAlign: "left",
    fontSize: 10,
    fontWeight: "bold",
  },
  name: {
    flex: 2,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
  },
  statusBadge: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 5,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 15,
    width: Dimensions.get("window").width - 30,
  },
  bulletPoint: {
    paddingTop: 20,
    paddingBottom: 10,
    fontWeight: "bold",
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
  inviteButtonDisabled: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 50,
    borderRadius: 10,
    borderColor: "#008080",
    borderWidth: 1,
    opacity: 0.5,
  },
});

export default OrganizationSetupScreen;
