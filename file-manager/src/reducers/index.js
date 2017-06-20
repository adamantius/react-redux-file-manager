import { combineReducers } from 'redux';
import files from './files';
import app from './app';

export default combineReducers({
  files,
  app
});
