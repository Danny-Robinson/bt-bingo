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
        this.state = {number: 1, user: "test4Ticks"};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.authorize = ['admin'];
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

    render()
    {
        return (
            <span>
                <NavigationBar/>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Purchase a ticket</legend>
                        <label>
                            Name:
                            <input type="number" value={this.state.number} min="1" max="6" onChange={e => { this.setState({number: e.target.value}) }} />
                        </label>
                        <input type="submit" value="Purchase" />
                    </fieldset>
                </form>
            </span>
        );
    }
}
export default PurchaseTicketsPage;
