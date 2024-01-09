import axios from "axios";
import { returnErrors, clearErrors } from "./errorActions";
import { proxy } from "../package.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  schedulePushNotification,
  cancelNotificationsForOrganization,
} from "../config/notificationUtils";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  EMAIL_VERIFIED,
  REGISTER_FAIL,
  PROFILE_PICTURE_UPDATED,
  TEAM_FOLLOWED,
  TEAM_UNFOLLOWED,
  IS_FOLLOWED,
  NOT_FOLLOWED,
  SET_TEAMS_FOLLOWED_LIST,
  SET_ORGANIZATIONS_FOLLOWED_LIST,
  SET_SELECTED_FOLLOWED_ORGANIZATION,
  FILTERED_USER_LIST_LOADED,
  PASSWORD_RESET_LINK_VALID,
  RESET_PASSWORD_LINK_SENT,
  RESET_PASSWORD_LINK_FAILED,
  SUBMIT_NEW_PASSWORD_SUCCESS,
  SUBMIT_NEW_PASSWORD_FAIL,
  API_KEY_LOADED,
  SOCIALS_UPDATED,
  RESET_UPDATED_SOCIALS,
  ACCOUNT_SUCCESSFUL_DELETED,
  PASSWORD_RESET_SUCCESS_FLAG_RESETTED,
  SET_NOTIFICATION_DATA,
  RESET_NOTIFICATION_DATA,
} from "./types";
import { resetProfileTeams, resetTeamReducer } from "./teamActions";
import { resetLeaderboard } from "./organizationActions";

