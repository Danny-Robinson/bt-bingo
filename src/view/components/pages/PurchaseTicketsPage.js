import React from 'react';
import NavigationBar from '../static/NavigationBar';
const socket = io();

socket.on('connect',function() {
    console.log('Client has connected to the server!');
});
socket.on('message',function(data) {
    console.log('Received a message from the server!',data);
});
socket.on('disconnect',function() {
    console.log('The client has disconnected!');
});

function sendMessageToServer(message) {
    socket.send(message);
}

function sendCustomToServer() {
    socket.emit('custom', { hello: 'world' });
}

function handleClick(e) {
    e.preventDefault();
    sendCustomToServer();
}

const PurchaseTicketsPage = () => (
    <span>
        <NavigationBar/>
        IM A PURCHASE TICKETS PAGE
        <button onClick={handleClick}>PURCHASE TICKET</button>
  </span>
);

export default PurchaseTicketsPage;
