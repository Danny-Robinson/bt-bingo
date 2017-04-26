import React from 'react';

var listItems;

class NumbersCalled extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lastNum: "0",
            calledNumbers: ["0"],
            numbersList: ''
        };
        this.setList = this.setList.bind(this);
        this.refreshNumbers = this.refreshNumbers.bind(this);
        this.resetNumbers = this.resetNumbers.bind(this);
        this.setList();
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('deliverCalledNumbers', function (numbers) {
            this.setState({
                lastNum: numbers[0],
                calledNumbers: numbers
            });
            this.setList();
        }.bind(this));
        socket.on('resettedList', function () {
            this.setState({
                lastNum: "",
                calledNumbers: [],
            });
            this.setList();
            socket.emit('getCalledNumbers');
        }.bind(this));
        socket.emit('getCalledNumbers');
    }

    setList() {
        listItems = this.state.calledNumbers.map((number) =>
            <ci>{number}</ci>
        );
        this.setState({numbersList: listItems});
    }

    resetNumbers() {
        const {socket} = this.props;
        socket.emit('resetCalledNumbers');
    }

    refreshNumbers() {
        const {socket} = this.props;
        socket.emit('callNewNum');
        socket.emit('getCalledNumbers');
        //socket.emit('getLeaderboard_RealTime');
        /*
         Calculate current leaders by calculating how close to bingo each player is - Server-side.
         */
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
    }

    render() {
        return (
            <div>
                <div id="lastNumber">
                    Last Number: <p>{this.state.lastNum}</p>
                </div>
                <div>Called Numbers:</div>
                <div id="numberList">
                    <cl>{this.state.numbersList}</cl>
                </div>
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

/*
<div id="numberList">
    <NumbersCalledList numbersList={this.state.calledNumbers}/>
</div>*/

export default NumbersCalled;
