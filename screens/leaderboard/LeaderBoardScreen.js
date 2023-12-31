//Currently, this feature is not in use

import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import LeaderBoard from "./../../components/teamManagement/LeaderBoard";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeaderboardsOfOrganization } from "../../actions/organizationActions";
import LoadingSpinnerStackScreen from "../LoadingSpinnerStackScreen";
import Colors from "../../config/Colors";

const LeaderBoardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [allLeaderboards, setAllLeaderboards] = useState([]);
  const followedOrg = useSelector(
    (state) => state.auth.user.organizations_followed
  );
  const orgIds = followedOrg.map((org) => org._id);

  const user = useSelector((state) => state.auth.user);
  const leaderboards = useSelector(
    (state) => state.organization.allLeaderboards
  );
  const orgLeaderboard = useSelector(
    (state) => state.organization.orgLeaderboard
  );
  const teamLeaderboard = useSelector((state) => state.team.teamLeaderboard);

  useEffect(() => {
    if (leaderboards) setAllLeaderboards(leaderboards);
  }, [leaderboards]);

  useEffect(() => {
    dispatch(getAllLeaderboardsOfOrganization(orgIds));
  }, [, followedOrg, user, orgLeaderboard, teamLeaderboard]);

  const handleOrganizationLeaderboardSelected = (orgid) => {
    navigation.navigate("OrganizationLeaderBoardScreen", {
      selectedOrg: orgid,
    });
  };

  return (
    <ScrollView style={{ marginTop: 20 }}>
      {allLeaderboards ? (
        (() => {
          const uniqueLeaderboards = [];
          allLeaderboards.forEach((leaderboard) => {
            if (
              !uniqueLeaderboards.some(
                (item) => item.organization._id === leaderboard.organization._id
              )
            ) {
              uniqueLeaderboards.push(leaderboard);
            }
          });

          if (uniqueLeaderboards.length === 0) {
            return (
              <View style={{ alignItems: "center", padding: 20 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  No leaderboards available:
                </Text>
                <Text style={{ color: colors.text, textAlign: "center" }}>
                  You are currently not following any organizations
                </Text>
                <Text style={{ color: colors.text, textAlign: "center" }}>
                  or
                </Text>
                <Text style={{ color: colors.text, textAlign: "center" }}>
                  none of the organizations you are following have set up a
                  competion yet
                </Text>
              </View>
            );
          }

          return uniqueLeaderboards.map((leaderboard, index) => (
            <TouchableOpacity
              key={leaderboard._id}
              onPress={() =>
                handleOrganizationLeaderboardSelected(
                  leaderboard.organization._id
                )
              }
            >
              {index !== 0 ? (
                <View
                  style={{
                    marginHorizontal: 100,
                    borderWidth: 2,
                    borderColor: Colors.placeholder,
                    borderRadius: 2,
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                ></View>
              ) : null}

              <LeaderBoard
                displayHeader={false}
                data={leaderboard}
                hideLeaderbaord={true}
                displayOrganizationHeader={
                  typeof leaderboard.organization === "object"
                    ? leaderboard.organization
                    : false
                }
              ></LeaderBoard>
            </TouchableOpacity>
          ));
        })()
      ) : (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      )}
    </ScrollView>
  );
};

export default LeaderBoardScreen;
