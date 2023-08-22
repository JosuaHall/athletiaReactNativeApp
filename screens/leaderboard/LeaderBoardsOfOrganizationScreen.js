import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LeaderBoard from "./../../components/teamManagement/LeaderBoard";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeaderboardsOfOrganization } from "../../actions/organizationActions";
import LoadingSpinnerStackScreen from "../LoadingSpinnerStackScreen";
import Colors from "../../config/Colors";

const LeaderBoardsOfOrganizationScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [orgid, setOrgId] = useState("");
  const leaderboards = useSelector(
    (state) => state.organization.allLeaderboards
  );

  useEffect(() => {
    if (route.params && route.params.selectedOrg) {
      const selectedOrg = route.params.selectedOrg;
      setOrgId(selectedOrg);
    }
  }, [route.params]);

  const getNumberBackgroundColor = (index) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "silver";
    if (index === 2) return "#CD7F32";
    return colors.card; // fallback to default card color for other numbers
  };

  return (
    <ScrollView style={{ marginTop: 20 }}>
      {leaderboards && orgid ? (
        leaderboards
          .filter((leaderboard) => leaderboard.organization._id === orgid)
          .sort((a, b) => {
            if (a.team && !b.team) {
              return 1; // a has team, b doesn't have team, so a should come after b
            } else if (!a.team && b.team) {
              return -1; // a doesn't have team, b has team, so a should come before b
            } else {
              return 0; // both have team or both don't have team, maintain the original order
            }
          })
          .map((leaderboard, index) => (
            <View
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
                    marginHorizontal: 75,
                    borderWidth: 2,
                    borderColor: Colors.placeholder,
                    borderRadius: 2,
                    marginBottom: 30,
                    marginTop: 20,
                  }}
                ></View>
              ) : null}

              <LeaderBoard
                displayHeader={false}
                displayPrizes={true}
                displayDate={true}
                data={leaderboard}
                displayOrganizationHeader={
                  typeof leaderboard.organization === "object"
                    ? leaderboard.organization
                    : false
                }
                displayTeamName={
                  leaderboard.team
                    ? leaderboard.organization.teams
                        .filter((team) => team._id === leaderboard.team)
                        .map((team) => team.sport)
                    : null
                }
              ></LeaderBoard>
            </View>
          ))
      ) : (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      )}
    </ScrollView>
  );
};

export default LeaderBoardsOfOrganizationScreen;
