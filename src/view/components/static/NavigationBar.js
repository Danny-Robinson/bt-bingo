import styles from '../../../../css/static/_navigationBar.scss';
import {Link} from 'react-router';
import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PurchaseTicketsPage from '../pages/PurchaseTicketsPage';
import socket from '../static/socket';


class NavigationBar extends Component {


    constructor() {
        super();

        this.state = {
            open: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({open: true});
    }

    closeModal() {
        this.setState({open: false});
        let userSession = JSON.parse(localStorage.getItem('userSession'));
        if(userSession == null){
            console.log("User has no session, please log in.");
            alert("User has no session, please log in.");
            window.location="/";
            return;
        }
        let user = userSession["sessionID"];
        socket.emit('getUserTickets', user);
    }




    render() {
        return (
            <nav>
                <ul>
                    <li >
                        <Link to="/activeTickets" activeClassName="active">Home</Link>
                    </li>
                    <li>
                        <button onClick={this.openModal}>Purchase Tickets</button>
                        <Modal open={this.state.open} onClose={this.closeModal} little>
                            <PurchaseTicketsPage/>
                        </Modal>
                    </li>
                    {/*<li>*/}
                    {/*<Link to="/expiredTickets" activeClassName="active">Expired Tickets</Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                        {/*<Link to="/leaderboard" activeClassName="active">Leaderboard</Link>*/}
                    {/*</li>*/}
                    <li>
                        <a href="/logout">Logout</a>
                    </li>
                </ul>
            </nav>
        );
    };
}

export default NavigationBar;