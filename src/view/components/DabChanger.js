import React, { Component } from 'react';

class DabChanger extends Component {
    constructor(props) {
        super(props);
        this.red = this.red.bind(this);
        this.blue = this.blue.bind(this);
        this.green = this.green.bind(this);
        this.pink = this.pink.bind(this);
        this.orange = this.orange.bind(this);
        this.purple = this.purple.bind(this);
        this.state = {
            cursor: 'https://en.gravatar.com/userimage/75305515/3cd028414a041e4693cfd08120356375.png'
        };
    }

    red() {
        const { changeCursor } = this.props;
        let redURL = 'https://en.gravatar.com/userimage/75305515/fbef3bb4f03923dba8012a71e7b6bfac.png';
        this.setState({
            cursor: redURL
        });
        changeCursor(redURL, 'red');
    }

    blue() {
        const { changeCursor } = this.props;
        let blueURL = 'https://en.gravatar.com/userimage/75305515/3cd028414a041e4693cfd08120356375.png';
        this.setState({
            cursor: blueURL
        });
        changeCursor(blueURL, 'blue');
    }

    green() {
        const { changeCursor } = this.props;
        let greenURL = 'https://en.gravatar.com/userimage/75305515/61cafde9d2d9cd801fb56c1c9f359f32.png';
        this.setState({
            cursor: greenURL
        });
        changeCursor(greenURL, 'green');
    }

    pink() {
        const { changeCursor } = this.props;
        let pinkURL = 'https://en.gravatar.com/userimage/75305515/d46889a5397075a7eff12b9db24f4b7d.png';
        this.setState({
            cursor: pinkURL
        });
        changeCursor(pinkURL, 'pink');
    }

    orange() {
        const { changeCursor } = this.props;
        let orangeURL = 'https://en.gravatar.com/userimage/75305515/a724f2b4e7d65150c6261a2438bbeabe.png';
        this.setState({
            cursor: orangeURL
        });
        changeCursor(orangeURL, 'orange');
    }

    purple() {
        const { changeCursor } = this.props;
        let purpleURL = 'https://en.gravatar.com/userimage/75305515/e7d6e5dff971d056bb184e2eba253123.png';
        this.setState({
            cursor: purpleURL
        });
        changeCursor(purpleURL, 'purple');
    }

    render() {
        return (
            <div>
                <h1> Dab changer </h1>
                <button type="button" className="btn btn-secondary" onClick={this.red}
                        style={{ width: '45px', height: '45px', backgroundColor: 'red',
                            cursor: `url(${this.state.cursor}) 5 70,pointer` }} />
                <button  type="button" className="btn btn-secondary" onClick={this.blue}
                         style={{ width: '45px', height: '45px', backgroundColor: 'blue',
                             cursor: `url(${this.state.cursor}) 5 70,pointer` }} />
                <button type="button" className="btn btn-secondary" onClick={this.green}
                        style={{ width: '45px', height: '45px', backgroundColor: 'green',
                            cursor: `url(${this.state.cursor}) 5 70,pointer` }}/>
                <button type="button" className="btn btn-secondary" onClick={this.pink}
                        style={{ width: '45px', height: '45px', backgroundColor: 'pink',
                            cursor: `url(${this.state.cursor}) 5 70,pointer` }}/>
                <button type="button" className="btn btn-secondary" onClick={this.orange}
                        style={{ width: '45px', height: '45px', backgroundColor: 'orange',
                            cursor: `url(${this.state.cursor}) 5 70,pointer` }}/>
                <button type="button" className="btn btn-secondary" onClick={this.purple}
                        style={{ width: '45px', height: '45px', backgroundColor: 'purple',
                            cursor: `url(${this.state.cursor}) 5 70,pointer` }}/>
            </div>
        );
    }
}

export default DabChanger;

//
// onClick={this.blue()}