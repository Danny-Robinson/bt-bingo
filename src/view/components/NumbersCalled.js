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
        this.refreshNumbers = this.refreshNumbers.bind(this);
        this.resetNumbers = this.resetNumbers.bind(this);
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
        socket.on('resettedList', function () {
            this.setState({
                lastNum: "",
                calledNumbers: [],
            });
            socket.emit('getCalledNumbers');
        }.bind(this));
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            nextProps
        });
    }

    resetNumbers() {
        const {socket} = this.props;
        socket.emit('resetCalledNumbers');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    }

    refreshNumbers() {
        const {socket} = this.props;
        socket.emit('callNewNum');
        socket.emit('getCalledNumbers');
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
        //socket.emit('reRenderAllComponents');
    }

    render() {
        let { calledNumbers } = this.state;
        return (
            <div>
                <div id="lastNumber">
                    Last Number: <p>{this.state.lastNum}</p>
                </div>

                <NumbersCalledList numbersList={calledNumbers} />

                <button type="button" className="btn btn-reset" onClick={this.resetNumbers}>
                    Reset!
                </button>
                <button type="button" className="btn btn-refresh" onClick={this.refreshNumbers}>
                    Update
                </button>
            </div>
        );
    }
}

export default NumbersCalled;
