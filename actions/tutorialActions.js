import { START_TUTORIAL, COMPLETE_TUTORIAL, NEXT_TUTORIAL_STEP } from "./types";

export const startTutorial = () => (dispatch) => {
  console.log("start");
  dispatch({ type: START_TUTORIAL });
};

export const completeTutorial = () => (dispatch) => {
  dispatch({ type: COMPLETE_TUTORIAL });
};

export const nextTutorialStep = () => (dispatch) => {
  dispatch({ type: NEXT_TUTORIAL_STEP });
};
