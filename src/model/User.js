import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router';
import PurchaseTicketsPage from '../view/components/pages/PurchaseTicketsPage';
import ExpiredTicketsPage from '../view/components/pages/ExpiredTicketsPage';
import LeaderboardPage from '../view/components/pages/LeaderboardPage';
import ActiveTicketsPage from '../view/components/pages/ActiveTicketsPage';
import LoginPage from '../view/components/static/login/LoginPage';

class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    get getUsername() {
        return this.username;
    }

    get getPassword() {
        return this.password;
    }
}




/*generate will be moved to purchase component*/
/*Book will then be grabbed from mongodb*/

export default User;
