import React from 'react';
import Row from './Row';

export default ({ name, rows }) => (
  <div>
    <h1>{name}</h1>
    {rows.map(row => <Row cells={row} />)}
  </div>
);
