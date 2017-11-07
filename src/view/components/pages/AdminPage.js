/**
 * Created by 611218504 on 15/06/2017.
 */
import React, { Component } from 'react';
import RoleAwareComponent from '../RoleAwareComponent';
import socket from '../static/socket';
import NumbersCalled from '../NumbersCalled';
import * as styles from '../../../../css/pages/_admin.scss';

class AdminPage extends RoleAwareComponent {

    constructor(props) {
        super(props);
        this.state = {callNumSetSize: 4, gameStatus: "Stopped", message: ""};
    }

    componentDidMount(){
        socket.on('gameEnded', this.serverGameEnd);
        socket.on('getPTPMessage', this.sendMessage);
    }

    componentWillUnmount(){
        socket.off('gameEnded');
        socket.off('getPTPMessage');
    }

    startGame = () => {
        socket.emit('startNewGame');
        this.setState({
            gameStatus: "Started"
        });
    };
    endGame = () => {
        socket.emit('endGame');
        this.setState({
            gameStatus: "Stopped"
        });
    };
    openWindow = () => {
        socket.emit('openPurchasingWindow');
        this.setState({
            gameStatus: "WindowOpen"
        });
    };
    closeWindow = () => {
        socket.emit('closePurchasingWindow');
        this.setState({
            gameStatus: "GameReady"
        });
    };
    serverGameEnd = () => {
        this.setState({
            gameStatus: "Stopped"
        });
    };
    resetGame = () => {
        //socket.emit('endGame');
        socket.emit('resetGame');
        this.setState({
            gameStatus: "Stopped"
        });
    };

    callNewNum = () => {
        console.log("callSetOfNums:",1);
        socket.emit('callNewNumSet',1);
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
        //socket.emit('reRenderAllComponents');
    };
    callSetOfNums = () => {
        console.log("callSetOfNums:",this.state.callNumSetSize);
        socket.emit('callNewNumSet',this.state.callNumSetSize);
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
        //socket.emit('reRenderAllComponents');
    };

    resetNumbers = () => {
        console.log("resetNums");
        socket.emit('resetCalledNumbers');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    };

    resetLeaderboard_AllTime = () => {
        this.setState({
            global_winners: {"winners": []}
        });
        socket.emit('resetLeaderboard_AllTime');
    };

    sendMessage = () => {
        let message = {
            text : this.state.text
        };
        console.log("emmiting message: ", message);
        socket.emit('updateServerPTPMessage', message);
    };

    handleMessageSubmit = (e) => {
        e.preventDefault();
        this.sendMessage();
    };

    changeHandler = (e) => {
        this.setState({ text : e.target.value });
    };

    render() {
        return (
            <div style={styles} className="admin">
                <h3><font>Admin Page</font></h3>
                <span>
                    <div className="game-status">
                        <h3>Game: {this.state.gameStatus}!</h3>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-startgame" onClick={this.startGame}>
                            <h3>Start Game</h3>
                        </button>
                        <p></p>
                        <button type="button" className="btn btn-endgame" onClick={this.endGame}>
                            <h3>End Game</h3>
                        </button>
                        <p></p>
                        <button type="button" className="btn btn-startgame" onClick={this.openWindow}>
                            <h3>Open Purchasing window</h3>
                        </button>
                        <p></p>
                        <button type="button" className="btn btn-endgame" onClick={this.closeWindow}>
                            <h3>Close Purchasing window</h3>
                        </button>
                        <p></p>
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
                    <button type="button" className="btn btn-refresh" onClick={this.callNewNum}>
                        New Num
                    </button>
                    <p></p>

                    <font>Size of set of Nums to add:</font>
                    <input type="number" value={this.state.callNumSetSize} min="1" max="8" onChange={e => { this.setState({callNumSetSize: e.target.value}) }} />
                    <p></p>
                    <button type="button" className="btn btn-resetgame" onClick={this.callSetOfNums} disabled={this.state.gameStatus == "Stopped" }>
                        <h3>Call Set Of Nums</h3>
                    </button>
                    <p></p>
                    <span>
                        <button type="button" className="btn btn-resetalltime-leaders" onClick={this.resetLeaderboard_AllTime}>
                            Reset All Time Leaderboard
                        </button>
                    </span>
                </span>
                <h2>Set purchase ticket page message</h2>
                <form onSubmit={this.handleMessageSubmit}>
                    <input
                        onChange={this.changeHandler}
                        value={this.state.text} placeholder="Message"
                    />
                </form>
            </div>
        );
    }
}

export default AdminPage;
