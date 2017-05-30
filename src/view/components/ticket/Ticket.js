import React from 'react';
import Row from './Row';

export default ({ name, rows, cursor, colour }) => (
    <div className="container">
        <br/>
        <div className="row">
            <div className="col">
                {rows.map((row, i) => <Row key={i} cells={row} cursor={cursor} colour={colour}/>)}
            </div>
            <div className="col">
                <h5>{name}</h5>
            </div>
        </div>
    </div>
);