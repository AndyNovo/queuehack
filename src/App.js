import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import logo from './logo.svg';
import userStore from './store/UserStore';
import UsersPage from './pages/userPage';
import SignInPage from './pages/signInPage';
import UserQueue from './pages/userQueue';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      'currentUser': ''
    };
  }

  componentDidMount() {
      //console.log("App componentDidMount");
     firebase.auth().onAuthStateChanged((user) => {
          if (user) {
              userStore.login();
              let rando = Math.floor(Math.random()*100000);
              let old = window.localStorage.getItem('tempid');
              if (!old) {
                window.localStorage.setItem('tempid', rando);
              } else {
                rando = old;
              }
              userStore.setUserInfo(user.email || `demoUser${rando}@gmail.com`, user.displayName || `Demo User ${rando}`, user.photoURL || '', user.uid || `${rando}`);
              this.setState({currentUser: user.displayName});
          } else {
              userStore.logout();
          }
      })

  }

  render() {
    return (
      <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={UsersPage} user={this.state.currentUser}/>
          <Route path='/login' component={SignInPage}/>
          <Route path='/user/:uid' component={UserQueue}/>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
