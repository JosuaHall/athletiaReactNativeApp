/*import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import AppMain from "./AppMain";

const App = () => {
  return (
    <Provider store={store}>
      <AppMain />
    </Provider>
  );
};

export default App;*/
import React, { useEffect } from "react";
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
