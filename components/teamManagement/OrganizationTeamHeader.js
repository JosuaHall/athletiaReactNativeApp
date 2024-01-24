import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
const OrganizationTeamHeader = () => {
  const { colors } = useTheme();
  const org = useSelector((state) => state.organization.selected);
  const team_selected = useSelector((state) => state.team.selected_team);

  return (
    <View style={{ backgroundColor: colors.card, ...styles.organizationCard }}>
      <Image
        style={styles.logo}
        source={{
          uri: `${org.logo}`,
        }}
      />
      <View style={styles.headerLabel}>
        <Text style={{ color: colors.text, ...styles.orgName }}>
          {org.name}
        </Text>
        <Text style={{ color: colors.text, ...styles.teamName }}>
          {team_selected.sport}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  organizationCard: {
    flexDirection: "row",
    //backgroundColor: Colors.orgCardBackground,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
    height: 110,
    marginVertical: 10,
    padding: 10,
  },
  headerLabel: {
    flexDirection: "column",
    flex: 2,
    alignSelf: "center",

    marginVertical: "auto",
    height: "45%",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: "contain",
  },
  orgName: {
    flex: 1,

    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
  },
  teamName: {
    flex: 1,

    textAlign: "left",
    fontSize: 17,
  },
});

export default OrganizationTeamHeader;
