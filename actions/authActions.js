import axios from "axios";
import { returnErrors, clearErrors } from "./errorActions";
import { proxy } from "../package.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
} from "./types";
import { resetTeamReducer } from "./teamActions";
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
  ({ token }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${proxy}/api/users/validate/password/reset/link`, {
        params: { token },
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

    const body = JSON.stringify({ passwordResetToken, password });

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

export const followOrganization = (userid, orgid) => (dispatch) => {
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
    })
    .catch((err) => {
      console.log(err);
    });
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
