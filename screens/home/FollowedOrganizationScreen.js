// FollowedOrganizationsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setHomeOrganization } from "../../actions/organizationActions";

const FollowedOrganizationsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const followed_organizations = useSelector(
    (state) => state.auth.user.organizations_followed
  );
  const activeRenderedOrg = useSelector(
    (state) => state.organization.homeSelectedOrg
  );

  const organizationSelected = (organization) => {
    dispatch(setHomeOrganization(organization));
    navigation.navigate("Events");
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        {activeRenderedOrg ? (
          <Text style={{ color: colors.text, ...styles.header }}>Selected</Text>
        ) : null}
        {followed_organizations.length !== 0 ? (
          followed_organizations.map((organization) => (
            <TouchableOpacity
              key={organization._id}
              style={{
                backgroundColor: colors.card,
                ...styles.organizationCard,
                borderColor:
                  organization._id === activeRenderedOrg._id
                    ? "#3296f8"
                    : colors.card,
              }}
              onPress={() => organizationSelected(organization)}
            >
              <Image
                style={styles.logo}
                source={{
                  uri: `${organization.logo}`,
                }}
              />

              <Text style={{ color: colors.text, ...styles.name }}>
                {organization.name}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: colors.text, paddingTop: 200 }}>
            You are currently not following any teams!
          </Text>
        )}
      </View>
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
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 20,
    height: 102,
    marginVertical: 10,
    paddingVertical: 10,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 15,
    resizeMode: "contain",
  },
  name: {
    flex: 2,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default FollowedOrganizationsScreen;
