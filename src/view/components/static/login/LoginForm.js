import React, { Component } from 'react';
import App from '../../App';
import styles from '../../../../../css/static/login.css'


const LoginForm = ( {handleLoginClick} ) => (
    <form id="loginForm" method="post">
        <div className="row">
            <input id="username" className="username" name="username" type="text" placeholder="User EIN" required/>
        </div>
        <div className="row">
            <input id="password" className="password" name="password" type="password" placeholder="Password" required/>
        </div>
        <div className="row">
            <button onClick={handleLoginClick} className="loginButton" type="button"><p className="">Login</p></button>
        </div>
    </form>

);


export default LoginForm;