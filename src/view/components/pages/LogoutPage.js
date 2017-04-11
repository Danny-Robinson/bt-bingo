import React from 'react';
import NavigationBar from '../static/NavigationBar';
import LoginPage from '../static/login/LoginPage';
import LoginFormError from '../static/login/LoginFormError';
import RoleAwareComponent from '../RoleAwareComponent';

const socket = io();

class LogoutPage extends RoleAwareComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        var userSession = JSON.parse(localStorage.getItem('userSession'));
        socket.emit('removeUserSession', userSession["sessionID"]);
        socket.on('removedUserSession', function() {
        }.bind(this));
        localStorage.clear();
    }

    render() {
       const logoutMsg = 'You have been successfully logged out!';
       return (
           <span>
               <div id="logoutMessage">
                   <LoginFormError errorMsg={logoutMsg} />
               </div>
               <LoginPage />
           </span>
       );
    }
}

export default LogoutPage;
