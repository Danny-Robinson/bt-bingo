import React from 'react';
import TicketBook from './TicketBook';
import bingoTicket from '../fakeDB/bingoTicket';

const App = ({ text }) => (
  <div>
		TicketBook: {text}
    <TicketBook book={bingoTicket} />
  </div>
);

export default App;
