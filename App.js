import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import AppMain from "./AppMain";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  useEffect(() => {
    loadEventFilter();
  }, []);

  const loadEventFilter = async () => {
    // Load the event filter from AsyncStorage
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

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppMain />
      </View>
    </Provider>
  );
};

export default App;
