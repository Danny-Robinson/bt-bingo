import React from 'react';
import LoginPage from '../static/login/LoginPage';
import LoginFormError from '../static/login/LoginFormError';
import RoleAwareComponent from '../RoleAwareComponent';
import socket from '../static/socket';

class LogoutPage extends RoleAwareComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let userSession = JSON.parse(localStorage.getItem('userSession'));
        if(userSession == null){
            console.log("User already logged out.");
            return;
        }
        socket.emit('removeUserSession', userSession["sessionID"]);
        socket.on('removedUserSession', function() {
        }.bind(this));
        localStorage.clear();
    }

    componentWillUnmount(){
        socket.off('removedUserSession');
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
