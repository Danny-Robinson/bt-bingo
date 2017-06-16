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
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.gotJackpot = this.gotJackpot.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('gotJackpot', this.gotJackpot);
        socket.emit('getJackpot');
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            nextProps
        });
    }

    componentWillUnmount() {
        this.props.socket.on('gotJackpot');
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
                <div id="jackpotNum">£{this.state.jackpot}!!</div>
            </div>
        );
    }
}

export default JackpotComponent;