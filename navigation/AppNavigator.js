import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/guest/LoginScreen";
import RegisterScreen from "../screens/guest/RegisterScreen";
import InfoScreen from "../screens/guest/InfoScreen";
import HomeScreen from "../screens/home/HomeScreen";
import FilterEventsScreen from "../screens/home/FilterEventsScreen";
import FollowedOrganizationsScreen from "../screens/home/FollowedOrganizationScreen";
import PeopleGoingScreen from "../screens/home/PeopleGoingScreen";
import SearchScreen from "../screens/search/SearchScreen";
import OrganizationSetupScreen from "../screens/organization/OrganizationSetupScreen";
import CreateOrganizationScreen from "../screens/organization/CreateOrganizationScreen";
import CreateOrganizationWithoutOwnerScreen from "../screens/organization/CreateOrganizationWithoutOwnerScreen";
import OrganizationTeamsScreen from "../screens/organization/OrganizationTeamsScreen";
import CreateTeamScreen from "../screens/organization/CreateTeamScreen";
import OrganizationTeamManagementScreen from "../screens/organization/OrganizationTeamManagementScreen";
import TeamManagementAddAdminScreen from "../screens/organization/TeamManagementAddAdminScreen";
import TeamManagementEditAdminScreen from "../screens/organization/TeamManagementEditAdminScreen";
import TeamManagementAddEventScreen from "../screens/organization/TeamManagementAddEventScreen";
import TeamManagementEditEventScreen from "../screens/organization/TeamManagementEditEventScreen";
import YourProfileScreen from "../screens/profile/YourProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import SelectedOrgScreen from "../screens/search/SelectedOrgScreen";
import LoadingSpinnerStackScreen from "../screens/LoadingSpinnerStackScreen";
import EmailVerificationScreen from "../screens/guest/EmailVerificationScreen";
import ForgotPasswordScreen from "../screens/guest/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/guest/ResetPasswordScreen";
import { useTheme } from "@react-navigation/native";
import FindAddressScreen from "../screens/organization/FindAddressScreen";

