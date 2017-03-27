import React, { Component } from 'react'

class RoleAwareComponent extends Component {

    constructor(props) {
        super(props);
        this.authorize = [];
    }

    shouldBeVisible() {
        for(var userRole in authorize) {
            if (this.userType === userRole) {
                return true;
            }
        }
        return false;
    }
}

export default RoleAwareComponent;
