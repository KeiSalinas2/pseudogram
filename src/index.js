import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import config from '../config/config'
import App from './App';
import './index.css';

console.log(config);

firebase.initializeApp({
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
