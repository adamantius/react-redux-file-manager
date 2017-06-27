import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';
import logger from 'dev/logger';

import rootReducer from 'reducers';

import App from 'views/App';

import {INITIAL_DIRS} from "./config";

// Load SCSS
import '../styles/app.scss';
import css from 'react-select/dist/react-select.css';

import { changeBaseRoot, changePanelRoot } from './actions/app';
import { requestFilesList, recieveFilesList } from './actions/files';

const isProduction = process.env.NODE_ENV === 'production';

// Creating store
let store = null;

if (isProduction) {
  // In production adding only thunk middleware
  const middleware = applyMiddleware(thunk);

  store = createStore(
    rootReducer,
    middleware
  );
} else {
  // In development mode beside thunk
  // logger and DevTools are added
  const middleware = applyMiddleware(thunk, logger);
  let enhancer;

  // Enable DevTools if browser extension is installed
  if (window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-line
    enhancer = compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
    );
  } else {
    enhancer = compose(middleware);
  }

  store = createStore(
    rootReducer,
    enhancer
  );
}



store.dispatch(recieveFilesList(INITIAL_DIRS[0].value, 0));
// Stop listening to state updates
//unsubscribe()


// Render it to DOM
ReactDOM.render(
  <Provider store={ store }>
    <App baseRoots={ INITIAL_DIRS }/>
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();
