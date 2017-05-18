import React, { Component } from 'react';

class BingoButton extends Component {
    constructor(props) {
        super(props);
        this.checkForBingo = this.checkForBingo.bind(this);
    }
    componentDidMount() {
        const { socket } = this.props;
        socket.on('deliverBingo', function (bingo) {
            if (bingo){
                alert("Bingo! You win")
            } else {
                alert("No Dice")
            }
        }.bind(this));
    }

    checkForBingo() {
        const { socket } = this.props;
        let userSessionId = JSON.parse(localStorage.getItem('userSession')).sessionID;
        socket.emit('getBingo', userSessionId);
        //socket.emit('simulateBingoWin_AllTime', userSessionId);
    }

    render() {
        return (
            <div id="bingo-button">
                <button type="button" className="btn btn-secondary" onClick={this.checkForBingo}>
                    <h3>Bingo!</h3>
                </button>
            </div>
        );
    }
}

export default BingoButton;
