/**
 * Created by 611218504 on 15/06/2017.
 */
import React, { Component } from 'react';
import RoleAwareComponent from '../RoleAwareComponent';
import socket from '../static/socket';
import NumbersCalled from '../NumbersCalled';
import styles from '../../../../css/pages/_admin.scss';

class AdminPage extends RoleAwareComponent {

    constructor(props) {
        super(props);
        this.state = {callNumSetSize: 8}
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

    callSetOfNums = () => {
        console.log("callSetOfNums");
        for(let x = 0; x < this.state.callNumSetSize; x++){
            this.callNewNum();
            //console.log("this.callNewNum()");
            //socket.emit('callNumSetSize', setSize);
        }
    };
    resetNumbers = () => {
        console.log("resetNums");
        socket.emit('resetCalledNumbers');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    };

    refreshNumbers = () => {
        console.log("refreshNums");
        socket.emit('callNewNum');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
        //socket.emit('reRenderAllComponents');
    };
    resetLeaderboard_AllTime = () => {
        this.setState({
            global_winners: {"winners": []}
        });
        socket.emit('resetLeaderboard_AllTime');
    }

    render() {
        return (
            <div className="admin">
                <h3><font color="white">Admin Page</font></h3>
                <span>
                    <div class="btn-group">
                        <button type="button" className="btn btn-startgame" onClick={this.startGame}>
                            <h3>Start Game</h3>
                        </button>
                        <button type="button" className="btn btn-resetgame" onClick={this.resetGame}>
                            <h3>ResetGame</h3>
                        </button>
                    </div>
                    <span id="numscalledComponent">
                        <NumbersCalled socket={socket}/>
                    </span>
                     <button type="button" className="btn btn-reset" onClick={this.resetNumbers}>
                        Reset
                    </button>
                    <button type="button" className="btn btn-refresh" onClick={this.refreshNumbers}>
                        New Num
                    </button>
                    <p></p>

                    <font color="white">Size of set of Nums to add:</font>
                    <input type="number" value={this.state.callNumSetSize} min="1" max="8" onChange={e => { this.setState({callNumSetSize: e.target.value}) }} />
                    <p></p>
                    <button type="button" className="btn btn-resetgame" onClick={this.callSetOfNums}>
                        <h3>Call Set Of Nums</h3>
                    </button>
                    <p></p>
                    <span>
                        <button type="button" className="btn btn-resetalltime-leaders" onClick={this.resetLeaderboard_AllTime}>
                            Reset All Time Leaderboard
                        </button>
                    </span>

                </span>
            </div>
        );
    }
}

export default AdminPage;
