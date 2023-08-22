import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom middleware to persist the event filter and home organization selection to AsyncStorage
const persistDataMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Save the event filter to AsyncStorage whenever it changes
  if (action.type === "FILTER_UPDATED") {
    AsyncStorage.setItem(
      "eventFilter",
      JSON.stringify(state.event.filter)
    ).catch((error) => {
      console.log("Error saving event filter to AsyncStorage:", error);
    });
  }

  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, persistDataMiddleware],
});

export default store;
