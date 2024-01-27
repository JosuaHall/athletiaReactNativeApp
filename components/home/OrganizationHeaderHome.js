import React, { Fragment } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import UnfollowButton from "./../UnfollowButton";
import { unfollowOrganization } from "../../actions/authActions";
import { RESET_FILTERED_HOME_ORGANIZATION } from "../../actions/types";
import Colors from "../../config/Colors";

const OrganizationHeaderHome = ({ organization }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.organization.homeSelectedOrg);

  const onUnfollow = () => {
    //unfollow this organization
    const userid = user._id;
    const orgid = org._id;
    dispatch(unfollowOrganization(userid, orgid));
    resetFilteredOrg(orgid);
  };

  //checks if the user unfollowed the current selected Organization (that is rendered in the home component)
  const resetFilteredOrg = (orgid) => {
    if (orgid === org._id) dispatch({ type: RESET_FILTERED_HOME_ORGANIZATION });
  };

  return (
    <View style={{ backgroundColor: colors.card, ...styles.organizationCard }}>
      {organization ? (
        <Fragment>
          <Image
            style={styles.logo}
            source={{
              uri: `${organization.logo}`,
            }}
          />
          <View style={styles.headerLabel}>
            <Text style={{ color: colors.text, ...styles.orgName }}>
              {organization.name}
            </Text>
          </View>
          <UnfollowButton
            styling={{
              padding: 10,
              color: "#3296f8",
              borderColor: "#3296f8",
            }}
            onPress={() => onUnfollow()}
          ></UnfollowButton>
        </Fragment>
      ) : null}

      {/*
      <TouchableOpacity style={{ padding: 10 }}>
        <Ionicons
          name="caret-down"
          size={20}
          color={colors.text}
          style={styles.dropdownButton}
        ></Ionicons>
      </TouchableOpacity>*/}
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
    flex: 0.1,
    padding: 1,
    paddingRight: 10,
    marginTop: 5,
    zIndex: 99999,
  },
  headerLabel: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
    padding: 15,
  },
  teamName: {
    flex: 1,
    justifySelf: "center",
    textAlign: "left",
    fontSize: 17,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#444444",
    paddingHorizontal: 10,
    marginRight: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default OrganizationHeaderHome;
