import React, { Component } from 'react';
import NumbersCalledList from './NumbersCalledList'


class NumbersCalled extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lastNum: "0",
            calledNumbers: ["0"],
            numbersList: ''
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount= this.componentWillUnmount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('deliverCalledNumbers', function (numbers) {
            this.setState({
                lastNum: numbers[0],
                calledNumbers: numbers
            });
        }.bind(this));
        socket.on('calledNumsFull', function () {

        }.bind(this));
        socket.on('resettedList', function () {
            this.setState({
                lastNum: "",
                calledNumbers: [],
            });
            socket.emit('getCalledNumbers');
        }.bind(this));
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        //socket.emit('getLeaderboard_RealTime');
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            nextProps
        });
    }

    componentWillUnmount() {
        this.props.socket.off('deliverCalledNumbers');
        this.props.socket.off('calledNumsFull');
        this.props.socket.off('resettedList');
    }

    render() {
        let { calledNumbers } = this.state;
        return (
            <div id="numbersCalled">
                <div id="lastNumber">
                    Last Number(s): <p>{this.state.lastNum}</p>
                </div>

                <NumbersCalledList numbersList={calledNumbers} />
            </div>
        );
    }
}

export default NumbersCalled;
