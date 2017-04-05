import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import TicketBook from '../ticket/TicketBook';
import NumbersCalled from '../NumbersCalled';
import BingoButton from '../BingoButton';
import DabChanger from '../DabChanger';
import RoleAwareComponent from '../RoleAwareComponent'
import Chat from '../chat/Chat';
import styles from '../../../../css/pages/_activeTickets.scss';

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
                    if (name == "test4Ticks"){ //if name == user
                        this.setBook(JSON.parse(book[i][name]));
                    }
                }
         }.bind(this));
    }

    render() {
        let sessionObject = JSON.parse(localStorage.getItem('userSession'));

        if (sessionObject.isLoggedIn === true && this.authorize.indexOf(sessionObject.group) > -1) {
             return (
                 <span>
                     <NavigationBar />
                     <div className="pageContent">
                         <span style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                             <TicketBook book={this.state.book} cursor={this.state.cursor} colour={this.state.colour}/>
                         </span>
                         <span>
                         </span>
                         <span>
                             <div>
                                 <NumbersCalled socket={socket}/>
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
        } else {
            <ReactRedirect location='/'></ReactRedirect>
        }
    }
}
export default ActiveTicketsPage;
