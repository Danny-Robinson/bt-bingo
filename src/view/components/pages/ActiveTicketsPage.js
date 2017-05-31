import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import TicketBook from '../ticket/TicketBook';
import NumbersCalled from '../NumbersCalled';
import BingoButton from '../BingoButton';
import DabChanger from '../DabChanger';
import RoleAwareComponent from '../RoleAwareComponent';
import Chat from '../chat/Chat';
import AllTimeLeaderboard from '../leaderboards/AllTimeLeaderboard';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
import LoginPage from '../static/login/LoginPage';
import styles from '../../../../css/pages/_activeTickets.scss';
import socket from '../static/socket';


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
        this.userType = "";
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
        let userSession = JSON.parse(localStorage.getItem('userSession'));
        let user = userSession["sessionID"];
        socket.emit('getUserTickets', user);  //Can be changed to get ticket by user, eliminates below for loop
        socket.on('deliverTicket', function (book) {
            book = JSON.parse(book);
            console.log(book);
            this.setBook(JSON.parse(book));
         }.bind(this));
    }


    render() {
        return (
            <span>
                <NavigationBar />
                <div className="pageContent">
                    <span id="ticket_container" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <TicketBook book={this.state.book} cursor={this.state.cursor} colour={this.state.colour}/>
                    </span>
                    <span id="leaderboard_AllTime" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <AllTimeLeaderboard socket={socket} />
                    </span>
                    <span id="leaderboard_RealTime" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <RealTimeLeaderboard socket={socket} />
                    </span>
                    <span>

                        <NumbersCalled socket={socket}/>

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
export default ActiveTicketsPage;
