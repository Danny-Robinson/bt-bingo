/**
 * Created by 611218504 on 15/06/2017.
 */
import React, { Component } from 'react';
import RoleAwareComponent from '../RoleAwareComponent';
import socket from '../static/socket';
import NumbersCalled from '../NumbersCalled';

class AdminPage extends RoleAwareComponent {

    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
    }

    startGame = () => {
        socket.emit('startNewGame');
    };

    resetGame = () => {
        socket.emit('resetGame');
    };

    callNewNum = () => {
        socket.emit('callNewNum');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    };


    render() {
        return (
            <div className="admin">
                <h3><font color="white">Admin Page</font></h3>
                <span>
                    <button type="button" className="btn btn-startgame" onClick={this.startGame}>
                        <h3>Start Game</h3>
                    </button>
                    <p></p>
                    <button type="button" className="btn btn-resetgame" onClick={this.resetGame}>
                        <h3>ResetGame</h3>
                    </button>
                    <p></p>
                    <NumbersCalled socket={socket}/>

                </span>
            </div>
        );
    }
}

export default AdminPage;
