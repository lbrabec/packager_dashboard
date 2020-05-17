import React from 'react';
import ReactDOM from 'react-dom';
/*
import $ from 'jquery';
import Popper from 'popper.js';
*/

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import reducer from './reducers'

import 'bootstrap/dist/js/bootstrap.bundle.min';

import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';


const loggerMiddleware = createLogger();
const store = createStore(reducer, applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
