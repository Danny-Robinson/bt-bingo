import React from 'react';
import Row from './Row';

export default ({ name, rows }) => (
    <div className="container">
        <br/>
        <div className="row">
            <div className="col">
                {rows.map(row => <Row cells={row} />)}
            </div>
            <div className="col">
                <h5>{name}</h5>
            </div>
        </div>
    </div>
);