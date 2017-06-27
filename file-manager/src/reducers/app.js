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
      }else if (action.panelIndex === 0) {
        startPanelsIndex = 0;
      } else {
        startPanelsIndex = state.startPanelsIndex;
      }
      return Object.assign({}, state, {
        startPanelsIndex: startPanelsIndex
      });
  
    case SELECT_PANEL_FILE :
      let selectedPanelFile = Object.assign([], state.selectedPanelFile);
      console.log(action.strategy);
      if (action.strategy === 'single') {
        selectedPanelFile[action.panelIndex] = [action.selectedFile];
      } else {
        let isElementExist = false;
        let selection = [];
        selectedPanelFile[action.panelIndex].reduce((accumulator, item) => {
            if (action.selectedFile !== item) {
              accumulator.push(item);
            } else {
              isElementExist = true;
            }
            return accumulator;
        }, selection);
        if (!isElementExist) {
          selection.push(action.selectedFile)
        }
        
        selectedPanelFile[action.panelIndex] = selection;
      }
      return Object.assign({}, state, {
        selectedPanelFile: selectedPanelFile,
        activePanel: action.panelIndex
      });
    
  }
  return state
}
