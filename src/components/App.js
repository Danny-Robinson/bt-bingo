import React from 'react';
import TicketBook from './TicketBook';
import bingoTicket from '../fakeDB/bingoTicket';
import callNumber from './callNumber';

const App = ({ text }) => (
  <div>
		TicketBook: {text}
    <TicketBook book={bingoTicket} />
  </div>
);

export default App;
