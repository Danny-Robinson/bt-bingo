import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import TicketBook from '../ticket/TicketBook';
import NumbersCalled from '../NumbersCalled';
import BingoButton from '../BingoButton';
import DabChanger from '../DabChanger';
import bingoTicket from '../../../../fakeDB/bingoTicket';
import RoleAwareComponent from '../RoleAwareComponent';
import Chat from '../chat/Chat';
import WinnersLeaderboard from '../leaderboards/AllTimeLeaderboard';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
import LoginPage from '../static/login/LoginPage';
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
//        super.retrieveUserType();
//        console.log("fuckreerrr"+this.userType);
        socket.emit('getAllTickets');  //Can be changed to get ticket by user, eliminates below for loop
        socket.on('deliverTicket', function (book) {
            book = JSON.parse(book);
            for (let i=0; i<book.length; i++)
                for (let name in book[i]) {
                    if (name == "611176835"){ //if name == user
                        this.setBook(JSON.parse(book[i][name]));
                    }
                }
         }.bind(this));
    }

    render() {
       // var lll = super.shouldBeVisible();
        return (
            <span>
                <NavigationBar />
                <div className="pageContent">
                    <span id="ticket_container" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <TicketBook book={this.state.book} cursor={this.state.cursor} colour={this.state.colour}/>
                    </span>
                    <span id="leaderboard_AllTime" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <WinnersLeaderboard socket={socket} />
                    </span>
                    <span id="leaderboard_RealTime" style={{cursor: `url(${this.state.cursor}) 5 70,pointer` }}>
                        <RealTimeLeaderboard socket={socket} />
                    </span>
                    <span>
                        <div id="numbersCalled">
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

    }
}
export default ActiveTicketsPage;
