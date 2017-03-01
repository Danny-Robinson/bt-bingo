import React from 'react';
import Cell from './Cell';

export default ({ cells }) => (
  <div style={{ display: 'flex' }}>
    {cells.map(number => <Cell number={number} />)}
  </div>
);

// {
  // ...{value: 0, dabbed: false },
  // date: 'today'
// }

