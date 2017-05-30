/**
 * Created by 611218504 on 05/04/2017.
 */
import React, { Component } from 'react';

class LeaderScore extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="leaderInfo">
                <strong>{this.props.user}: </strong>
                <span>{this.props.score}</span>
            </div>
        );
    }
}

export default LeaderScore;