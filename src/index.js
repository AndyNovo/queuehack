import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyADnkDg5BCJBDn8VtUrZgnLWYd6pNYlRSU",
  authDomain: "quickstore-604bb.firebaseapp.com",
  databaseURL: "https://quickstore-604bb.firebaseio.com",
  projectId: "quickstore-604bb",
  storageBucket: "quickstore-604bb.appspot.com",
  messagingSenderId: "362400339420"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
