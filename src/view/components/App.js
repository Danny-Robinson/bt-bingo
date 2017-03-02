import React from 'react';
import TicketBook from './TicketBook';
import bingoTicketApi from '../../fakeDB/bingoTicket';
import NavigationBar from './static/NavigationBar';

const App = ({ text }) => (
  <span>
      <NavigationBar />
      <TicketBook book={bingoTicketApi.provideBook()} />
  </span>
);

/*generate will be moved to purchase component*/
/*Book will then be grabbed from mongodb*/

export default App;
