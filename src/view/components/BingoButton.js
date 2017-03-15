import React, { Component } from 'react';

class BingoButton extends Component {
    constructor(props) {
        super(props);
        this.checkForBingo = this.checkForBingo.bind(this);
    }
    componentDidMount() {
        const { socket } = this.props;
        socket.on('deliverBingo', function (bingo) {
            console.log(bingo)
        }.bind(this));
    }

    checkForBingo() {
        const { socket } = this.props;
        let user = {user: "Danny"} ;
        socket.emit('getBingo', user);
    }

    render() {
        return (
            <button type="button" className="btn btn-secondary" onClick={this.checkForBingo}>
                Bingo!
            </button>
        );
    }
}

export default BingoButton;
