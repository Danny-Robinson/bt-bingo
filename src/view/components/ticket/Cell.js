import React, { Component } from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dabbed: false
    };
    this.dab = this.dab.bind(this);
  }

  dab() {
    this.setState({
      dabbed: !this.state.dabbed
    });
  }

  render() {
    const { number } = this.props;
    return (
        <button type="button" className="btn btn-secondary" disabled={!number} onClick={this.dab}
                style={{ width: '45px', height: '45px', backgroundColor: this.state.dabbed ? 'pink' : 'white' }}>
        {number}
      </button>
    );
  }
}

export default Cell;
