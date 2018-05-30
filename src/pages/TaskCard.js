import React from 'react';
import '../TaskCard.css';
import { Button, Glyphicon, Panel } from 'react-bootstrap';

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
      if (!this.props.completeMethod) {
        return (
            <div className="container">
                <p> <strong style={{ textDecoration: 'underline'}}>{this.props.fromUser}</strong> <strong>|{this.formatDate(this.props.date)}</strong>: {this.props.taskContent}</p>
            </div>
        );
      }
      else {
        return (
            <Panel className="container" bsStyle="warning" defaultExpanded>
            <Panel.Heading>
                <Panel.Title>
                {this.props.fromUser} | {this.formatDate(this.props.date)}
                <div style={{float: 'right'}}>
                    <Panel.Toggle style={{display: 'inline-block', textDecoration: 'none', color: '#8a6d3b'}}>_&nbsp;&nbsp;&nbsp;&nbsp;</Panel.Toggle>
                    <div onClick={this.props.completeMethod} style={{ display: 'inline-block', cursor: 'pointer'}}>✕</div>
                </div>
                </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
                <Panel.Body>
                {this.props.taskContent}
                </Panel.Body>
            </Panel.Collapse>
            </Panel>
        


        );
      }
  }
}
                // <div className="container">
                //     <div style={{ paddingLeft: '15px', float: 'left', paddingTop: '5px'}} >
                //         <div style={{ fontSize: '1em', fontWeight: 'bold' }}>{this.props.fromUser} |{this.formatDate(this.props.date)}</div>
                //     </div>
                //     <div onClick={this.props.completeMethod} style={{ paddingRight: '10px', float: 'right', fontSize: '1.5em', cursor: 'pointer' }}>
                //         ☑
                //     </div>
                //     <div style={{ display: 'block', clear: 'both', height: '1px', width: '100%', backgroundColor: 'black' }}>
                //     </div>
                //     <div style={{ display: 'block', clear: 'both', paddingTop: '20px'}} >
                //         {this.props.taskContent}
                //     </div>
                // </div>