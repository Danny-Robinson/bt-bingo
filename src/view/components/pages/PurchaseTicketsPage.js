import React from 'react';
import NavigationBar from '../static/NavigationBar';
// import mongoApi from '../../../fakeDB/mongoApi';
const socket = io();
// Add a connect listener
socket.on('connect',function() {
    console.log('Client has connected to the server!');
});
// Add a connect listener
socket.on('message',function(data) {
    console.log('Received a message from the server!',data);
});
// Add a disconnect listener
socket.on('disconnect',function() {
    console.log('The client has disconnected!');
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
    socket.send(message);
};

function handleClick(e) {
    e.preventDefault();
    sendMessageToServer("test")
    console.log('The link was clicked.');
}

const PurchaseTicketsPage = () => (
    <span>
        <NavigationBar/>
        IM A PURCHASE TICKETS PAGE
        <button onClick={handleClick}>PURCHASE TICKET</button>
  </span>
);

export default PurchaseTicketsPage;
