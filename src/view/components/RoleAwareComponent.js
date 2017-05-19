import React, { Component } from 'react'
import socket from './static/socket';


class RoleAwareComponent extends Component {

    constructor(props) {
        super(props);
        this.authorize = [];
        this.userType = "";
    }

    shouldBeVisible() {
        console.log("parentre" + JSON.stringify(this.userType));

        for(var userRole in this.authorize) {
            if (this.userType === userRole) {
                return true;
            }
        }
        return false;
    }


    retrieveUserType() {
        var userSession = JSON.parse(localStorage.getItem('userSession'));
        socket.emit('retrieveUserType', userSession["sessionID"]);
        socket.on('retrievedUserType', function (userType) {
            this.userType = userType;
        }).bind(this);
    }
}

export default RoleAwareComponent;
