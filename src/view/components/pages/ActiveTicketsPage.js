import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import TicketBook from '../ticket/TicketBook';
import NumbersCalled from '../NumbersCalled';
import BingoButton from '../BingoButton';
import DabChanger from '../DabChanger';
import bingoTicket from '../../../fakeDB/bingoTicket';
import RoleAwareComponent from '../RoleAwareComponent'
import Chat from '../chat/Chat';
const socket = io();

class ActiveTicketsPage extends RoleAwareComponent {
    constructor(props) {
        super(props);
        this.state = {
            book: [],
            cursor: 'https://en.gravatar.com/userimage/75305515/3cd028414a041e4693cfd08120356375.png',
            colour: 'blue'
        };
        this.handleChange = this.handleChange.bind(this);
        this.authorize = ['user'];

        this.setBook = this.setBook.bind(this);
    }

    handleChange(url, colour) {
        this.setState({
            cursor: url,
            colour: colour
        });
    }

    setBook(newBook) {
        this.setState({
            book: newBook
        });
    }

    componentWillMount() {
        socket.emit('getAllTickets');  //Can be changed to get ticket by user, eliminates below for loop
        socket.on('deliverTicket', function (book) {
            book = JSON.parse(book);
            for (let i=0; i<book.length; i++)
                for (let name in book[i]) {
                    if (name == "Danny"){ //if name == user
                        this.setBook(JSON.parse(book[i][name]));
                    }
                }
         }.bind(this));
        if (this.state.book[0] == null){
            this.setBook(bingoTicket.provideBook());
            console.log("Dummy book");
        }
    }

    render()
    {
    var sessionObject = JSON.parse(localStorage.getItem('sessionID'));

       if (sessionObject.isLoggedIn === true && this.authorize.indexOf(sessionObject.group) > -1) {
            return (
                <span>
                    <NavigationBar />
                    <div style={{display: 'flex'}}>
                        <span style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                            <TicketBook book={this.state.book} cursor={this.state.cursor} colour={this.state.colour}/>
                        </span>
                        <span>
                        </span>
                        <span>
                            <div>
                                <NumbersCalled/>
                            </div>
                            <div>
                                <DabChanger changeCursor={this.handleChange} cursor={this.state.cursor}/>
                                <BingoButton socket={socket}/>
                                <Chat socket={socket} />
                            </div>
                        </span>
                    </div>
                </span>
            );
       }
    }
}
export default ActiveTicketsPage;
