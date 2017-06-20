import {
  MOVE_TO_TOP_LEVEL,
  SELECT_FILE,
  SELECT_PANEL_FILE
} from '../actions/app'

import {
  RECEIVE_FILES_LIST_SUCCESS,
  UPDATE_FILE
} from "../actions/files"


const initialState = {
  selectedFile: null,
  startPanelsIndex: 0,
  selectedPanelFile:[],
  savingComponents: [],
  activePanel: null
};

export default function app(state = initialState, action) {
  let startPanelsIndex;
  switch (action.type) {
    
    case MOVE_TO_TOP_LEVEL :
      startPanelsIndex = state.startPanelsIndex - 1;
      return Object.assign({}, state, {
        startPanelsIndex: startPanelsIndex
      });
      
    case RECEIVE_FILES_LIST_SUCCESS :
      
      if (action.panelIndex === state.startPanelsIndex + 3) {
        startPanelsIndex = state.startPanelsIndex + 1;
      } else {
        startPanelsIndex = state.startPanelsIndex;
      }
      return Object.assign({}, state, {
        startPanelsIndex: startPanelsIndex
      });
  
    case SELECT_PANEL_FILE :
      let selectedPanelFile = Object.assign([], state.selectedPanelFile);
      selectedPanelFile[action.panelIndex] = action.selectedFile;
      return Object.assign({}, state, {
        selectedPanelFile: selectedPanelFile,
        activePanel: action.panelIndex
      });
    
  }
  return state
}
