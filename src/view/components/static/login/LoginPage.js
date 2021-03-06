import React, { Component } from 'react';
import $ from 'jquery';
import LoginForm from './LoginForm';
import LoginFormError from './LoginFormError';
import User from '../../../../model/User';
import cookie from "react-cookie";
import styles from '../../../../../css/_app.scss'
import socket from '../socket';

class LoginPage extends Component {

    /**
    * The LoginPage component constructor.
    **/
    constructor(props) {
        super(props);
        this.state = {
           formErrors: []
        };
    }


    /**
    * Handles the user credentials.
    **/
    handleLogin() {
         var username = $('input[name=username]').val();
         var password = $('input[name=password]').val();
         var errors = [];

         if (username === ''){
            errors.push('The user EIN field cannot be empty');
         }

         if(password === '') {
            errors.push('The password field cannot be empty');
         }

         let userEntity = new User(username, password);

         if (errors.length === 0) {
            this.performLDAPRequest(userEntity);
         } else {
            this.setState({formErrors:errors});
         }
    }


    /**
    * Performs the LDAP request.
    **/
    performLDAPRequest(userEntity) {
        var errors = [];

        // /**
        //  * IF LDAP is not connected/ working, fake success:
        //  * @type {string}
        //  */
        // let data = "0ec922f8723edc16dd154ab4e5b36854ae481c5f9e3daf9bb0a1a153d55bbfc4";
        // let session = LoginPage.getLoginState();
        // session.sessionID = data;
        // //store the session
        // userEntity.setSessionId(data);
        // socket.emit('storeSession', JSON.stringify(userEntity));
        // socket.on('storedSession', function() {
        //     console.log('successfully stored session');
        //     localStorage.setItem('userSession', JSON.stringify(session));
        //     window.location="/activeTickets";
        // });
        // socket.on('newSessionBlocked', function() {
        //     console.log('New users blocked from connecting');
        //     alert('New users blocked from connecting');
        //     let error = "New users blocked from connecting";
        //     errors.push(error);
        //     socket.off('newSessionBlocked');
        // });

        $.ajax({
            url: '/activeTickets',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(userEntity),
            contentType: 'application/json',

            success: function(data) {
                //start the session
                let session = LoginPage.getLoginState();
                session.sessionID = data;
                //store the session
                userEntity.setSessionId(data);
                socket.emit('storeSession', JSON.stringify(userEntity));
                socket.on('storedSession', function() {
                    console.log('successfully stored session');
                    localStorage.setItem('userSession', JSON.stringify(session));
                    window.location="/activeTickets";
                });
                socket.on('newSessionBlocked', function() {
                    console.log('New users blocked from connecting');
                    alert('New users blocked from connecting');
                    let error = "New users blocked from connecting";
                    errors.push(error);
                    socket.off('newSessionBlocked');
                });
            }.bind(this),
            error: function(xhr, status, error) {
                if (error === 'Unauthorized') {
                    error = 'Invalid user credentials';
                }
                errors.push(error);
                this.setState({formErrors:errors});
            }.bind(this)
        })
    }


    /**
    * Gets the login state object.
    **/
    static getLoginState() {
        return {
            sessionID: ''
        };
    }

    componentWillUnmount(){
        socket.off('storedSession');
        socket.off('newSessionBlocked');
    }

    /**
    * Renders the login page component.
    **/
    render()
    {
        let errorList = '';

        if (this.state.formErrors.length !== 0) {

            errorList = this.state.formErrors.map(function(item, i) {
                return (
                    <LoginFormError key={i} errorMsg={item} />
                )});

        }
        return(
           <div className="loginForm">
               <LoginForm handleLoginClick={this.handleLogin.bind(this)}/>
               {errorList}
            </div>
        );
    }
}

export default LoginPage;
