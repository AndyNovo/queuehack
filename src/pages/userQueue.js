import React from 'react';
import firebase from 'firebase';
import userStore from '../store/UserStore';

export default class UserQueue extends React.Component {

  constructor(props){
    super(props);
    userStore.registerCallback(this.update.bind(this));
    console.log(userStore.users);
    this.state = {
      uid: props.match.params.uid,
      user: {name: ''},
      tasks: []
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
      firebase.database().ref('queues').child(this.state.uid).child('tasks').child(task.key).child('isComplete').set(true);
    } else {
      console.log("not authorized");
    }
  }

  render() {

    return (
      <div>
        <h2>{!!this.state.user && <span>{this.state.user.name}</span>} Queue Here</h2>
        <ul>
          {this.state.tasks.map(task=>{
            return (<li key={task.key}>{JSON.stringify(task)} <span onClick={this.completeTask.bind(this, task)}>X</span></li>)
          })}
        </ul>
      </div>
    );
  }
}
