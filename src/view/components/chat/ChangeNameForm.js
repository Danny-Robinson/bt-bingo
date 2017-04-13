import React, { Component } from 'react';

class ChangeNameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newName: ''
        };
        this.onKey = this.onKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onKey(e) {
        this.setState({ newName : e.target.value });
    }

    handleSubmit(e) {
        const { onChangeName } = this.props;
        e.preventDefault();
        let newName = this.state.newName;
        onChangeName(newName);
        this.setState({ newName: '' });
    }

    render() {
        return(
            <div className='change_name_form'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.onKey}
                        value={this.state.newName}
                        placeholder="Change nickname"
                    />
                </form>
            </div>
        );
    }
}

export default ChangeNameForm;