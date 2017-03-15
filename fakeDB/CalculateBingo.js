
class CalculateBingo {

    static isItBingo(calledNums, ticketBook) {
        var key = Object.keys(ticketBook[0])[1];
        return CalculateBingo.calculate(calledNums, ticketBook[0][key]);
    }

    static calculate(calledNums, ticketBook) {
        let bingo = false;
        let rowBingo = true;
        ticketBook = JSON.parse(ticketBook);
        for (let i=0; i < ticketBook.length; i++){   //for each ticket
            rowBingo = true;
            let ticket = ticketBook[i];
            for (let j=0; j < ticket.length; j++){   //for each row
                let row = ticket[j];
                for (let k=0; k < row.length; k++){   //for each cell
                    let cell = row[k];
                    if (cell) {
                        if (calledNums.indexOf(cell) == -1){
                            rowBingo = false;
                        }
                    }
                }
            }
            if (rowBingo){
                bingo = true;
            }
        }
        return bingo;
    }


}

module.exports = CalculateBingo;