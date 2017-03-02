import React from 'react';
import TicketBook from './TicketBook';
import bingoTicketApi from '../../fakeDB/bingoTicket';
import NavigationBar from './static/NavigationBar';
import callNumber from '../../fakeDB/callNumber';

const App = ({ text }) => (
  <span>
      <NavigationBar />
      <div>{callNumber.getAllRandomNumbers()}</div>

      <TicketBook book={bingoTicketApi.provideBook()} />
  </span>
);

/*generate will be moved to purchase component*/
/*Book will then be grabbed from mongodb*/

export default App;
