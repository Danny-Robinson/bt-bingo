import React, { Component } from 'react';
import NavigationBar from '../static/NavigationBar';
import TicketBook from '../ticket/TicketBook';
import NumbersCalled from '../NumbersCalled';
import bingoTicketApi from '../../../fakeDB/bingoTicket';
const socket = io();

class ActiveTicketsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: []
        };

        this.setBook = this.setBook.bind(this);
    }

    setBook(newBook) {
        this.setState({
            book: newBook
        });
    }

    componentWillMount() {
        socket.emit('getTicket');  //Can be changed to get ticket by user, eliminates below for loop
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
            this.setBook(bingoTicketApi.provideBook());
            console.log("Dummy book");
        }
    }

    render()
    {
        return (
            <span>
                <NavigationBar />
                <div style={{display: 'flex'}}>
                    <span>
                        <TicketBook book={this.state.book}/>
                    </span>
                    <span>
                        <NumbersCalled/>
                    </span>
                </div>
            </span>
        );
    }
}
export default ActiveTicketsPage;
