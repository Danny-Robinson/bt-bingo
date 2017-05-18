import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import RoleAwareComponent from '../RoleAwareComponent';
const socket = io();

socket.on('connect',function() {
    console.log('Client has connected to the server!');
});
socket.on('message',function(data) {
    alert(data);
});
socket.on('disconnect',function() {
    console.log('The client has disconnected!');
});

class PurchaseTicketsPage extends RoleAwareComponent {
    constructor(props) {
        super(props);
        var userSession = JSON.parse(localStorage.getItem('userSession'));
        this.state = {number: 1, user: userSession["sessionID"]};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.authorize = ['user', 'admin'];
    }

    handleChange(event) {
        this.setState({number: event.target.number});
    }

    handleSubmit(event) {
        let data = {user: this.state.user, number: this.state.number};
        console.log(this.state.number);
        console.log(this.state.user);
        socket.emit('purchase', data);
        event.preventDefault();
    }

    handleSubmit2(event) {

    }

    render()
    {
        return (
            <div>
                <span>
                    <NavigationBar/>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend color="white">Purchase a ticket</legend>
                            <label>
                                Name:
                                <input type="number" value={this.state.number} min="1" max="6" onChange={e => { this.setState({number: e.target.value}) }} />
                            </label>
                            <input type="submit" value="Purchase" />
                        </fieldset>
                    </form>

                </span>
                <span>
                    <form onSubmit={this.handleSubmit2}>
                       <legend color="white">Amend tickets purchased</legend>

                    </form>
                </span>
            </div>
        );
    }
}
export default PurchaseTicketsPage;
