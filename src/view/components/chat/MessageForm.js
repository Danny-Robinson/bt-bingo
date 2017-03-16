import React, { Component } from 'react';

class MessageForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    handleSubmit(e) {
        const { onMessageSubmit, user} = this.props;
        e.preventDefault();
        let message = {
            user : user,
            text : this.state.text
        };
        onMessageSubmit(message);
        this.setState({ text: '' });
    }

    changeHandler(e) {
        this.setState({ text : e.target.value });
    }

    render() {
        return(
            <div className='message_form'>
                <h3>Write New Message</h3>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.changeHandler}
                        value={this.state.text}
                    />
                </form>
            </div>
        );
    }
};

export default MessageForm;