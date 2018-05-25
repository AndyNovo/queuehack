import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import userStore from '../store/UserStore';

export default class SignInPage extends React.Component {

  uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
  };

  render() {

    return (
        <div>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
    );
  }
}
