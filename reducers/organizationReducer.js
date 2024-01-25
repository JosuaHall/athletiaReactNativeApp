import {
  ORGANIZATION_CREATED,
  ORGANIZATION_LIST_LOADED,
  ORGANIZATION_SELECTED,
  ORGANIZATION_IS_LOADING,
  ORGANIZATION_LOADED,
  ALL_ORGANIZATION_LIST_LOADED,
  ORGANIZATION_UPDATED,
  FILTER_FOR_EVENTS_UPDATED,
  RESET_IS_CREATED,
  FOUND_ORG_SELECTED,
  HOME_ORGANIZATION_SELECTED,
  RESET_FILTERED_HOME_ORGANIZATION,
  HOME_ORGANIZATION_LOADED,
  OWNER_REQUEST_SENT,
  YOUR_ORGANIZATION_LIST_IS_LOADING,
  ORGANIZATION_LOCATION_UPDATED,
  ORGANIZATION_STREAM_LINK_UPDATED,
  ORGANIZATION_ADMIN_REQUESTS_LOADED,
  LEADERBOARD_CREATED,
  RESET_LEADERBOARD,
  ALL_LEADERBOARDS_LOADED,
  LEADERBOARD_DELETED,
  POINTS_UPDATED,
  RESET_POINTS_UPDATED,
  TRIGGER_SCROLL_TO_LATEST_EVENT,
  STREAM_LINK_SELECTED,
} from "../actions/types";

const initialState = {
  logo: "",
  name: "",
  admin_email: "",
  isCreated: false,
  organization_list: false,
  selected: "",
  selectedOrgId: "",
  isLoading: false,
  orgIsLoading: false,
  allOrganizations: [],
  msg: "",
  homeCheckBox: false,
  awayCheckBox: false,
  selectedOption: "",
  foundOrg: "",
  homeSelectedOrg: "",
  homeOrgRender: "",
  ownerRequestsSent: [],
  ownerChangeRequestsSent: [],
  yourOrgListIsLoading: false,
  orgLeaderboard: "",
  allLeaderboards: "",
  pointsUpdated: false,
  homeButton: false,
  selectedStreamLink: "",
  //stores currently selected Organization
  //homeSelectedOrgRender: //needs to store the uptodate org object coming from getOrg
  //                       triggers: user attends,unattends, changes org selected, unfollowed, follow
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ORGANIZATION_CREATED:
      return {
        ...state,
        logo: action.payload.logo,
        isCreated: true,
        name: action.payload.name,
        admin_email: action.payload.admin_email,
      };
    case ORGANIZATION_LIST_LOADED:
      return {
        ...state,
        selected: "",
        yourOrgListIsLoading: false,
        organization_list: action.payload,
      };
    case YOUR_ORGANIZATION_LIST_IS_LOADING:
      return {
        ...state,
        yourOrgListIsLoading: true,
      };
    case ORGANIZATION_SELECTED:
      return {
        ...state,
        orgIsLoading: true,
        selectedOrgId: action.payload,
      };
    case ORGANIZATION_LOADED:
      return {
        ...state,
        orgIsLoading: false,
        selected: action.payload,
      };
    case ORGANIZATION_LOCATION_UPDATED:
      return {
        ...state,
        selected: "",
        yourOrgListIsLoading: false,
        organization_list: action.payload,
      };
    case ORGANIZATION_STREAM_LINK_UPDATED:
      return {
        ...state,
        selected: "",
        yourOrgListIsLoading: false,
        organization_list: action.payload,
      };
    case HOME_ORGANIZATION_LOADED:
      return {
        ...state,
        orgIsLoading: false,
        homeOrgRender: action.payload,
      };
    case ALL_ORGANIZATION_LIST_LOADED:
      return {
        ...state,
        allOrganizations: action.payload,
      };
    case ORGANIZATION_UPDATED: //might need to add another selected for the Home or another case
      return {
        ...state,
        selected: action.payload,
      };
    case FILTER_FOR_EVENTS_UPDATED:
      return {
        ...state,
        homeCheckBox: action.payload.home,
        awayCheckBox: action.payload.away,
        selectedOption: action.payload.teams,
      };
    case RESET_IS_CREATED:
      return {
        ...state,
        isCreated: false,
      };
    case RESET_FILTERED_HOME_ORGANIZATION:
      return {
        ...state,
        homeSelectedOrg: "",
      };
    case ORGANIZATION_IS_LOADING:
      return {
        ...state,
        orgIsLoading: true,
      };
    case FOUND_ORG_SELECTED:
      return {
        ...state,
        foundOrg: action.payload,
      };
    case HOME_ORGANIZATION_SELECTED:
      return {
        ...state,
        homeSelectedOrg: action.payload,
      };
    case OWNER_REQUEST_SENT:
      return {
        ...state,
        ownerRequestsSent: action.payload.orgRequests,
        ownerChangeRequestsSent: action.payload.changeRequests,
      };
    case ORGANIZATION_ADMIN_REQUESTS_LOADED:
      return {
        ...state,
        ownerRequestsSent: action.payload.organizationAdminRequests,
        ownerChangeRequestsSent: action.payload.changeOrganizationAdminRequests,
      };
    case LEADERBOARD_CREATED:
      return {
        ...state,
        orgLeaderboard: action.payload,
      };
    case LEADERBOARD_DELETED:
      return {
        ...state,
        orgLeaderboard: "",
      };
    case RESET_LEADERBOARD:
      return {
        ...state,
        orgLeaderboard: "",
        allLeaderboards: "",
      };
    case ALL_LEADERBOARDS_LOADED:
      return {
        ...state,
        allLeaderboards: action.payload,
      };
    case POINTS_UPDATED:
      return {
        ...state,
        pointsUpdated: true,
      };
    case RESET_POINTS_UPDATED:
      return {
        ...state,
        pointsUpdated: false,
      };
    case TRIGGER_SCROLL_TO_LATEST_EVENT:
      return {
        ...state,
        homeButton: action.payload,
      };
    case STREAM_LINK_SELECTED:
      return {
        ...state,
        selectedStreamLink: action.payload,
      };
    default:
      return state;
  }
}
