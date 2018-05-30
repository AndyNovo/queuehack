import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';
import { TaskCard } from './TaskCard.js';
import logo from '../logo.png';
import '../App.css';
import { Tab, Tabs, Button } from 'react-bootstrap';

export default class UserQueue extends React.Component {

  constructor(props){
    super(props);
    userStore.registerCallback(this.update.bind(this));
    console.log(userStore.users);
    this.state = {
      uid: props.match.params.uid,
      user: {name: ''},
      tasks: [],
      showComplete: false
    };
    firebase.database().ref(`queues`).child(props.match.params.uid).child('tasks').on('value', snapshot => {
            let taskArray = [];
            let taskData = snapshot.val();
            console.log("tasks coming", taskData);
            if (!!taskData) {
                for (var key in taskData) {
                  console.log(key, taskData[key]);
                    if (taskData.hasOwnProperty(key)) {
                        taskData[key].key = key;
                        taskArray.push(taskData[key]);
                    }
                }
            }
            console.log(taskArray);
            taskArray.sort((a,b)=>{
              return a.timestamp > b.timestamp;
            });
            this.setState({
                tasks: taskArray
            });
        });
  }

  update(){
    this.setState({...this.state, user: userStore.users[this.state.uid]});
  }

  completeTask(task){
    if (userStore.uid == this.state.uid){
      console.log('completing');
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).child('isComplete').set(true);
    } else if (userStore.uid == task.fromuser.uid){
      console.log("deleting");
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).remove();
    } else {
      console.log('not authorized');
    }
  }

  unCompleteTask(task){
    if (userStore.uid == this.state.uid){
      console.log('uncompleting');
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).child('isComplete').set(false);
    } else if (userStore.uid == task.fromuser.uid){
      console.log("deleting");
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).remove();
    } else {
      console.log('not authorized');
    }
  }

  handleChange(){
    this.setState({showComplete: !this.state.showComplete});
  }

  pushTask(task){
    let taskObj = {
      fromuser: {
        name: userStore.displayName,
        uid: userStore.uid
      },
      isComplete: false,
      task,
      timestamp: Date.now()
    };
    let newRef = firebase.database().ref('queues').child(this.state.uid).child('tasks').push();
    newRef.set(taskObj).then(result=>{
      this.refs.newTask.value = '';
    });
  }

  handleKeyUp(evt){
    if (evt.key == "Enter"){
      console.log(this.refs.newTask.value);
      this.pushTask(this.refs.newTask.value);
    }
  }

  handleButtonClick() {
    this.pushTask(this.refs.newTask.value);
  }

  render() {

    return (
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <div className="App-title">{!!this.state.user && <span>{this.state.user.name}</span>}'s Tasks</div>
          </header>
          <div>
        {userStore.authed &&
        <div>
          <label style={{marginTop: '20px', fontSize: '1.25em'}}>
            <input style={{marginLeft: '10px', marginRight:'10px'}} type="text" onKeyUp={this.handleKeyUp.bind(this)} ref={'newTask'} placeholder={'Add task to queue...'}/>
            <Button onClick={this.handleButtonClick.bind(this)} style={{fontSize: '1em'}} bsStyle='success'>Submit</Button>
          </label>
        </div>}
        {!userStore.authed &&
        <div>Login to post tasks to this user</div>
        }
        <p>Hint: You can 'uncomplete' tasks by clicking the 'X' in the completed tab.</p>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Pending">
            {this.state.tasks.filter(task=>{
                return !task.isComplete;
            }).map(task=>{
              var icon;
              if (this.state.showComplete){
                if (userStore.uid == this.state.uid) {
                  icon = <span onClick={this.unCompleteTask.bind(this, task)}><strong>✓</strong></span>;
                }
              return (<li key={task.key}>
                <strong>{task.fromuser.name} ({new Date(task.timestamp).toLocaleString()}):</strong>
                &nbsp;<span className={'task-value'}>{task.task}</span>&nbsp;
                {icon}
                </li>)
            } else {
              if ((userStore.uid == this.state.uid) || (userStore.uid == task.fromuser.uid)) {
                return (
                  <TaskCard completeMethod={this.completeTask.bind(this, task)} fromUser={task.fromuser.name} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
              else {
                return (
                  <TaskCard completeMethod={false} fromUser={task.fromuser.name} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
            }})}
          </Tab>
          <Tab eventKey={2} title="Complete">
            {this.state.tasks.filter(task=>{
                return task.isComplete;
            }).map(task=>{
              var icon;
              if (this.state.showComplete){
                if (userStore.uid == this.state.uid) {
                  icon = <span onClick={this.unCompleteTask.bind(this, task)}><strong>✓</strong></span>;
                }
              return (
                <TaskCard completeMethod={this.unCompleteTask.bind(this, task)} fromUser={task.fromuser.name} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
              );
            } else {
              if ((userStore.uid == this.state.uid) || (userStore.uid == task.fromuser.uid)) {
                return (
                  <TaskCard completeMethod={this.unCompleteTask.bind(this, task)} fromUser={task.fromuser.name} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
              else {
                return (
                  <TaskCard completeMethod={false} fromUser={task.fromuser.name} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
            }})}
          </Tab>
        </Tabs>
        <br></br>
      </div>
      </div>
    );
  }
}
