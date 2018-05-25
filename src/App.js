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
      'currentUser': '',
      'users':{}
    };
    firebase.database().ref(`users`).on('value', snapshot => {
            this.setState({
                users: snapshot.val()
            });
            userStore.setUsers(snapshot.val());
        });
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
              this.setState({...this.state, currentUser: user.displayName});
              console.log('testing');
              if (!!this.state.users && !this.state.users.hasOwnProperty(user.uid)){
                  console.log('setting new user');
                  let newRef = firebase.database().ref(`users`).child(user.uid);
                  newRef.set({name: user.displayName, email: user.email, photo: user.photoURL});
              }
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
          <Route path='/user/:uid' component={UserQueue} users={this.state.users}/>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
