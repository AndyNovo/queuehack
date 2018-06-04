import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';
import { TaskCard } from './TaskCard.js';
import logo from '../logo.png';
import '../App.css';
import { Tab, Tabs, Button, Alert, Collapse, Tooltip, OverlayTrigger } from 'react-bootstrap';


export default class UserQueue extends React.Component {

  constructor(props){
    super(props);
    userStore.registerCallback(this.update.bind(this));
    console.log(userStore.users);
    this.state = {
      uid: props.match.params.uid,
      user: {name: ''},
      tasks: [],
      showComplete: false,
      buttonShow: true,
      open: false,
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

            // Order the list from earlier dates to later dates
            this.setState({tasks: this.state.tasks.sort(function(a, b) {
              return a.timestamp - b.timestamp;
            })})
        });
  }

  update(){
    this.setState({...this.state, user: userStore.users[this.state.uid]});
  }

  completeTask(task){
    if (userStore.uid === this.state.uid){
      console.log('completing');
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).child('isComplete').set(true);
    } else if (userStore.uid === task.fromuser.uid){
      console.log("deleting");
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).remove();
    } else {
      console.log('not authorized');
    }
  }

  unCompleteTask(task){
    if (userStore.uid === this.state.uid){
      console.log('uncompleting');
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).child('isComplete').set(false);
    } else if (userStore.uid === task.fromuser.uid){
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
    if (evt.key === "Enter") {
      if (this.refs.newTask.value === "") {

      }
      else {
        console.log(this.refs.newTask.value);
        this.pushTask(this.refs.newTask.value);
      }
    }
  }
  
  handleFirstClick() {
    this.setState({buttonShow: false});
  }

  handleSecondClick() {
    this.setState({buttonShow: true, open: true});
    var i;
    for (i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].isComplete) {
        firebase.database().ref('queues').child(this.state.uid).child('tasks').child(this.state.tasks[i].key).remove();
      }
    }
  }

  handleButtonClick() {
    if (this.refs.newTask.value === "") {

    }
    else {
      console.log(this.refs.newTask.value);
      this.pushTask(this.refs.newTask.value);
    }
  }
  
  renderClearButton() {
    if (this.state.uid === userStore.uid) {
      if (this.state.buttonShow) {
        return (
          <Button onClick={this.handleFirstClick.bind(this)} style={{marginLeft: '10px'}} bsStyle="danger">Clear completed tasks</Button>
        );
      }
      else {
        return (
          <Button onClick={this.handleSecondClick.bind(this)} style={{marginLeft: '10px'}} bsStyle="danger">Are you sure?</Button>
        );
      }
    }
  }

  render() {

    let completeArray = this.state.tasks.filter(task=>{
      return task.isComplete;
    }).reverse();

    return (
      <div className="App">
            <Collapse onEntered={() => setTimeout(() => this.setState({open: false}), 2000) } style={{position: 'absolute', width: '100%', marginTop: '1em', paddingRight: '1em'}} in={this.state.open}>
              <div>
                <Alert style={{marginBottom: 0, width: '30%', float: 'right'}} bsStyle="warning">
                  <strong>Completed tasks were cleared.</strong>
                </Alert>
              </div>
            </Collapse>
          <header className="App-header">
          <OverlayTrigger placement="right" overlay={
            <Tooltip id="tooltip">
              Go back to the members page.
            </Tooltip>}
          >
            <a href="/"><img src={logo} className="App-logo" alt="logo"/></a>
          </OverlayTrigger>
            <div className="App-title">{!!this.state.user && <span>{this.state.user.name}</span>}'s Tasks</div>
          </header>
          <div>
            {userStore.authed &&
            <div>
              <label style={{marginTop: '20px', fontSize: '1.25em'}}>
                <input style={{marginLeft: '10px', marginRight:'10px', paddingLeft: '10px'}} type="text" onKeyUp={this.handleKeyUp.bind(this)} ref={'newTask'} placeholder={'Add task to queue...'}/>
                <Button onClick={this.handleButtonClick.bind(this)} style={{fontSize: '1em'}} bsStyle='success'>Submit</Button>
                {this.renderClearButton()}
              </label>
            </div>}
        {!userStore.authed &&
        <div>Login to post tasks to this user</div>
        }
        <p>Hint: You can go back to the main page by clicking the golden egg.</p>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Pending">
            {this.state.tasks.filter(task=>{
                return !task.isComplete;
            }).map(task => {
              var icon;
              if (this.state.showComplete){
              return (<li key={task.key}>
                <strong>{task.fromuser.name} ({new Date(task.timestamp).toLocaleString()}):</strong>
                &nbsp;<span className={'task-value'}>{task.task}</span>&nbsp;
                {icon}
                </li>)
            } else {
              if ((userStore.uid === this.state.uid) || (userStore.uid === task.fromuser.uid)) {
                return (
                  <TaskCard completeMethod={this.completeTask.bind(this, task)} fromUser={task.fromuser} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
              else {
                return (
                  <TaskCard completeMethod={false} fromUser={task.fromuser} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
            }})}
          </Tab>
          
          <Tab eventKey={2} title="Complete">
            {completeArray.map(task=>{
              if (this.state.showComplete){
              return (
                <TaskCard completeMethod={this.unCompleteTask.bind(this, task)} fromUser={task.fromuser} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
              );
            } else {
              if ((userStore.uid === this.state.uid) || (userStore.uid === task.fromuser.uid)) {
                return (
                  <TaskCard completeMethod={this.unCompleteTask.bind(this, task)} fromUser={task.fromuser} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
                );
              }
              else {
                return (
                  <TaskCard completeMethod={false} fromUser={task.fromuser} date={task.timestamp} taskContent={task.task} isComplete={task.isComplete.toString()}/>
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
