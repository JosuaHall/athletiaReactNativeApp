import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import AppMain from "./AppMain";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  useEffect(() => {
    // Load the event filter from AsyncStorage
    const loadEventFilter = async () => {
      try {
        const filterData = await AsyncStorage.getItem("eventFilter");
        if (filterData) {
          const filter = JSON.parse(filterData);
          store.dispatch({ type: "FILTER_UPDATED", payload: filter });
        } else {
          store.dispatch({ type: "FILTER_UPDATED" }); // Set the event filter to empty if it doesn't exist
        }
      } catch (error) {
        console.log("Error loading event filter from AsyncStorage:", error);
      }
    };

    loadEventFilter();
  }, []);

  return (
    <Provider store={store}>
      <AppMain />
    </Provider>
  );
};

export default App;
