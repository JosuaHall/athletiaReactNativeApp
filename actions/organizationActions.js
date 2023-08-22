import {
  ORGANIZATION_CREATED,
  ORGANIZATION_IS_LOADING,
  ORGANIZATION_LIST_LOADED,
  ORGANIZATION_LOADED,
  ORGANIZATION_SELECTED,
  ALL_ORGANIZATION_LIST_LOADED,
  ORGANIZATION_UPDATED,
  FILTER_FOR_EVENTS_UPDATED,
  HOME_ORGANIZATION_SELECTED,
  HOME_ORGANIZATION_LOADED,
  TEAM_SELECTED,
  OWNER_REQUEST_SENT,
  YOUR_ORGANIZATION_LIST_IS_LOADING,
  ORGANIZATION_CREATION_FAIL,
  ORGANIZATION_LOCATION_UPDATED,
  ORGANIZATION_ADMIN_REQUESTS_LOADED,
  LEADERBOARD_CREATED,
  RESET_LEADERBOARD,
  ALL_LEADERBOARDS_LOADED,
  TEAM_LEADERBOARD_LOADED,
  LEADERBOARD_DELETED,
  TEAM_LEADERBOARD_DELETED,
  POINTS_UPDATED,
  RESET_POINTS_UPDATED,
} from "./types";
import axios from "axios";
import { proxy } from "./../package.json";
import { clearErrors, returnErrors } from "./errorActions";

//Organization created by 3rd User
export const createOrganization =
  ({ user, logo, name }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    //Request body
    //const body = JSON.stringify({ name, admin_email });
    const formData = new FormData();
    formData.append("created_by", user);
    formData.append("logo", logo.uri);
    formData.append("name", name);

    axios
      .post(
        `${proxy}/api/organizations/create/without/owner/${user}`,
        formData,
        config
      )
      .then((res) => {
        dispatch({ type: ORGANIZATION_CREATED, payload: res.data });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "ORGANIZATION_CREATION_FAIL"
          )
        );
      });
  };

export const createOrganizationWithOwner =
  ({ user, logo, name }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    //Request body
    //const body = JSON.stringify({ name, admin_email });
    const formData = new FormData();
    formData.append("owner", user);
    formData.append("logo", logo.uri);
    formData.append("name", name);

    axios
      .post(`${proxy}/api/organizations/create/${user}`, formData, config)
      .then((res) => {
        dispatch({ type: ORGANIZATION_CREATED, payload: res.data });
        dispatch(clearErrors());
      })
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "ORGANIZATION_CREATION_FAIL"
          )
        );
      });
  };

