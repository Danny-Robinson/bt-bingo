import React, { Component } from 'react';
import NavigationBar from './static/NavigationBar';
import TicketBook from './TicketBook';
import NumbersCalled from './NumbersCalled';
import bingoTicketApi from '../../fakeDB/bingoTicket';

class ActiveTicketsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: []
        };

        this.getNewBook = this.getNewBook.bind(this);
    }

    getNewBook() {
        this.setState({
            book: bingoTicketApi.provideBook()
        });
    }
    componentDidMount() {
        this.getNewBook();
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
