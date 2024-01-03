import {
  TEAM_CREATED,
  TEAM_SELECTED,
  TEAM_CREATION_REQUEST,
  TEAM_ADMIN_REQUEST_SENT,
  TEAM_ADMIN_REQUESTS_LOADED,
  TEAM_ADMIN_REQUEST_UPDATED,
  TEAM_ADMIN_REQUEST_LOADING,
  TEAM_DELETED,
  SPORTS_LOADED,
  LOAD_TEAM_ADMIN_REQUESTS,
  TEAM_ADMIN_REQUESTS_PROFILE_LOADED,
  TEAM_ADMIN_REQUESTS_PROFILE_RESETED,
  RESET_TEAM_REDUCER,
  TEAM_LEADERBOARD_LOADED,
  TEAM_LEADERBOARD_LOADING,
} from "./types";
import axios from "axios";
import { proxy } from "./../package.json";

export const createTeam =
  ({ userid, organizationid, sport }) =>
  (dispatch) => {
    dispatch({ type: TEAM_CREATION_REQUEST });
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({ userid, organizationid, sport });

    axios
      .put(
        `${proxy}/api/organizations/create/team/${userid}/${organizationid}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: TEAM_CREATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteTeam =
  ({ org, id }) =>
  (dispatch) => {
    axios
      .put(`${proxy}/api/organizations/delete/team/${id}/${org}`)
      .then((res) => {
        dispatch({ type: TEAM_DELETED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const setCurrentTeam = (id) => (dispatch) => {
  dispatch({ type: TEAM_SELECTED, payload: id });
};

export const getTeamList = (userid, organizationid) => (dispatch) => {
  axios.get(`${proxy}/api/organizations/organization/teams`);
};

export const getSports = () => (dispatch) => {
  axios
    .get(`${proxy}/api/organizations/get/sports`)
    .then((res) => {
      dispatch({ type: SPORTS_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const sendTeamAdminRequest =
  (request_by_user, user_recipient, organization, team, sport, status) =>
  (dispatch) => {
    dispatch({ type: TEAM_ADMIN_REQUEST_LOADING });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({
      request_by_user,
      user_recipient,
      organization,
      team,
      sport,
      status,
    });

    axios
      .post(
        `${proxy}/api/organizations/send/team/admin/request/${request_by_user}/${user_recipient}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: TEAM_ADMIN_REQUEST_SENT, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const sendTeamHeadAdminRequest =
  (request_by_user, user_recipient, organization, team, sport, status) =>
  (dispatch) => {
    dispatch({ type: TEAM_ADMIN_REQUEST_LOADING });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({
      request_by_user,
      user_recipient,
      organization,
      team,
      sport,
      status,
    });

    axios
      .post(
        `${proxy}/api/organizations/send/team/head/admin/request/${request_by_user}/${user_recipient}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: TEAM_ADMIN_REQUEST_SENT, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const getTeamAdminRequests = (request_by_user, team) => (dispatch) => {
  dispatch({ type: LOAD_TEAM_ADMIN_REQUESTS });
  axios
    .get(
      `${proxy}/api/organizations/get/team/admin/requests/${request_by_user}/${team}`
    )
    .then((res) => {
      dispatch({ type: TEAM_ADMIN_REQUESTS_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const loadTeamAdminRequests = (user_recipient) => (dispatch) => {
  dispatch({ type: LOAD_TEAM_ADMIN_REQUESTS });
  axios
    .get(
      `${proxy}/api/organizations/load/team/admin/requests/${user_recipient}`
    )
    .then((res) => {
      dispatch({ type: TEAM_ADMIN_REQUESTS_PROFILE_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const acceptRequest = (id) => (dispatch) => {
  dispatch({ type: LOAD_TEAM_ADMIN_REQUESTS });
  axios
    .put(`${proxy}/api/organizations/accept/request/${id}`)
    .then((res) => {
      dispatch({ type: TEAM_ADMIN_REQUEST_UPDATED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteTeamAdminRequestEntry = (id) => (dispatch) => {
  dispatch({ type: LOAD_TEAM_ADMIN_REQUESTS });
  axios
    .delete(`${proxy}/api/organizations/delete/team/admin/request/entry/${id}`)
    .then((res) => {
      dispatch({ type: TEAM_ADMIN_REQUEST_UPDATED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetTeamReducer = () => (dispatch) => {
  dispatch({ type: RESET_TEAM_REDUCER });
};

export const getTeamLeaderboard = (orgid, teamid) => (dispatch) => {
  dispatch({ type: TEAM_LEADERBOARD_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .get(
      `${proxy}/api/organizations/get/TeamLeaderboard/${orgid}/${teamid}`,
      config
    )
    .then((res) => {
      dispatch({ type: TEAM_LEADERBOARD_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: TEAM_LEADERBOARD_LOADED, payload: "" });
    });
};

export const resetProfileTeams = () => (dispatch) => {
  dispatch({ type: TEAM_ADMIN_REQUESTS_PROFILE_RESETED });
};