/*Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get(`${proxy}/api/auth/user`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    });
};*/
export const loadUser = () => async (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  try {
    const tokenConfig = await tokenAConfig(getState);
    const res = await axios.get(`${proxy}/api/auth/user`, tokenConfig);

    dispatch({
      type: USER_LOADED,
      payload: res.data.user,
    });

    const token = res.headers["x-auth-token"];

    if (token) {
      storeInAsync(token);
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
    console.log(err);
  }
};

//update User profile
export const updateProfilePicture =
  ({ userid, logo }) =>
  (dispatch) => {
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("profileImg", logo.uri);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    axios
      .put(
        `${proxy}/api/organizations/updateProfilePicture/${userid}`,
        formData,
        config
      )
      .then((res) => {
        dispatch({ type: PROFILE_PICTURE_UPDATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

// Register User
export const register =
  ({ name, email, password, firstName, lastName, isAdminAccount, isPrivate }) =>
  (dispatch) => {
    dispatch({ type: USER_LOADING });
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Request body
    const body = JSON.stringify({
      name,
      email,
      password,
      firstName,
      lastName,
      isAdminAccount,
      isPrivate,
    });

    axios
      .post(`${proxy}/api/users`, body, config)
      .then((res) => {
        dispatch(clearErrors());
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
        );
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

const storeInAsync = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (err) {
    console.log("Token unsucessfully set in local storage: ", err);
  }
};

export const verifyEmail =
  ({ verificationCode }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${proxy}/api/users/verify?code=${verificationCode}`, config)
      .then((res) => {
        dispatch({
          type: EMAIL_VERIFIED,
          payload: res.data,
        });
        storeInAsync(res.data.token);
      })
      .catch((err) => {
        dispatch({
          type: REGISTER_FAIL,
        });
        // Optionally, you can dispatch additional actions or handle the error response
      });
  };

export const verifyPasswordResetLink =
  ({ verificationCode }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(verificationCode);
    axios
      .get(`${proxy}/api/users/validate/password/reset/link`, {
        params: { code: verificationCode },
        ...config,
      })
      .then((res) => {
        dispatch({
          type: PASSWORD_RESET_LINK_VALID,
          payload: res.data.token, // Store the valid token in the Redux store
        });
      })
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "PASSWORD_RESET_LINK_INVALID"
          )
        );
        // Optionally, you can dispatch additional actions or handle the error response
      });
  };

// Send Forgot PasswordLink
export const sendResetPasswordLink = (email) => (dispatch) => {
  dispatch({ type: USER_LOADING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ email });

  axios
    .post(`${proxy}/api/users/forgot/password`, body, config)
    .then((res) => {
      dispatch(clearErrors());
      dispatch({
        type: RESET_PASSWORD_LINK_SENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "RESET_PASSWORD_LINK_FAILED"
        )
      );
      dispatch({ type: RESET_PASSWORD_LINK_FAILED });
    });
};

export const submitNewPassword =
  (passwordResetToken, password) => (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (passwordResetToken) {
      config.headers["x-auth-token"] = passwordResetToken;
    }

    const body = JSON.stringify({ password });

    axios
      .post(`${proxy}/api/users/reset/password`, body, config)
      .then((res) => {
        dispatch({
          type: SUBMIT_NEW_PASSWORD_SUCCESS,
        });
      })
      .catch((err) => {
        dispatch({
          type: SUBMIT_NEW_PASSWORD_FAIL,
          payload: err.response.data.msg,
        });
      });
  };

// Login User
export const login =
  ({ email, password }) =>
  (dispatch) => {
    dispatch({ type: USER_LOADING });
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Request body
    const body = JSON.stringify({ email, password });
    axios
      .post(`${proxy}/api/auth`, body, config)
      .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
        storeInAsync(res.data.token);
        dispatch(clearErrors());
      })
      .catch((err) => {
        console.log("login error: ", err);
        dispatch(
          returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
        );
        dispatch({
          type: LOGIN_FAIL,
        });
      });
  };

// Logout User
export const logout = () => (dispatch) => {
  dispatch(resetTeamReducer());
  dispatch(resetLeaderboard());
  dispatch(resetProfileTeams());
  dispatch({ type: LOGOUT_SUCCESS });
};

// Setup config/headers and token
export const tokenAConfig = async (getState) => {
  // Get token from Async Storage
  const token = await AsyncStorage.getItem("token");

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

// Asynchronous function to set up push notifications for events
async function setNotificationsForEvents(allEvents, orgid) {
  for (const event of allEvents) {
    try {
      // Attempt to schedule push notification for the event
      await schedulePushNotification(event, orgid);
      console.log(`Push notification scheduled for event: ${event._id}`);
    } catch (error) {
      // Handle the error as needed
      console.error(
        `Error scheduling notification for event ${event._id}:`,
        error.message
      );

      // Optionally, you can continue with the next event even if an error occurs
      // Remove the next line if you want to stop processing on error
      continue;
    }
  }
}

// Action to set up push notifications for events of followed organizations
export const setPushNotificationsForEventsOfFollowedOrganizations =
  (organizations) => async (dispatch) => {
    try {
      // Retrieve stored notifications from AsyncStorage
      const storedNotifications = await getStoredNotifications();

      for (const organization of organizations) {
        for (const team of organization.teams) {
          const allEvents = team.events.filter(
            (event) => new Date(event.date_time) > Date.now()
          );
          // Remove notifications for events that no longer exist
          const orgId = organization._id;

          for (const [key, value] of storedNotifications.entries()) {
            const [storedOrgId, storedEventId] = key.split("_");
            if (
              storedOrgId === orgId &&
              !allEvents.some((event) => event._id === storedEventId)
            ) {
              // Cancel the notification for the deleted event
              await Notifications.cancelScheduledNotificationAsync(key);

              // Remove the notification from the stored notifications map
              storedNotifications.delete(key);
            }
          }
          await setNotificationsForEvents(allEvents, organization._id);
        }
      }
      // Additional logic if needed after setting up notifications for all events
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error setting up push notifications:", error.message);
    }
  };

// Function to retrieve stored notifications from AsyncStorage
async function getStoredNotifications() {
  const storedNotifications = await AsyncStorage.getItem(
    "scheduledNotifications"
  );
  return storedNotifications
    ? new Map(JSON.parse(storedNotifications))
    : new Map();
}

export const followOrganization = (userid, orgid, all_events) => (dispatch) => {
  //all_events is an array for all upcoming events: need to set notifications for them and also keep track of _id
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ orgid });

  axios
    .put(
      `${proxy}/api/users/follow/organization/${userid}/${orgid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: TEAM_FOLLOWED, payload: res.data });

      // Set up push notifications asynchronously
      setNotificationsForEvents(all_events, orgid);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const unfollowOrganization = (userid, orgid) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ orgid });

  axios
    .put(
      `${proxy}/api/users/unfollow/organization/${userid}/${orgid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: TEAM_UNFOLLOWED, payload: res.data });

      // After successfully unfollowing, cancel notifications for the organization
      cancelNotificationsForOrganization(orgid);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateSocials = (updatedSocials) => (dispatch) => {
  dispatch({ type: SOCIALS_UPDATED, payload: updatedSocials });
};

export const saveUpdatedSocials = (userid, updatedSocials) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ socials: updatedSocials });

  axios
    .put(`${proxy}/api/users/updateSocials/${userid}`, body, config)
    .then((res) => {
      dispatch({ type: SOCIALS_UPDATED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resetUpdatedSocials = () => (dispatch) => {
  dispatch({ type: RESET_UPDATED_SOCIALS });
};

export const isTeamFollowed = (followed) => (dispatch) => {
  if (followed) dispatch({ type: IS_FOLLOWED });
  dispatch({ type: NOT_FOLLOWED });
};

export const setTeamsFollowed = (teams) => (dispatch) => {
  dispatch({ type: SET_TEAMS_FOLLOWED_LIST, payload: teams });
};

export const setOrganizationsFollowed = (organizations) => (dispatch) => {
  dispatch({
    type: SET_ORGANIZATIONS_FOLLOWED_LIST,
    payload: organizations,
  });
};

export const selectFollowedOrganization = (organization) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_FOLLOWED_ORGANIZATION,
    payload: organization,
  });
};

export const getFilteredUsers = (search_string) => (dispatch) => {
  axios
    .get(`${proxy}/api/users/get/filtered/users`, {
      params: { name: search_string },
    })
    .then((res) => {
      dispatch({ type: FILTERED_USER_LIST_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateUserPrivacySetting = (userid, isPrivate) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ isPrivate });

  axios
    .put(
      `${proxy}/api/users/update/privacy/setting/user/${userid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data.user });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAPIToken = () => async (dispatch, getState) => {
  const tokenConfig = await tokenAConfig(getState);
  axios
    .get(`${proxy}/api/auth/get/api/key`, tokenConfig)
    .then((res) => {
      dispatch({ type: API_KEY_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR });
      console.log(err);
    });
};

export const updateUserAcknowledgement = (userid) => (dispatch) => {
  axios
    .put(`${proxy}/api/users/user/${userid}/acknowledgement/approved`)
    .then((res) => {
      null;
    })
    .catch((err) => {
      console.log(err);
    });
};

// Action to delete the user account
export const deleteAccount = (userId) => async (dispatch, getState) => {
  try {
    // Get the token configuration
    const tokenConfig = await tokenAConfig(getState);
    // Make the delete request using the authenticated token
    const res = await axios.delete(
      `${proxy}/api/users/delete/${userId}`,
      tokenConfig
    );

    console.log(res.data.message);

    // Dispatch the success action
    dispatch({
      type: ACCOUNT_SUCCESSFUL_DELETED,
      payload: res.data,
    });
    dispatch(resetProfileTeams());
  } catch (err) {
    console.log(err);

    /* Dispatch the failure action
    dispatch({
      type: ACCOUNT_DELETION_FAILED,
      payload: err.response.data, // You can adjust this payload based on your API response format
    });*/
  }
};

export const setNotificationData = (notification) => (dispatch) => {
  dispatch({ type: "SET_NOTIFICATION_DATA", payload: notification });
};

export const resetOpenedWithNotification = () => (dispatch) => {
  dispatch({ type: "RESET_NOTIFICATION_DATA" });
};

export const resetPasswordResetSuccess = () => (dispatch) => {
  dispatch({ type: "PASSWORD_RESET_SUCCESS_FLAG_RESETTED" });
};
