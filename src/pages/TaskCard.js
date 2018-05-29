import React from 'react';
import '../TaskCard.css';

export class TaskCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    formatDate(date) {
        return new Date(date).toString().slice(3, 10);
    }

  render() {
    return (
        <div className="container">
            <p> <strong style={{ textDecoration: 'underline'}}>{this.props.fromUser}</strong> <strong> on {this.formatDate(this.props.date)}:</strong> {this.props.taskContent}</p>
            <p><strong>Complete:</strong> {this.props.isComplete}</p>
        </div>
    );
  }
}
