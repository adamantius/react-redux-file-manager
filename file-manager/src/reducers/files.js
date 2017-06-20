import { List, fromJS } from "immutable";

import {
  RECEIVE_FILES_LIST_ERROR,
  RECEIVE_FILES_LIST_SUCCESS,
  RECEIVE_FILES_LIST,
  REQUEST_FILES_LIST,
  UPDATE_FILE,
  UPDATE_FILE_SUCCESS,
  UPDATE_FILE_ERROR,
  CREATE_FOLDER,
  CREATE_FOLDER_SUCCESS,
  CREATE_FOLDER_ERROR,
  REMOVE_FILE,
  REMOVE_FILE_ERROR,
  REMOVE_FILE_SUCCESS
} from '../actions/files'

const initialState = [
    {loading: false, filesData: {}}
];

export default function files(state = initialState, action) {
  let filesObj,newState;
  switch (action.type) {
    
    case REQUEST_FILES_LIST :
      
      filesObj = Object.assign({}, state[action.panelIndex]);
      filesObj.loading = true;
      newState =  Object.assign([], state);
      newState[action.panelIndex] = filesObj;
      return newState;
    
    case RECEIVE_FILES_LIST_SUCCESS :
      filesObj = Object.assign({}, state[action.panelIndex]);
      filesObj.loading = false;
      filesObj.filesData = action.data;
      newState =  Object.assign([], state);
      newState[action.panelIndex] = filesObj;
      return newState.slice(0, action.panelIndex+1);
      
    case RECEIVE_FILES_LIST_ERROR :
      return state;
  
    case UPDATE_FILE :
      newState =  Object.assign([], state);
      return newState;
    
    case UPDATE_FILE_SUCCESS :
      newState =  Object.assign([], state);
      return newState;
  
    case UPDATE_FILE_ERROR :
      newState =  Object.assign([], state);
      return newState;
  
    case CREATE_FOLDER :
      return state;
  
    case CREATE_FOLDER_SUCCESS :
      return state;
  
    case CREATE_FOLDER_ERROR :
      return state;
  
    case REMOVE_FILE :
      return state;
  
    case REMOVE_FILE_SUCCESS :
      return state;
  
    case REMOVE_FILE_ERROR :
      return state;
  }
  return state;
}

