import React from 'react';
import styles from '../../../../css/static/_navigationBar.scss';
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
            {/*<li>*/}
                {/*<Link to="/expiredTickets" activeClassName="active">Expired Tickets</Link>*/}
            {/*</li>*/}
            <li>
                <Link to="/leaderboard" activeClassName="active">Leaderboard</Link>
            </li>
            <li>
                <a href="/logout">Logout</a>
            </li>
        </ul>
    </nav>
);

export default NavigationBar;