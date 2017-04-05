import React, { Component } from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
      const { colour, cursor } = this.props;
      this.state = {
          dabbed: false,
          colour: colour,
          cursor: cursor
      };
      this.dab = this.dab.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let colour = nextProps.colour;
    let cursor = nextProps.cursor;
      this.setState({
          colour: colour,
          cursor: cursor
      });
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
                style={{ cursor: `url(${this.state.cursor}) 5 70,pointer` ,
                    width: '45px', height: '45px', backgroundColor: this.state.dabbed ? this.state.colour : 'white' }}>
        {number}
      </button>
    );
  }
}

export default Cell;