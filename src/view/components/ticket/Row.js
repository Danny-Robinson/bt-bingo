import React from 'react';
import Cell from './Cell';

export default ({ cells, cursor, colour }) => (
  <div style={{ display: 'flex' }}>
    {cells.map(number => <Cell number={number} cursor={cursor} colour={colour}/>)}
  </div>
);

// {
  // ...{value: 0, dabbed: false },
  // date: 'today'
// }

