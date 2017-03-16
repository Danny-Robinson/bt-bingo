import React, {Component} from 'react';

class UsersList extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { users } = this.props;
        return (
            <div className='users'>
                <h3> Online Users </h3>
                <ul>
                    {
                        users.map((user, i) => {
                            return (
                                <li key={i}>
                                    {user}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default UsersList;