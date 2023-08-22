// HomeScreen.js
import React, { useEffect, useState, Fragment, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Image,
  Button,
  Dimensions,
} from "react-native";
import { captureRef, shareAsync } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import { useTheme } from "@react-navigation/native";
import EventSlider from "../../components/home/EventSlider";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import OrganizationHeaderHome from "./../../components/home/OrganizationHeaderHome";
import { setHomeOrganization } from "../../actions/organizationActions";
import { Ionicons } from "@expo/vector-icons";
import { getOrganizationHome } from "../../actions/organizationActions";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const organizations_followed = useSelector(
    (state) => state.auth.user.organizations_followed
  );
  const homeSelectedOrg = useSelector(
    (state) => state.organization.homeSelectedOrg
  );
  const upToDateOrgObject = useSelector(
    (state) => state.organization.homeOrgRender
  );
  // Define the ref for capturing the HomeScreen component
  const homeScreenRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(""); //holds whatever uptodate org object needs to be rendered
  const [refreshing, setRefreshing] = useState(false);

  // Refresh the data
  const handleRefresh = () => {
    setRefreshing(true);
    // Perform the data fetch or any other asynchronous operation here
    // Re-fetch the data using the existing parameters
    const fetchOrganizationData = () => {
      return new Promise((resolve, reject) => {
        dispatch(getOrganizationHome(homeSelectedOrg._id))
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log("Error fetching organization data:", error);
            reject();
          });
      });
    };

    fetchOrganizationData()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };

  //checks if user follows any organizations
  useEffect(() => {
    if (organizations_followed !== undefined) {
      if (organizations_followed.length !== 0) {
        //if yes, checks if any organization is selected to be rendered
        if (homeSelectedOrg) {
          dispatch(getOrganizationHome(homeSelectedOrg._id));
        } // if no organization is selected, take the first organization of the following list
        else {
          //else case: when user follows organization(s) but hasn't set an org under select screen, therefore, the first team of the user's followedOrganizations gets set
          const [selectedOrgObject0] = organizations_followed;
          //const firstOrgObjectId = selectedOrgObject0._id;
          //action: getOrganization(firstOrgObjectId)
          dispatch(setHomeOrganization(selectedOrgObject0));
          //set in other useEffect: setSelectedOrg(selectedOrgObject0);
        }
      }
    }
  }, [organizations_followed]);

  //checks if user selected a different organization to be displayed
  //once redux state changed -> useEffect that is setting the state of the orgObject from redux store
  //homeSelectedOrg -> has select organization object. However -> need new redux store variable
  //to store the loaded organization from (getOrganization)
  useEffect(() => {
    if (homeSelectedOrg) dispatch(getOrganizationHome(homeSelectedOrg._id));
  }, [homeSelectedOrg]); //everytime the selected Org object changed (coming from the database)

  /****NEW */
  useEffect(() => {
    setSelectedOrg(upToDateOrgObject); //setSelectedOrg(selected) set component state of selected Object
  }, [
    upToDateOrgObject /*selected:  the organization loaded from getOrganization*/,
  ]);

  useEffect(() => {
    if (previewImage) {
      navigation.navigate("Share", { url: previewImage });
    }
  }, [previewImage]);

  const handleShare = async () => {
    try {
      if (!homeScreenRef.current) {
        console.error("HomeScreen ref is not set.");
        return;
      }

      const result = await captureRef(homeScreenRef, {
        format: "png",
        quality: 1,
      });

      if (result) {
        setPreviewImage(result);
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View
        ref={homeScreenRef}
        style={{ color: colors.text, ...styles.container }}
      >
        {organizations_followed !== undefined ? (
          organizations_followed.length === 0 ? (
            <View style={styles.noFollowedOrgLabel}>
              <Ionicons
                name="ios-calendar"
                size={25}
                color={colors.text}
                style={{ paddingBottom: 10 }}
              />
              <Text style={{ color: colors.text }}>
                You are currently not following any Organizations!
              </Text>
            </View>
          ) : (
            <Fragment>
              <OrganizationHeaderHome
                organization={selectedOrg} //org needs to be the one loaded from the database. Not user_followed_list
              ></OrganizationHeaderHome>
              <EventSlider
                organization={selectedOrg}
                navigation={navigation}
                onShare={handleShare}
              ></EventSlider>
            </Fragment>
          )
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  noFollowedOrgLabel: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50%",
  },
  previewContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "#FFFFFF", // Set the background color to white
    borderColor: "green",
    borderWidth: 2,
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
    padding: 50, // Add padding of 50 to the preview image
  },
});

export default HomeScreen;
