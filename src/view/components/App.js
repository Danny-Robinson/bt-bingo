import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import PurchaseTicketsPage from './pages/PurchaseTicketsPage';
import ExpiredTicketsPage from './pages/ExpiredTicketsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Chat from './chat/Chat';
import ActiveTicketsPage from './pages/ActiveTicketsPage';
import LoginPage from './static/login/LoginPage';

class App extends Component {

    constructor(props) {
        super(props);

    }


    render() {
            return (
                <Router history={browserHistory}>
                    <Route path='/' component={LoginPage}/>
                    <Route path='/activeTickets' component={ActiveTicketsPage} authorize={['user']}/>
                    <Route path='/purchaseTickets' component={PurchaseTicketsPage} authorize={['admin']}/>
                    <Route path='/expiredTickets' component={ExpiredTicketsPage} authorize={['user']}/>
                    <Route path='/leaderboard' component={LeaderboardPage} authorize={['user']}/>
                </Router>
            );
    }
}

export default App;
