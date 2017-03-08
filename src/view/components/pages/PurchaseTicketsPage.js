import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
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

class PurchaseTicketsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        socket.emit('purchase', this.state.value);
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
                            <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Purchase" />
                    </fieldset>
                </form>
            </span>
        );
    }
}
export default PurchaseTicketsPage;
