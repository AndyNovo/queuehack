import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';

export default class UsersPage extends React.Component {

  render() {

    return (
      <div>
          <h2>Welcome {userStore.displayName}</h2>
          <a href="/login">Click to login</a>
      </div>
    );
  }
}
