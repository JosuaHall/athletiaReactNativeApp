import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getOrganization } from "../../actions/organizationActions";
import LoadingSpinnerStackScreen from "./../LoadingSpinnerStackScreen";
import {
  RESET_TEAM_IS_CREATED,
  RESET_TEAM_IS_DELETED,
} from "../../actions/types";
import { deleteTeam, setCurrentTeam } from "./../../actions/teamActions";
import { Ionicons } from "@expo/vector-icons";

const OrganizationTeamsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const orgId = useSelector((state) => state.organization.selectedOrgId);
  const selectedOrg = useSelector((state) => state.organization.selected);
  const orgIsLoading = useSelector((state) => state.organization.orgIsLoading);
  const isCreated = useSelector((state) => state.team.isCreated);
  const isDeleted = useSelector((state) => state.team.isDeleted);
  const teamList = useSelector((state) => state.team.teamList);

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    dispatch(getOrganization(orgId));
  }, [orgId]);

  useEffect(() => {
    if (isCreated || isDeleted) {
      dispatch(getOrganization(orgId));
      dispatch({ type: RESET_TEAM_IS_CREATED });
      dispatch({ type: RESET_TEAM_IS_DELETED });
    }
  }, [isCreated, isDeleted, orgId]);

  const teamSelected = (team) => {
    if (showDeleteButton) {
      setShowDeleteButton(false);
      setTeamToDelete(null);
    } else {
      dispatch(setCurrentTeam(team));

      navigation.navigate("OrganizationSetup", {
        screen: "TeamManagement",
        params: {
          previousScreenName: "OrganizationTeams",
          previousTabName: "OrganizationSetup",
        },
      });
    }
  };

  const showDelete = (team) => {
    setTeamToDelete(team);
    setShowDeleteButton(true);
  };

  const onDelete = (teamId) => {
    const org_team = { org: orgId, id: teamId };
    dispatch(deleteTeam(org_team));
  };

  return (
    <ScrollView>
      {orgIsLoading ? (
        <LoadingSpinnerStackScreen></LoadingSpinnerStackScreen>
      ) : (
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.card,
                ...styles.organizationCard,
              }}
            >
              <Image
                style={styles.logo}
                source={{
                  uri: `${selectedOrg.logo}`,
                }}
              />
              <Text style={{ color: colors.text, ...styles.orgName }}>
                {selectedOrg.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {selectedOrg?.teams.length !== 0 ? (
            selectedOrg.teams.map((team) => {
              return (
                <TouchableHighlight
                  key={team._id}
                  style={{ backgroundColor: colors.card, ...styles.teamCard }}
                  onPress={() => teamSelected(team)}
                  onLongPress={() => showDelete(team)}
                  underlayColor="transparent"
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: colors.text, ...styles.teamName }}>
                      {team.sport}
                    </Text>
                    {showDeleteButton &&
                      teamToDelete &&
                      teamToDelete._id === team._id && (
                        <TouchableOpacity
                          style={{ right: 10 }}
                          onPress={() => onDelete(team._id)}
                        >
                          <Ionicons
                            name="ios-trash"
                            color="#7F0000"
                            size={25}
                          ></Ionicons>
                        </TouchableOpacity>
                      )}
                  </View>
                </TouchableHighlight>
              );
            })
          ) : (
            <View
              style={{ backgroundColor: colors.card, ...styles.teamCard }}
              onPress={() => teamSelected({ navigation })}
            >
              <Text style={{ color: colors.text, ...styles.teamName }}>
                add teams to this organization
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logo: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 110,
    height: 110,
    marginRight: 10,
    resizeMode: "contain",
  },
  teamCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: 60,
    marginVertical: 5,
    padding: 10,
  },
  orgName: {
    flex: 2,
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
  },
  teamName: {
    flex: 2,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default OrganizationTeamsScreen;
