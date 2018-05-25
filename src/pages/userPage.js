import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';

export default class UsersPage extends React.Component {

  constructor(props){
    super(props);
    let logged = false;
    if (userStore.authed){
      logged = true;
    }
    this.state = {
      loggedIn: logged,
      users: {}
    };
    userStore.registerCallback(this.update.bind(this));
  }

  logout(){
    firebase.auth().signOut();
  }

  update(){
    this.setState({users: userStore.users, loggedIn: userStore.authed});
  }

  render() {

    return (
      <div>
          {this.state.loggedIn &&
            <div>
              <h2>Welcome {userStore.displayName}</h2>
              <h3 onClick={this.logout}>Click Here To Logout</h3>
            </div>
          }
          {!this.state.loggedIn &&
            <a href="/login">Click to login</a>}
          <ul>
          {Object.keys(this.state.users).map(uid=>{
            return (
              <li key={uid}><a href={`/user/${uid}`}>{this.state.users[uid].name}</a></li>
            );
            })
          }
          </ul>
      </div>
    );
  }
}
