import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import PurchaseTicketsPage from './pages/PurchaseTicketsPage';
import ExpiredTicketsPage from './pages/ExpiredTicketsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ActiveTicketsPage from './pages/ActiveTicketsPage';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    handleLoginClick() {
        // get username and password from text boxes
        let username, password = "something";
        
        let loginResult = checkLdapCredentials(username, password);

        if (loginResult.success) {
            this.setState({isLoggedIn: true});
        } else {
            // show some dialog or something
        }
    }

    checkLdapCredentials(username, password) {
        // use ldapjs to do some magical check for creds

        return {
            success: true
        }
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Router history={browserHistory}>
                    <Route path='/' component={ActiveTicketsPage}/>
                    <Route path='/activeTickets' component={ActiveTicketsPage}/>
                    <Route path='/purchaseTickets' component={PurchaseTicketsPage}/>
                    <Route path='/expiredTickets' component={ExpiredTicketsPage}/>
                    <Route path='/leaderboard' component={LeaderboardPage}/>
                </Router>
            );
        } else {
            return (
                // two text boxes and a button that runs handleLogin
            );
        }        
    }
}

/*generate will be moved to purchase component*/
/*Book will then be grabbed from mongodb*/

export default App;