export const getOrganizationList = (id) => (dispatch) => {
  dispatch({ type: YOUR_ORGANIZATION_LIST_IS_LOADING });
  axios
    .get(`${proxy}/api/organizations/list/${id}`)
    .then((res) => {
      dispatch({ type: ORGANIZATION_LIST_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const setCurrentOrganization = (id) => (dispatch) => {
  dispatch({ type: ORGANIZATION_SELECTED, payload: id });
};

export const setHomeOrganization = (org) => (dispatch) => {
  dispatch({ type: HOME_ORGANIZATION_SELECTED, payload: org });
};

export const getOrganization = (organizationid) => (dispatch) => {
  dispatch({ type: ORGANIZATION_IS_LOADING });
  axios
    .get(`${proxy}/api/organizations/organization/${organizationid}`)
    .then((res) => {
      dispatch({ type: ORGANIZATION_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getOrganizationAndTeam =
  (organizationId, teamId) => (dispatch) => {
    dispatch({ type: ORGANIZATION_IS_LOADING });
    axios
      .get(
        `${proxy}/api/organizations/organization/team/${organizationId}/${teamId}`
      )
      .then((res) => {
        dispatch({ type: ORGANIZATION_LOADED, payload: res.data.organization });
        dispatch({ type: TEAM_SELECTED, payload: res.data.team });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const getOrganizationHome = (organizationid) => (dispatch) => {
  dispatch({ type: ORGANIZATION_IS_LOADING });
  axios
    .get(`${proxy}/api/organizations/organization/${organizationid}`)
    .then((res) => {
      dispatch({ type: HOME_ORGANIZATION_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllOrganizations = (searchTerm) => (dispatch) => {
  axios
    .get(`${proxy}/api/organizations/get/all/${searchTerm}`)
    .then((res) => {
      dispatch({ type: ALL_ORGANIZATION_LIST_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const attendEvent = (orgid, teamid, eventid, userid) => (dispatch) => {
  dispatch({ type: ORGANIZATION_IS_LOADING });
  axios
    .put(
      `${proxy}/api/organizations/event/attend/${orgid}/${teamid}/${eventid}/${userid}`
    )
    .then((res) => {
      dispatch({ type: HOME_ORGANIZATION_LOADED, payload: res.data }); //might need to be updated: if not used somewher else in the program
    })
    .catch((err) => {
      console.log(err);
    });
};

export const unattendEvent = (orgid, teamid, eventid, userid) => (dispatch) => {
  dispatch({ type: ORGANIZATION_IS_LOADING });
  axios
    .put(
      `${proxy}/api/organizations/event/unattend/${orgid}/${teamid}/${eventid}/${userid}`
    )
    .then((res) => {
      dispatch({ type: HOME_ORGANIZATION_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setFilterForEvents = (filter) => (dispatch) => {
  dispatch({
    type: FILTER_FOR_EVENTS_UPDATED,
    payload: filter,
  });
};

//deals with both, organization whose have an admin, and organizations whose don't
export const sendOwnerRequest = (orgid, userid) => (dispatch) => {
  axios
    .post(`${proxy}/api/organizations/send/owner/request/${userid}/${orgid}`)
    .then((res) => {
      dispatch({ type: OWNER_REQUEST_SENT, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getOrganizationAdminRequests = (userid) => (dispatch) => {
  axios
    .get(
      `${proxy}/api/organizations/organization/admin/requests/user/${userid}`
    )
    .then((res) => {
      dispatch({
        type: ORGANIZATION_ADMIN_REQUESTS_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateOrganizationLocation =
  (selectedLocation, orgid) => (dispatch) => {
    dispatch({ type: YOUR_ORGANIZATION_LIST_IS_LOADING });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log(selectedLocation, orgid);
    //Request body
    const body = JSON.stringify({
      address: selectedLocation.address,
      longitude: selectedLocation.longitude,
      latitude: selectedLocation.latitude,
    });

    axios
      .put(`${proxy}/api/organizations/update/location/${orgid}`, body, config)
      .then((res) => {
        dispatch({ type: ORGANIZATION_LOCATION_UPDATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const updateEventLocation = (selectedLocation, orgid) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(selectedLocation, orgid);
  //Request body
  const body = JSON.stringify({
    address: selectedLocation.address,
    longitude: selectedLocation.longitude,
    latitude: selectedLocation.latitude,
  });

  axios
    .put(
      `${proxy}/api/organizations/update/event/location/${orgid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: ORGANIZATION_UPDATED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createLeaderboard =
  ({ orgid, teamid, startDate, endDate, prizeList }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      orgid,
      startDate,
      endDate,
      prizeList,
      teamid,
    };

    axios
      .post(`${proxy}/api/organizations/new/leaderboard`, body, config)
      .then((res) => {
        if (res.data.team) {
          dispatch({ type: TEAM_LEADERBOARD_LOADED, payload: res.data });
        } else {
          dispatch({ type: LEADERBOARD_CREATED, payload: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const getLeaderboard = (orgid) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .get(`${proxy}/api/organizations/get/leaderboard/${orgid}`, config)
    .then((res) => {
      if (res.data.team) {
        dispatch({ type: TEAM_LEADERBOARD_LOADED, payload: res.data });
      } else {
        dispatch({ type: LEADERBOARD_CREATED, payload: res.data });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteLeaderboard = (id) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .delete(`${proxy}/api/organizations/delete/leaderboard/${id}`, config)
    .then((res) => {
      dispatch({ type: LEADERBOARD_DELETED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteTeamLeaderboard = (id) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .delete(`${proxy}/api/organizations/delete/leaderboard/${id}`, config)
    .then((res) => {
      dispatch({ type: TEAM_LEADERBOARD_DELETED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetLeaderboard = () => (dispatch) => {
  dispatch({ type: RESET_LEADERBOARD });
};

export const resetPointsUpdated = () => (dispatch) => {
  dispatch({ type: RESET_POINTS_UPDATED });
};

export const getAllLeaderboardsOfOrganization = (orgIds) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const orgIdsString = orgIds.join(","); // Convert the orgIds array to a string

  axios
    .get(
      `${proxy}/api/organizations/get/leaderboards?orgIds=${orgIdsString}`,
      config
    )
    .then((res) => {
      dispatch({ type: ALL_LEADERBOARDS_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updatePoints = (userid, teamid, orgid, eventid) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = {
    userid,
    teamid,
    eventid,
  };

  axios
    .put(
      `${proxy}/api/organizations/update/user/points/organization/${orgid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: POINTS_UPDATED });
    })
    .catch((err) => {
      dispatch({ type: POINTS_UPDATED });
    });
};
