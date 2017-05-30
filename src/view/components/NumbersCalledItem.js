import React, { Component } from 'react';

class NumbersCalledItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <span className="numberItem">{this.props.number}</span>
        );
    }
}

export default NumbersCalledItem;