import {
  TEAM_CREATED,
  TEAM_SELECTED,
  TEAM_ADMIN_REQUEST_SENT,
  TEAM_ADMIN_REQUEST_LOADING,
  TEAM_ADMIN_REQUESTS_LOADED,
  TEAM_ADMIN_REQUEST_UPDATED,
  TEAM_ADMIN_EDIT_SELECTED,
  TEAM_DELETED,
  SPORTS_LOADED,
  RESET_TEAM_IS_CREATED,
  RESET_TEAM_IS_DELETED,
  TEAM_CREATION_REQUEST,
  LOAD_TEAM_ADMIN_REQUESTS,
  RESET_TEAM_ADMIN_REQUEST_LIST,
  TEAM_ADMIN_REQUESTS_PROFILE_LOADED,
  TEAM_ADMIN_REQUESTS_PROFILE_RESETED,
  RESET_TEAM_REDUCER,
  TEAM_LEADERBOARD_LOADED,
  TEAM_LEADERBOARD_DELETED,
  TEAM_LEADERBOARD_LOADING,
} from "../actions/types";

const initialState = {
  sport: "",
  admin: "",
  isCreating: false,
  isCreated: false,
  isDeleted: false,
  team_list: [],
  selected_team: "",
  isLoading: false,
  isLoadingRequests: false,
  adminRequestIsLoading: false,
  adminRequestSent: false,
  selected_team_admin: "",
  team_admin_request: "",
  team_admin_requests_list: [],
  team_admin_requests_profile: [],
  teamLeaderboard: "",
  teamLeaderboardLoading: false,
  all_sports: "",
  msg: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TEAM_CREATED:
      return {
        ...state,
        isCreating: false,
        isCreated: true,
        team_list: action.payload.teams,
      };
    case TEAM_DELETED:
      return {
        ...state,
        isDeleted: true,
        team_list: action.payload.teams,
      };
    case TEAM_SELECTED:
      return {
        ...state,
        selected_team: action.payload,
      };
    case TEAM_ADMIN_REQUEST_LOADING:
      return {
        ...state,
        adminRequestIsLoading: true,
      };
    case TEAM_ADMIN_REQUEST_SENT:
      return {
        ...state,
        isLoading: true,
        adminRequestIsLoading: false,
        adminRequestSent: true,
        team_admin_request: action.payload,
      };
    case TEAM_ADMIN_REQUEST_UPDATED:
      return {
        ...state,
        isLoading: false,
        isLoadingRequests: false,
        adminRequestIsLoading: false,
        adminRequestSent: true,
        team_admin_request: action.payload,
      };
    case TEAM_ADMIN_REQUESTS_LOADED:
      return {
        ...state,
        isLoading: false,
        isLoadingRequests: false,
        team_admin_requests_list: action.payload,
      };
    case TEAM_ADMIN_REQUESTS_PROFILE_LOADED:
      return {
        ...state,
        isLoading: false,
        isLoadingRequests: false,
        adminRequestSent: false,
        team_admin_requests_profile: action.payload,
      };
    case TEAM_ADMIN_REQUESTS_PROFILE_RESETED:
      return {
        ...state,
        isLoading: false,
        isLoadingRequests: false,
        adminRequestSent: false,
        team_admin_requests_profile: [],
      };
    case SPORTS_LOADED:
      return {
        ...state,
        all_sports: action.payload,
      };
    case RESET_TEAM_IS_CREATED:
      return {
        ...state,
        isCreated: false,
        adminRequestIsLoading: false,
        adminRequestSent: false,
      };
    case RESET_TEAM_IS_DELETED:
      return {
        ...state,
        isDeleted: false,
      };
    case TEAM_CREATION_REQUEST:
      return {
        ...state,
        isCreating: false,
      };
    case TEAM_ADMIN_EDIT_SELECTED:
      return {
        ...state,
        selected_team_admin: action.payload,
      };
    case LOAD_TEAM_ADMIN_REQUESTS:
      return {
        ...state,
        isLoadingRequests: true,
      };
    case RESET_TEAM_ADMIN_REQUEST_LIST:
      return {
        ...state,
        team_admin_requests_list: [],
      };
    case TEAM_LEADERBOARD_LOADING:
      return {
        ...state,
        teamLeaderboardLoading: true,
      };
    case TEAM_LEADERBOARD_LOADED:
      return {
        ...state,
        teamLeaderboard: action.payload,
        teamLeaderboardLoading: false,
      };
    case TEAM_LEADERBOARD_DELETED:
      return {
        ...state,
        teamLeaderboard: "",
      };
    case RESET_TEAM_REDUCER:
      return initialState; // Reset the state to the initial state
    default:
      return state;
  }
}
