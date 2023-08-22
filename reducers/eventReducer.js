import {
  EVENT_CREATED,
  EVENT_UPDATED,
  EVENT_SELECTED,
  RESET_EVENT_SELECTED,
  EVENT_DELETED,
  RESET_EVENT_DELETED,
  RESET_EVENT_UPDATED,
  EVENT_LINK_UPDATED,
  EVENT_LIST_LOADED,
  LOADING_EVENTS,
  AMENITI_ADDED,
  AMENITI_REMOVED,
  EVENT_ATTENDING_LIST_LOADED,
  RESET_EVENT_IS_CREATED,
  FILTER_UPDATED,
  FILTER_RESETED,
} from "../actions/types";

const initialState = {
  date_time: "",
  competitor: "",
  ameniti: "",
  amenities: [String],
  event: "",
  event_list: "",
  isLoadingEvents: false,
  isCreated: false,
  isUpdated: false,
  isDeleted: false,
  isOpen: false,
  people_attending: "",
  filter: "",
  event_selected: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case EVENT_CREATED:
      return {
        ...state,
        isCreated: true,
        event_list: action.payload,
      };
    case EVENT_UPDATED:
      return {
        ...state,
        isUpdated: true,
        event_list: action.payload,
      };
    case EVENT_SELECTED:
      return {
        ...state,
        event_selected: action.payload,
      };
    case LOADING_EVENTS:
      return {
        ...state,
        isLoadingEvents: true,
      };
    case RESET_EVENT_SELECTED:
      return {
        ...state,
        event_selected: "",
      };
    case RESET_EVENT_UPDATED:
      return {
        ...state,
        isUpdated: false,
      };
    case RESET_EVENT_DELETED:
      return {
        ...state,
        isDeleted: false,
      };
    case EVENT_DELETED:
      return {
        ...state,
        isDeleted: true,
        event_list: action.payload,
      };
    case EVENT_LINK_UPDATED:
      return {
        ...state,
        event_list: action.payload.teams,
      };
    case EVENT_LIST_LOADED:
      return {
        ...state,
        isLoadingEvents: false,
        event_list: action.payload,
      };
    case AMENITI_ADDED:
      return {
        ...state,
        amenities: [...state.amenities, action.payload],
      };
    case AMENITI_REMOVED:
      return {
        ...state,
        amenities: action.payload,
      };
    case EVENT_ATTENDING_LIST_LOADED:
      return {
        ...state,
        people_attending: action.payload,
      };
    case RESET_EVENT_IS_CREATED:
      return {
        ...state,
        isCreated: false,
      };
    case FILTER_UPDATED:
      return {
        ...state,
        filter: action.payload || "",
      };
    case FILTER_RESETED:
      return {
        ...state,
        filter: "",
      };
    default:
      return state;
  }
}
