import UsersList from './UserList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ChangeNameForm from './ChangeNameForm';
import React, { Component } from 'react';
import styles from '../../../../css/static/_chat.scss';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            messages:[],
            text: ''
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this._initialize = this._initialize.bind(this);
        this._messageReceive = this._messageReceive.bind(this);
        this._userChangedName = this._userChangedName.bind(this);
        this._userJoined = this._userJoined.bind(this);
        this._userLeft = this._userLeft.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('init', this._initialize);
        socket.on('send:message', this._messageReceive);
        socket.on('change:name', this._userChangedName);
        socket.on('user:join', this._userJoined);
        socket.on('user:left', this._userLeft);
    }

    componentWillUnmount() {
        this.props.socket.off('init');
        this.props.socket.off('send:message');
        this.props.socket.off('change:name');
        this.props.socket.off('user:join');
        this.props.socket.off('user:left');
    }


    _initialize(data) {
        let {users, name} = data;
        this.setState({users, user: name});
    }

    _messageReceive(message) {
        let {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    }

    _userJoined(data) {
        let {users, messages} = this.state;
        let {name} = data;
        users.push(name);
        messages.push({
            user: 'ADMIN',
            text : name +' Joined'
        });
        this.setState({users, messages});
    }

    _userLeft(data) {
        let {users, messages} = this.state;
        let {name} = data;
        let index = users.indexOf(name);
        users.splice(index, 1);
        messages.push({
            user: 'ADMIN',
            text : name +' Left'
        });
        this.setState({users, messages});
    }

    _userChangedName(data) {
        let {oldName, newName} = data;
        let {users, messages} = this.state;
        let index = users.indexOf(oldName);
        users.splice(index, 1, newName);
        messages.push({
            user: 'ADMIN',
            text : 'Change Name : ' + oldName + ' ==> '+ newName
        });
        this.setState({users, messages});
    }

    handleMessageSubmit(message) {
        const { socket } = this.props;
        let {messages} = this.state;
        messages.push(message);
        this.setState({messages});
        socket.emit('send:message', message);
    }

    handleChangeName(newName) {
        const { socket } = this.props;
        let oldName = this.state.user;
        socket.emit('change:name', { name : newName}, (result) => {
            if(!result) {
                return alert('There was an error changing your name');
            }
            let {users} = this.state;
            let index = users.indexOf(oldName);
            users.splice(index, 1, newName);
            this.setState({users, user: newName});
        });
    }


    render() {
        return (
            <div id="chatContainer">
                <UsersList users={this.state.users}/>
                <MessageList messages={this.state.messages}/>
                <MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user} />
                <ChangeNameForm onChangeName={this.handleChangeName} />
            </div>
        );
    }
}

export default Chat;
