import React from 'react';
import styles from '../../../../css/static/navigationBar.css';
import {Link} from 'react-router';

const NavigationBar = () => (

//<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
//  <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//    <span className="navbar-toggler-icon"></span>
//  </button>
//  <a className="navbar-brand" href="#">Navbar</a>
//
//  <div className="collapse navbar-collapse" id="navbarSupportedContent">
//    <ul className="navbar-nav mr-auto">
//      <li className="nav-item active">
//        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
//      </li>
//      <li className="nav-item">
//        <a className="nav-link" href="#">Link</a>
//      </li>
//      <li className="nav-item">
//        <a className="nav-link disabled" href="#">Disabled</a>
//      </li>
//    </ul>
//    <form className="form-inline my-2 my-lg-0">
//      <input className="form-control mr-sm-2" type="text" placeholder="Search"/>
//      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
//    </form>
//  </div>
//</nav>

    <nav>
       <ul>
            <li >
                <Link to="/" activeClassName="active">Active tickets</Link>
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