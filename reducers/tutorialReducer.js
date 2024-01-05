// tutorialReducer.js
import {
  START_TUTORIAL,
  COMPLETE_TUTORIAL,
  NEXT_TUTORIAL_STEP,
} from "../actions/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  showTutorial: false,
  currentStep: 0,
};

const tutorialReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_TUTORIAL:
      return { ...state, showTutorial: true, currentStep: 0 };

    case COMPLETE_TUTORIAL:
      AsyncStorage.setItem("firstTimeUser", "true"); // Set firstTimeUser flag
      return { ...state, showTutorial: false, currentStep: 0 };

    case NEXT_TUTORIAL_STEP:
      return { ...state, currentStep: state.currentStep + 1 };

    default:
      return state;
  }
};

export default tutorialReducer;
