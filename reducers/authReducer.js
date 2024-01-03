import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PROFILE_PICTURE_UPDATED,
  TEAM_FOLLOWED,
  TEAM_UNFOLLOWED,
  IS_FOLLOWED,
  NOT_FOLLOWED,
  SET_ORGANIZATIONS_FOLLOWED_LIST,
  SET_TEAMS_FOLLOWED_LIST,
  SET_SELECTED_FOLLOWED_ORGANIZATION,
  FILTERED_USER_LIST_LOADED,
  EMAIL_VERIFIED,
  PASSWORD_RESET_LINK_VALID,
  RESET_PASSWORD_LINK_SENT,
  RESET_PASSWORD_LINK_FAILED,
  SUBMIT_NEW_PASSWORD_SUCCESS,
  SUBMIT_NEW_PASSWORD_FAIL,
  API_KEY_LOADED,
  SOCIALS_UPDATED,
  RESET_UPDATED_SOCIALS,
  ACCOUNT_SUCCESSFUL_DELETED,
  SET_NOTIFICATION_DATA,
  RESET_NOTIFICATION_DATA,
} from "../actions/types";

import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isAuthenticated: null,
  userloaded: false,
  isLoading: false,
  user: null,
  team_followed: false,
  organizations_followed: [],
  followed_teams: [],
  anyOrg_followed: "",
  org_selected_id: "",
  filtered_users: [],
  passwordResetLinkSent: false,
  passwordResetToken: "",
  apiKey: "",
  updatedSocials: [],
  isAccDeleted: "",
  appOpenedWithPushNotification: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        followed_teams: action.payload.teams_followed,
        userloaded: true,
        isAuthenticated: true,
        isLoading: false,
        /*token: token,*/
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        userloaded: true,
        isLoading: false,
        isAuthenticated: true,
        ...action.payload,
      };
    case EMAIL_VERIFIED:
      AsyncStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        userloaded: true,
        isLoading: false,
        ...action.payload,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      AsyncStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        userloaded: false,
        isAuthenticated: false,
        isLoading: false,
      };
    case ACCOUNT_SUCCESSFUL_DELETED:
      AsyncStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        userloaded: false,
        isAuthenticated: false,
        isLoading: false,
        isAccDeleted: action.payload,
      };
    case RESET_PASSWORD_LINK_SENT:
      return {
        ...state,
        passwordResetLinkSent: action.payload,
        isLoading: false,
      };
    case RESET_PASSWORD_LINK_FAILED:
      return {
        ...state,
        passwordResetLinkSent: false,
        isLoading: false,
      };
    case SUBMIT_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordResetToken: "",
        passwordResetLinkSent: false,
      };
    case SUBMIT_NEW_PASSWORD_FAIL:
      return {
        ...state,
        passwordResetToken: "",
        passwordResetLinkSent: false,
      };
    case PASSWORD_RESET_LINK_VALID:
      return {
        ...state,
        passwordResetToken: action.payload,
        passwordResetLinkSent: false,
      };
    case PROFILE_PICTURE_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          profileImg: action.payload.profileImg,
        },
      };
    case TEAM_FOLLOWED:
      return {
        ...state,
        user: action.payload,
        team_followed: true,
      };
    case TEAM_UNFOLLOWED:
      return {
        ...state,
        user: action.payload,
        team_followed: false,
      };
    case IS_FOLLOWED:
      return {
        ...state,
        team_followed: true,
      };
    case NOT_FOLLOWED:
      return {
        ...state,
        team_followed: false,
      };
    case SET_TEAMS_FOLLOWED_LIST:
      return {
        ...state,
        followed_teams: action.payload,
      };
    case SET_ORGANIZATIONS_FOLLOWED_LIST:
      return {
        ...state,
        organizations_followed: action.payload,
      };
    case SET_SELECTED_FOLLOWED_ORGANIZATION:
      return {
        ...state,
        anyOrg_followed: action.payload,
      };
    case FILTERED_USER_LIST_LOADED:
      return {
        ...state,
        filtered_users: action.payload,
      };
    case API_KEY_LOADED:
      return {
        ...state,
        apiKey: action.payload.apiKey,
      };
    case SOCIALS_UPDATED:
      return {
        ...state,
        updatedSocials: action.payload,
      };
    case RESET_UPDATED_SOCIALS:
      return {
        ...state,
        updatedSocials: [],
      };
    case SET_NOTIFICATION_DATA:
      return {
        ...state,
        appOpenedWithPushNotification: action.payload,
      };
    case RESET_NOTIFICATION_DATA:
      return {
        ...state,
        appOpenedWithPushNotification: "",
      };
    default:
      return state;
  }
}
