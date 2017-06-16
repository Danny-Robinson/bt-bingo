import React from 'react';
import NumbersCalledItem from './NumbersCalledItem'

class NumbersCalledList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {numbersList} = this.props;
        return (
            <div className='messages'>
                <div> Called Numbers:</div>
                <div id="numberList">
                    {
                        numbersList.map((item, i) => {
                            return <NumbersCalledItem key={i} number={item} />
                        })
                    }
                </div>
            </div>
        );
    }
}

export default NumbersCalledList;