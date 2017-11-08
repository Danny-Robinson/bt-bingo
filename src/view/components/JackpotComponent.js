/**
 * Created by 611218504 on 16/06/2017.
 */
import React, { Component } from 'react';


class JackpotComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jackpot: 0
        };
        this.gotJackpot = this.gotJackpot.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('gotJackpot',function(data) {
            this.setState({
                jackpot: data
            });
        }.bind(this));
        socket.emit('getJackpot');
        console.log("componentDidMount")
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            nextProps
        });
    }

    componentWillUnmount() {
        this.props.socket.off('gotJackpot');
    }

    gotJackpot(gameJackpot) {
        this.setState({
            jackpot: gameJackpot
        });
        console.log("gotjackpot:", this.state.jackpot);
    }

    render() {
        return (
            <div id="jackpot">
                <h3>Jackpot:</h3>
                <div id="jackpotNum">£{ this.state.jackpot.toFixed(2) }!!</div>
            </div>
        );
    }
}

export default JackpotComponent;