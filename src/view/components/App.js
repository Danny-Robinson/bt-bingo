import React, { Component } from 'react'
import TicketBook from './TicketBook';
import bingoTicketApi from '../../fakeDB/bingoTicket';
import NavigationBar from './static/NavigationBar';
import { Router, Route, browserHistory } from 'react-router'
import PurchaseTicketsPage from './PurchaseTicketsPage';
import ExpiredTicketsPage from './ExpiredTicketsPage';
import LeaderboardPage from './LeaderboardPage';

class App extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path='/' component={Home}/>
                <Route path='/purchaseTickets' component={PurchaseTicketsPage}/>
                <Route path='/expiredTickets' component={ExpiredTicketsPage}/>
                <Route path='/leaderboard' component={LeaderboardPage}/>
            </Router>
        )
    }
}

const Home = ({ text }) => (
  <span>
      <NavigationBar />
      <TicketBook book={bingoTicketApi.provideBook()} />
  </span>
);

/*generate will be moved to purchase component*/
/*Book will then be grabbed from mongodb*/

export default App;
