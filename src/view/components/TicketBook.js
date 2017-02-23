import React from 'react';
import Ticket from './Ticket';

// const book = this.props.book
// const { book } = this.props
export default ({ book }) => (
	<div>
    { book.map((ticket, index) => <Ticket key={`ticket${index}`} name={`Ticket ${index + 1}`} rows={ticket} />) }
	</div>
);

// this.props.book.map(function (ticket) {
//   return <Ticket rows={ticket} />
// })

// const hey = () => {...};
// function hey () {...}

// () => { return x }
// () => (x)
// () => x
