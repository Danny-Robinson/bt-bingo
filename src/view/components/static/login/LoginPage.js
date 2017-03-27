import React, { Component } from 'react';
import $ from 'jquery';
import LoginForm from './LoginForm';
import LoginFormError from './LoginFormError';
import User from '../../../../model/User';
import cookie from "react-cookie";

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
        $.ajax({
            url: '/activeTickets',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(userEntity),
            contentType: 'application/json',
            success: function(data) {
                //start the session
                let session = LoginPage.getLoginState();
                session.isLoggedIn = true;
                session.group = 'user';
                session.sessionID = data;
                localStorage.setItem('sessionID', JSON.stringify(session));
                window.location="/activeTickets";
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
            isLoggedIn: false,
            group: '',
            sessionID: ''
        };
    }


    /**
    * Renders the login page component.
    **/
    render()
    {
        var errorList = '';

        if (this.state.formErrors.length !== 0) {

            errorList = this.state.formErrors.map(function(item) {
                return (
                    <LoginFormError errorMsg={item} />
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
