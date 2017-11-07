import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import RoleAwareComponent from '../RoleAwareComponent';
import socket from '../static/socket';

class PurchaseTicketsPage extends RoleAwareComponent {
    constructor(props) {
        super(props);
        let userSession = JSON.parse(localStorage.getItem('userSession'));
        this.state = {number: 1, user: userSession["sessionID"], message:""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.authorize = ['user', 'admin'];
    }

    componentDidMount(){
        socket.on('connect',function() {
            console.log('Client has connected to the server!');
        });
        socket.on('blockedTickets',function () {
            console.log('Game started, you cannot buy new tickets');
        });
        socket.on('message',function(data) {
            alert(data);
        });
        socket.on('disconnect',function() {
            console.log('The client has disconnected!');
        });
        socket.on('updatePTPMessage',function(data){
            console.log("setting state");
            this.setState({
                message: data.text
            });
        }.bind(this));
        socket.emit('getServerPTPMessage');
        console.log("PTP mounted");
    }

    componentWillUnmount(){
        socket.off('connect');
        socket.off('message');
        socket.off('disconnect');
        socket.off('updatePTPMessage');
        socket.off('getServerPTPMessage');
        console.log("PTP unmounted");
    }

    handleChange(event) {
        this.setState({number: event.target.number});
    }

    handleSubmit(event) {
        let data = {user: this.state.user, number: this.state.number};
        console.log("Purchase",this.state.number,"ticket(s) for:",this.state.user);
        socket.emit('purchase', data);
        event.preventDefault();
        socket.emit('getJackpot');
    }

    render()
    {
        return (
            <div style={{ color:'white'}}>
                <span>
                    <NavigationBar/>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend color="white">Purchase up to 6 tickets</legend>
                            <label>
                                Name:
                                <input type="number" value={this.state.number} min="1" max="6" onChange={e => { this.setState({number: e.target.value}) }} />
                            </label>
                            <input type="submit" value="Purchase" />
                        </fieldset>
                    </form>
                </span>
                <div>{this.state.message}</div>
            </div>
        );
    }
}
export default PurchaseTicketsPage;
