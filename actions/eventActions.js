import {
  LOADING_EVENTS,
  EVENT_LIST_LOADED,
  EVENT_LINK_UPDATED,
  AMENITI_ADDED,
  AMENITI_REMOVED,
  ORGANIZATION_LOADED,
  EVENT_CREATED,
  EVENT_UPDATED,
  EVENT_DELETED,
  EVENT_ATTENDING_LIST_LOADED,
  ORGANIZATION_UPDATED,
  FILTER_UPDATED,
  FILTER_RESETED,
  EVENT_SELECTED,
} from "./types";
import axios from "axios";
import { proxy } from "../package.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createEvent =
  ({ orgid, teamid, date_time, competitor, home_away, link }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({
      teamid,
      date_time,
      competitor,
      home_away,
      link,
    });

    axios
      .put(
        `${proxy}/api/organizations/create/event/${orgid}/${teamid}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: EVENT_CREATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const updateEvent =
  (
    { date_time, home_away, link, event_location },
    amenities,
    { orgid, teamid, eventid }
  ) =>
  // orgid, teamid, eventid -> to find
  // data: date_time, home_away, amenities
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({
      date_time,
      home_away,
      link,
      amenities,
      event_location,
    });

    axios
      .put(
        `${proxy}/api/organizations/update/event/${orgid}/${teamid}/${eventid}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: EVENT_UPDATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteEvent =
  ({ orgid, teamid, eventid }) =>
  (dispatch) => {
    axios
      .put(
        `${proxy}/api/organizations/delete/event/${orgid}/${teamid}/${eventid}`
      )
      .then((res) => {
        dispatch({ type: EVENT_DELETED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const getEventList = (orgid, teamid) => (dispatch) => {
  dispatch({ type: LOADING_EVENTS });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ orgid, teamid });

  axios
    .get(
      `${proxy}/api/organizations/event/list/${orgid}/${teamid}`,
      body,
      config
    )
    .then((res) => {
      dispatch({ type: EVENT_LIST_LOADED, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateEventLiveStreamLink =
  ({ orgid, teamid, eventid }, link) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Request body
    const body = JSON.stringify({ link });
    axios
      .put(
        `${proxy}/api/organizations/update/event/stream/link/${orgid}/${teamid}/${eventid}`,
        body,
        config
      )
      .then((res) => {
        dispatch({ type: EVENT_LINK_UPDATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const addAmeniti = (item) => (dispatch) => {
  dispatch({ type: AMENITI_ADDED, payload: item });
};

export const removeAmeniti = (updated) => (dispatch) => {
  dispatch({ type: AMENITI_REMOVED, payload: updated });
};

export const setAttendingUsers = (attending_list) => (dispatch) => {
  dispatch({ type: EVENT_ATTENDING_LIST_LOADED, payload: attending_list });
};

export const setEventFilter = (filter) => (dispatch) => {
  dispatch({ type: FILTER_UPDATED, payload: filter });
};

export const setEventSelected = (event) => (dispatch) => {
  dispatch({ type: EVENT_SELECTED, payload: event });
};

export const resetEventFilter = () => (dispatch) => {
  dispatch({ type: FILTER_RESETED });
};

export const getEventAttendingUserList =
  (orgid, teamid, eventid) => (dispatch) => {
    // Headers
    axios
      .get(
        `${proxy}/api/organizations/event/attending/users/${orgid}/${teamid}/${eventid}`
      )
      .then((res) => {
        dispatch({ type: ORGANIZATION_UPDATED, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
