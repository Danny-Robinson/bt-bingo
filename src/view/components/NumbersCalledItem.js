import React, { Component } from 'react';

class NumbersCalledItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <span className="numberItem"> <font color="white">{this.props.number}</font></span>
        );
    }
}

export default NumbersCalledItem;