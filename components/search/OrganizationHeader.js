import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import FollowButton from "../FollowButton";
import UnfollowButton from "../UnfollowButton";
import { useSelector, useDispatch } from "react-redux";
import { RESET_FILTERED_HOME_ORGANIZATION } from "../../actions/types";
import {
  followOrganization,
  unfollowOrganization,
} from "./../../actions/authActions";

const OrganizationHeader = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.organization.foundOrg);
  const all_teams = useSelector((state) => state.organization.foundOrg.teams);
  const orgFollowedList = useSelector(
    (state) => state.auth.user.organizations_followed
  );
  const [followedOrgIdsList, setFollowedOrgIdsList] = useState([]);
  const [following, setFollowing] = useState();

  useEffect(() => {
    const followedOrgIdsList = orgFollowedList.map((org) => org._id);
    if (followedOrgIdsList.includes(org._id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
    setFollowedOrgIdsList(followedOrgIdsList);
  }, []);

  useEffect(() => {
    if (followedOrgIdsList.includes(org._id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
    setFollowedOrgIdsList(followedOrgIdsList);
  }, [followedOrgIdsList]);

  useEffect(() => {
    const followedOrgIdsList = orgFollowedList.map((org) => org._id);
    setFollowedOrgIdsList(followedOrgIdsList);
  }, [user.organizations_followed]);

  const onUnfollow = () => {
    //unfollow this organization
    const userid = user._id;
    const orgid = org._id;
    setFollowing(false);
    dispatch(unfollowOrganization(userid, orgid));
    resetFilteredOrg(orgid);
  };

  //checks if the user unfollowed the current selected Organization (that is rendered in the home component)
  const resetFilteredOrg = (orgid) => {
    if (orgid === org._id) dispatch({ type: RESET_FILTERED_HOME_ORGANIZATION });
  };

  const getAllEvents = () => {
    if (all_teams.length !== 0) {
      const all_events = [].concat(
        ...all_teams.map((team) =>
          team.events
            .filter((event) => new Date(event.date_time) > Date.now())
            .map((event) => ({
              ...event,
              sport: team.sport,
              key: event._id,
            }))
        )
      );
      return all_events;
    }
    return [];
  };

  const onFollow = () => {
    //follow this organization
    const userid = user._id;
    const orgid = org._id;
    const allEvents = getAllEvents();
    setFollowing(true);
    dispatch(followOrganization(userid, orgid, allEvents));
  };

  return (
    <View style={{ backgroundColor: colors.card, ...styles.organizationCard }}>
      {org.logo ? (
        <Image
          style={styles.logo}
          source={{
            uri: `${org.logo}`,
          }}
        />
      ) : null}

      <View style={styles.headerLabel}>
        <Text style={{ color: colors.text, ...styles.orgName }}>
          {org.name}
        </Text>
      </View>
      {following ? (
        <UnfollowButton
          styling={{ flex: 0.8 }}
          label="Following"
          onPress={onUnfollow}
        ></UnfollowButton>
      ) : (
        <FollowButton
          styling={{ flex: 0.7 }}
          onPress={onFollow}
          label="Follow"
        ></FollowButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  organizationCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
    height: 110,
    marginTop: 120,
    padding: 10,
  },
  headerLabel: {
    flex: 2,
    alignItems: "flex-start",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 15,
    resizeMode: "contain",
  },
  orgName: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
    padding: 10,
  },
  teamName: {
    flex: 1,
    justifySelf: "center",
    textAlign: "left",
    fontSize: 17,
  },
});

export default OrganizationHeader;
