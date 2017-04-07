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
        const { socket } = this.props;
        socket.emit('getInitialCalledNums');
        socket.on('deliverCalledNumbers', function (numbers) {
            console.log("deliverCalledNumbers-componentDidMount");
            this.setState({
                lastNum : numbers[0],
                calledNumbers : numbers
            });
            this.setList();
        }.bind(this));
        socket.on('resettedList', function () {
            this.setState({
                lastNum : "0",
                calledNumbers : ["0"],
            });
            this.setList();
        }.bind(this));
    }

    setList(){
        listItems = this.state.calledNumbers.map((number) =>
            <ci>{number}</ci>
        );
        this.setState({ numbersList: listItems});
    }

    resetNumbers(){
        const { socket } = this.props;
        socket.emit('resetCalledNumbers');
        socket.emit('getCalledNumbers');
    }

    refreshNumbers() {
        const { socket } = this.props;
        socket.emit('callNewNum');
        socket.emit('getCalledNumbers');
    }

    render() {
        return (
            <div>
                <div>Last Number: {this.state.lastNum}</div>
                <div>Called Numbers:</div>
                <button type="button" className="btn btn-reset" onClick={this.resetNumbers}>
                    Reset!
                </button>
                <button type="button" className="btn btn-refresh" onClick={this.refreshNumbers}>
                    Update
                </button>
                <cl>{this.state.numbersList}</cl>
            </div>
        );
    }
}

export default NumbersCalled;
