import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';
import '../App.css';
import logo from '../logo.png';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


export default class UsersPage extends React.Component {

  constructor(props){
    super(props);
    let logged = false;
    if (userStore.authed){
      logged = true;
    }
    this.state = {
      loggedIn: logged,
      users: {},
      uid: userStore.uid,
    };
    userStore.registerCallback(this.update.bind(this));
  }

  uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

  logout(){
    firebase.auth().signOut();
  }

  update(){
    this.setState({users: userStore.users, loggedIn: userStore.authed});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a href="/"><img src={logo} className="App-logo" alt="logo" /></a>
          {this.state.loggedIn &&
              <div>
                <div className="App-title">Welcome {userStore.displayName}</div>
              </div>
            }
        </header>
        {!this.state.loggedIn && <div>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>}
        {this.state.loggedIn ? <div style={{marginTop: '1em', marginBottom: '1em'}}>
          <Button bsStyle="primary" style={{display: 'inline-block'}} href={"/user/" + userStore.uid}> Go to my queue</Button>
          <Button bsStyle="danger" style={{display: 'inline-block', margin: '1em'}} onClick={this.logout}>Logout</Button>
        </div> : <div></div>}
        <div style={{fontSize: '1.5em', fontWeight: 'bold'}}>Current Members:</div>
          <ListGroup style={{display: 'inline-block'}}>
          {Object.keys(this.state.users).map(uid => {
            return (
              <ListGroupItem bsStyle="info" style={{fontSize: '1.25em'}} key={uid} href={`/user/${uid}`}>{this.state.users[uid].name}</ListGroupItem>
            );
            })
          }
          </ListGroup>
      </div>
    );
  }
}
