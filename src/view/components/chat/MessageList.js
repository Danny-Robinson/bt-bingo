import React, {Component} from 'react';
import Message from './Message';

class MessageList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { messages } = this.props;
        return (
            <div className='messages'>
                <h2> Conversation: </h2>
                {
                    messages.map((message, i) => {
                        return (
                            <Message
                                key={i}
                                user={message.user}
                                text={message.text}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default MessageList;