import {
  TouchableOpacity,
  Text,
  Button,
  Platform,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "./../screens/profile/Notifications";
import Colors from "../config/Colors";
import TeamManagementAddHeadAdminScreen from "../screens/organization/TeamManagementAddHeadAdminScreen";
import OpponentList from "../components/teamManagement/OpponentList";
import PasswordResetEmailSentScreen from "../screens/guest/PasswordResetEmailSentScreen";
import ShareScreen from "../screens/home/ShareScreen";
import OrganizationPrizeScreen from "../screens/organization/OrganizationPrizeScreen";
import LeaderBoardScreen from "../screens/leaderboard/LeaderBoardScreen";
import TeamPrizeScreen from "../screens/organization/TeamPrizeScreen";
import LeaderBoardsOfOrganizationScreen from "../screens/leaderboard/LeaderBoardsOfOrganizationScreen";

const NotAuthenticatedStack = createNativeStackNavigator();
const OrganizationSetupStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const YourProfileStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const LeaderBoardStack = createNativeStackNavigator();

const OrganizationSetupStackScreen = () => {
  const { colors } = useTheme();

  return (
    <OrganizationSetupStack.Navigator>
      <OrganizationSetupStack.Screen
        name="YourOrganizations"
        component={OrganizationSetupScreen}
        options={({ navigation }) => ({
          headerTitle: "Your Organization",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("OrganizationPrize")}
            >
              <Ionicons
                name="ios-trophy-outline"
                size={25}
                color={colors.text}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <OrganizationSetupStack.Screen
        name="findPlace"
        component={FindAddressScreen}
        options={({ navigation }) => ({
          headerTitle: "Find Address",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <OrganizationSetupStack.Screen
        name="OrganizationPrize"
        component={OrganizationPrizeScreen}
        options={({ navigation }) => ({
          headerTitle: "Setup Competition",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <OrganizationSetupStack.Screen
        name="CreateOrganization"
        component={CreateOrganizationScreen}
        options={({ navigation }) => ({
          headerTitle: "Create Organization",
          headerTitleAlign: "left",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="OrganizationTeams"
        component={OrganizationTeamsScreen}
        options={({ navigation }) => ({
          headerTitle: "Teams",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("CreateTeam")}>
              <Text
                style={{
                  color: colors.text,
                  paddingHorizontal: 15,

                  fontSize: 25,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <OrganizationSetupStack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={({ navigation }) => ({
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitle: "Add Team",
          headerTitleAlign: "left",
        })}
      />
      <OrganizationSetupStack.Screen
        name="TeamManagement"
        component={OrganizationTeamManagementScreen}
        options={({ navigation, route }) => ({
          headerTitle: "Team Management",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("TeamPrize")}>
              <Ionicons
                name="ios-trophy-outline"
                size={25}
                color={colors.text}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <OrganizationSetupStack.Screen
        name="TeamPrize"
        component={TeamPrizeScreen}
        options={({ navigation }) => ({
          headerTitle: "Setup Team Competition",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <OrganizationSetupStack.Screen
        name="AddAdmin"
        component={TeamManagementAddAdminScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Team Admin",
          headerTitleAlign: "center",

          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="AddHeadAdmin"
        component={TeamManagementAddHeadAdminScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Head Team Admin",
          headerTitleAlign: "center",

          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="EditAdmin"
        component={TeamManagementEditAdminScreen}
        options={({ navigation }) => ({
          headerTitle: "Edit Admin",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="AddEvent"
        component={TeamManagementAddEventScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Event",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="AddOpponent"
        component={OpponentList}
        options={({ navigation }) => ({
          headerTitle: "Select Opponent",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="EditEvent"
        component={TeamManagementEditEventScreen}
        options={({ navigation }) => ({
          headerTitle: "Edit Event",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <OrganizationSetupStack.Screen
        name="CreateOrganizationWithoutOwner"
        component={CreateOrganizationWithoutOwnerScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Competitor",
          headerTitleAlign: "left",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
    </OrganizationSetupStack.Navigator>
  );
};

const HomeStackScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        options={({ navigation }) => ({
          title: "Athletia",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
          },
          headerTitleAlign: "center",
          headerBackground: () => {
            "transparent";
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("FilterEvents")}
            >
              <Text
                style={{
                  color: colors.text,
                  padding: 10,
                }}
              >
                Filter
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("SelectOrganization")}
            >
              <Text
                style={{
                  color: colors.text,
                  padding: 10,
                }}
              >
                Select
              </Text>
            </TouchableOpacity>
          ),
        })}
        name="Events"
        component={HomeScreen}
      />
      <HomeStack.Screen
        options={({ navigation }) => ({
          title: "Share",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
          },
          headerTitleAlign: "center",
          headerBackground: () => {
            "transparent";
          },
        })}
        name="Share"
        component={ShareScreen}
      />
      <HomeStack.Screen
        name="FilterEvents"
        options={({ navigation }) => ({
          headerTitle: "Filter Events",
          headerTitleStyle: {
            fontSize: 20,
          },
          headerBackground: () => {
            colors.background;
          },
        })}
        component={FilterEventsScreen}
      />
      <HomeStack.Screen
        name="SelectOrganization"
        options={({ navigation }) => ({
          headerTitle: "Followed Organizations",
          headerTitleStyle: {
            fontSize: 18,
          },
          headerBackground: () => {
            colors.background;
          },
        })}
        component={FollowedOrganizationsScreen}
      />
      <HomeStack.Screen
        name="PeopleGoing"
        options={({ navigation }) => ({
          headerTitle: "Going",
          headerTitleStyle: {
            fontSize: 18,
          },
          headerBackground: () => {
            colors.background;
          },
        })}
        component={PeopleGoingScreen}
      />
    </HomeStack.Navigator>
  );
};

const SearchStackScreen = () => {
  const { colors } = useTheme();
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        options={({ navigation }) => ({
          headerTitle: "Search",
          headerTitleAlign: "center",
          ...Platform.select({
            android: {
              headerStyle: { height: 10 },
            },
            ios: {
              headerStyle: "transparent",
            },
          }),
        })}
        component={SearchScreen}
      />
      <SearchStack.Screen
        name="OrganizationEvents"
        options={({ navigation }) => ({
          headerTitle: "Events of",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
          },
          ...Platform.select({
            android: {
              headerStyle: { height: 10 },
            },
            ios: {
              headerStyle: "transparent",

              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
        component={SelectedOrgScreen}
      />
    </SearchStack.Navigator>
  );
};

const LeaderBoardStackScreen = () => {
  const { colors } = useTheme();
  return (
    <LeaderBoardStack.Navigator>
      <LeaderBoardStack.Screen
        name="LeaderBoardScreen"
        options={({ navigation }) => ({
          headerTitle: "Leaderboards of Followed Organizations",
          headerTitleAlign: "center",
          ...Platform.select({
            android: {
              headerStyle: { height: 10 },
            },
            ios: {
              headerStyle: "transparent",
            },
          }),
        })}
        component={LeaderBoardScreen}
      />
      <LeaderBoardStack.Screen
        name="OrganizationLeaderBoardScreen"
        options={({ navigation }) => ({
          headerTitle: "Leaderboards of",
          headerTitleAlign: "center",
          ...Platform.select({
            android: {
              headerStyle: { height: 10 },
            },
            ios: {
              headerStyle: "transparent",
            },
          }),
        })}
        component={LeaderBoardsOfOrganizationScreen}
      />
    </LeaderBoardStack.Navigator>
  );
};

const YourProfileStackScreen = () => {
  const { colors } = useTheme();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const requests = useSelector(
    (state) => state.team.team_admin_requests_profile
  );

  const userId = useSelector((state) => state.auth.user._id);
  const team_admin_requests = useSelector((state) =>
    state.team.team_admin_requests_list.filter(
      (request) => !request.hasOwnProperty("isHeadAdmin")
    )
  );
  const hasCurrentUserAsAdmin = team_admin_requests.some(
    (request) => request.user_recipient._id === userId
  );

  useEffect(() => {
    if (requests.length !== 0) {
      const pendingRequests = requests.filter(
        (request) => request.status === 1
      );
      if (pendingRequests.length !== 0) setHasUnreadNotifications(true);
      else setHasUnreadNotifications(false);
    }
  }, [requests]);

  return (
    <YourProfileStack.Navigator>
      <YourProfileStack.Screen
        name="Profile"
        options={({ navigation }) => ({
          headerTitle: "Your Profile",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
          headerTitleAlign: "center",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="ios-chatbox-outline"
                size={25}
                color={colors.text}
              />
              {hasUnreadNotifications && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -5,
                    backgroundColor: "orange",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                  }}
                />
              )}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text
                style={{
                  color: colors.text,
                  height: "100%",
                  padding: 10,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          ),
        })}
        component={YourProfileScreen}
      />
      <YourProfileStack.Screen
        name="TeamManagement"
        options={({ navigation }) => ({
          headerTitle: "Team Management",
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerRight: () => {
            if (!hasCurrentUserAsAdmin) {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("TeamPrize")}
                >
                  <Ionicons
                    name="ios-trophy-outline"
                    size={25}
                    color={colors.text}
                  />
                </TouchableOpacity>
              );
            }
            return null;
          },
        })}
        component={OrganizationTeamManagementScreen}
      />
      <OrganizationSetupStack.Screen
        name="TeamPrize"
        component={TeamPrizeScreen}
        options={({ navigation }) => ({
          headerTitle: "Setup Team Competition",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <YourProfileStack.Screen
        name="findPlace"
        component={FindAddressScreen}
        options={({ navigation }) => ({
          headerTitle: "Find Address",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <YourProfileStack.Screen
        name="AddAdmin"
        component={TeamManagementAddAdminScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Team Admin",
          headerTitleAlign: "center",
        })}
      />
      <YourProfileStack.Screen
        name="EditAdmin"
        component={TeamManagementEditAdminScreen}
        options={({ navigation }) => ({
          headerTitle: "Edit Admin",
          headerTitleAlign: "center",
        })}
      />
      <YourProfileStack.Screen
        name="AddEvent"
        component={TeamManagementAddEventScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Event",
          headerTitleAlign: "center",
        })}
      />
      <YourProfileStack.Screen
        name="AddOpponent"
        component={OpponentList}
        options={({ navigation }) => ({
          headerTitle: "Select Opponent",
          headerTitleAlign: "center",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <YourProfileStack.Screen
        name="CreateOrganizationWithoutOwner"
        component={CreateOrganizationWithoutOwnerScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Competitor",
          headerTitleAlign: "left",
          ...Platform.select({
            ios: {
              headerBackground: () => {
                colors.background;
              },
            },
          }),
        })}
      />
      <YourProfileStack.Screen
        name="EditEvent"
        component={TeamManagementEditEventScreen}
        options={({ navigation }) => ({
          headerTitle: "Edit Event",
          headerTitleAlign: "center",
        })}
      />
      <YourProfileStack.Screen
        name="EditProfile"
        options={({ navigation }) => ({
          headerTitle: "Edit Profile",
          headerTitleStyle: {
            fontSize: 18,
          },
        })}
        component={EditProfileScreen}
      />
      <YourProfileStack.Screen
        name="Notifications"
        options={({ navigation }) => ({
          headerTitle: "Admin Invites",
          headerTitleStyle: {
            fontSize: 18,
          },
        })}
        component={Notifications}
      />
    </YourProfileStack.Navigator>
  );
};

const NotAuthenticatedStackScreen = ({ error }) => {
  let screen = "Info";
  if (error === "LOGIN_FAIL") screen = "Login";
  if (error === "REGISTER_FAIL") screen = "Register";
  return (
    <NotAuthenticatedStack.Navigator initialRouteName={screen}>
      <NotAuthenticatedStack.Screen
        options={{ headerTransparent: true, title: "" }}
        name="Info"
        component={InfoScreen}
      />
      <NotAuthenticatedStack.Screen
        options={{
          headerStyle: {
            backgroundColor: Colors.blue,
          },
          headerTitleStyle: {
            color: "white",
          },
        }}
        name="Login"
        component={LoginScreen}
      />
      <NotAuthenticatedStack.Screen
        options={{
          headerStyle: {
            backgroundColor: Colors.blue,
          },
          headerTitleStyle: {
            color: "white",
          },
        }}
        name="Register"
        component={RegisterScreen}
      />
      <NotAuthenticatedStack.Screen
        options={{
          headerStyle: {
            backgroundColor: Colors.blue,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitle: "Verify Email",
        }}
        name="VerifyEmail"
        component={EmailVerificationScreen}
      />
      <NotAuthenticatedStack.Screen
        options={{
          headerStyle: {
            backgroundColor: Colors.blue,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitle: "Forgot Password",
        }}
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </NotAuthenticatedStack.Navigator>
  );
};

const AuthenticatedTab = createBottomTabNavigator();

const AuthenticatedTabScreen = () => {
  const { colors } = useTheme();
  const isAdminAccount = useSelector((state) => state.auth.user.isAdminAccount);

  return (
    <AuthenticatedTab.Navigator
      screenOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#999",
      }}
    >
      <AuthenticatedTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          ...Platform.select({
            android: {
              headerStyle: { height: 30 },
              headerTintColor: "transparent",
            },
            ios: {
              headerShown: false,
            },
          }),
          headerBackground: () => {
            colors.background;
          },
          tabBarBackground: () => {
            colors.background;
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home" size={24} color={color} />
          ),
        }}
      />
      <AuthenticatedTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          ...Platform.select({
            android: {
              headerStyle: { height: 30 },
              headerTintColor: "transparent",
            },
            ios: {
              headerShown: false,
            },
          }),
          tabBarBackground: () => {
            colors.background;
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-search" size={24} color={color} />
          ),
        }}
      />
      <AuthenticatedTab.Screen
        name="Leaderboards"
        component={LeaderBoardStackScreen}
        options={{
          ...Platform.select({
            android: {
              headerStyle: { height: 30 },
              headerTintColor: "transparent",
            },
            ios: {
              headerShown: false,
            },
          }),
          tabBarBackground: () => {
            colors.background;
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-trophy-outline" size={24} color={color} />
          ),
        }}
      />
      <AuthenticatedTab.Screen
        name="YourProfile"
        component={YourProfileStackScreen}
        options={{
          tabBarLabel: "Your Profile",
          ...Platform.select({
            android: {
              headerStyle: { height: 30 },
              headerTintColor: "transparent",
            },
            ios: {
              headerShown: false,
            },
          }),
          headerTitleAlign: "center",
          tabBarBackground: () => {
            colors.background;
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-person" size={24} color={color} />
          ),
        }}
      />
      {isAdminAccount === 0 ? null : (
        <AuthenticatedTab.Screen
          name="OrganizationSetup"
          component={OrganizationSetupStackScreen}
          options={({ navigation }) => ({
            tabBarLabel: "Organization Setup",
            ...Platform.select({
              android: {
                headerStyle: { height: 30 },
                headerTintColor: "transparent",
              },
              ios: {
                headerShown: false,
              },
            }),
            tabBarBackground: () => {
              colors.background;
            },
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="ios-people-circle-outline"
                size={24}
                color={color}
              />
            ),
          })}
        />
      )}
    </AuthenticatedTab.Navigator>
  );
};

// AppNavigator.js
const AppNavigator = () => {
  const isEmailVerified = useSelector(
    (state) => state.auth.user?.isEmailVerified
  );

  const error = useSelector((state) => state.error.id);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const passwordResetLinkSent = useSelector(
    (state) => state.auth.passwordResetLinkSent
  );
  const passwordResetToken = useSelector(
    (state) => state.auth.passwordResetToken
  );

  if (isLoading) {
    return <LoadingSpinnerStackScreen />;
  } else if (passwordResetToken) {
    return <ResetPasswordScreen />;
  } else if (passwordResetLinkSent) {
    return <PasswordResetEmailSentScreen />;
  } else if (isEmailVerified === false) {
    return <EmailVerificationScreen />;
  } else if (isEmailVerified === true && isAuthenticated) {
    return <AuthenticatedTabScreen />;
  } else if (!isEmailVerified && !isAuthenticated && error) {
    return <NotAuthenticatedStackScreen error={error} />;
  } else {
    return <NotAuthenticatedStackScreen error={error} />;
  }
};

export default AppNavigator;
