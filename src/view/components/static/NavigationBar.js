import React from 'react';
import styles from '../../../../css/static/navigationBar.css';
import {Link} from 'react-router';

const NavigationBar = () => (

    <nav>
       <ul>
            <li >
                <Link to="/activeTickets" activeClassName="active">Active Tickets</Link>
            </li>
            <li>
                <Link to="/purchaseTickets" activeClassName="active">Purchase Tickets</Link>
            </li>
            <li>
                <Link to="/expiredTickets" activeClassName="active">Expired Tickets</Link>
            </li>
            <li>
                <Link to="/leaderboard" activeClassName="active">Leaderboard</Link>
            </li>
            <li>
                <a href="">Logout</a>
            </li>
        </ul>
    </nav>
);

export default NavigationBar;