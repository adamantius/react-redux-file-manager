import fetch from 'isomorphic-fetch'
import {API_URL} from "../config";

export const REQUEST_FILES_LIST = 'REQUEST_FILES_LIST';
export const RECEIVE_FILES_LIST_ERROR = 'RECEIVE_FILES_LIST_ERROR';
export const RECEIVE_FILES_LIST_SUCCESS = 'RECEIVE_FILES_LIST_SUCCESS';

export const UPDATE_FILE = 'UPDATE_FILE';
export const UPDATE_FILE_ERROR = 'UPDATE_FILE_ERROR';
export const UPDATE_FILE_SUCCESS = 'UPDATE_FILE_SUCCESS';

export const CREATE_FOLDER = 'CREATE_FOLDER';
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS';
export const CREATE_FOLDER_ERROR = 'CREATE_FOLDER_ERROR';

export const REMOVE_FILE = 'REMOVE_FILE';
export const REMOVE_FILE_SUCCESS = 'REMOVE_FILE_SUCCESS';
export const REMOVE_FILE_ERROR = 'REMOVE_FILE_ERROR';




export function requestFilesList(panelIndex) {
  return {
    type: REQUEST_FILES_LIST,
    panelIndex: panelIndex,
    status: 'loading'
  };
}

function receiveFilesListSuccess(data, panelIndex) {
  return {
    type: RECEIVE_FILES_LIST_SUCCESS,
    data,
    panelIndex
  };
}

function receiveFilesListError(error, panelIndex) {
  return {
    type: RECEIVE_FILES_LIST_ERROR,
    error,
    panelIndex
  };
}

export function updateFile(panelIndex) {
  return {
    type: UPDATE_FILE,
    panelIndex: panelIndex,
    saving: true
  };
}

function updateFileError(error, panelIndex) {
  return {
    type: UPDATE_FILE_ERROR,
    error,
    panelIndex,
    saving: false
  };
}


export function createFolder(panelIndex, path) {
  return {
    type: CREATE_FOLDER,
    panelIndex: panelIndex,
    path: path
  };
}

function createFolderError(error, panelIndex) {
  return {
    type: CREATE_FOLDER_ERROR,
    error,
    panelIndex
  };
}

export function removeFile(panelIndex, path) {
  return {
    type: CREATE_FOLDER,
    panelIndex: panelIndex,
    path: path
  };
}

function removeFileError(error, panelIndex) {
  return {
    type: CREATE_FOLDER_ERROR,
    error,
    panelIndex
  };
}


export function recieveFilesList(path, panelIndex) {
  return function (dispatch) {
    dispatch(requestFilesList(panelIndex));
    fetch(API_URL + path)
    .then(response => response.json())
    .then(data => dispatch(receiveFilesListSuccess(data, panelIndex)))
    .catch(error => dispatch(receiveFilesListError(error, panelIndex)));
  };
}

export function updateFileRequest(path, newFileName, panelIndex, onSuccess, onError) {
  return function (dispatch) {
    dispatch(updateFile(panelIndex));
    fetch(API_URL + path, {
      method: 'POST',
      body: JSON.stringify({action: 'update',fileName:newFileName})
    })
    .then(response => response.json())
    .then(
      data => dispatch(receiveFilesListSuccess(data, panelIndex)),
      error => dispatch(updateFileError(error, panelIndex))
    ).then(
      () => onSuccess(),
      () => onError()
    );
  };
}

export function createFolderRequest(path, panelIndex) {
  return function (dispatch) {
    dispatch(createFolder(panelIndex, path));
    dispatch(requestFilesList(panelIndex));
    fetch(API_URL + path, {
      method: 'POST',
      body: JSON.stringify({action: 'create'})
    })
    .then(response => response.json())
    .then(
      data => dispatch(receiveFilesListSuccess(data, panelIndex)),
      error => dispatch(createFolderError(error, panelIndex))
    );
  };
}

export function removeFileRequest(path, panelIndex) {
  return function (dispatch) {
    dispatch(removeFile(panelIndex, path));
    dispatch(requestFilesList(panelIndex));
    fetch(API_URL + path, {
      method: 'POST',
      body: JSON.stringify({action: 'delete'})
    })
    .then(response => response.json())
    .then(
      data => dispatch(receiveFilesListSuccess(data, panelIndex)),
      error => dispatch(removeFileError(error, panelIndex))
    );
  };
}
