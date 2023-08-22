import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import organizationReducer from "./organizationReducer";
import teamReducer from "./teamReducer";
import eventReducer from "./eventReducer";

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  organization: organizationReducer,
  team: teamReducer,
  event: eventReducer,
});
