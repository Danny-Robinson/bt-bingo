
class CalculateBingo {

    //ticketBook[0])[0] may need to be changed, depending on format of ticketBook
    static isItBingo(calledNums, ticketBook) {
        if (ticketBook != null && ticketBook) {
            let key = Object.keys(ticketBook[0])[0]; //user's latest set of tickets bought, ticketbook should only contains the user's latest ticket. Create mongo table "expired tickets" for old tickets.
            return CalculateBingo.calculateRemaining(calledNums, ticketBook[0][key]) == 0;
        }
    }

    static numsRemaining(calledNums, ticketBook) {
        if (ticketBook != null && ticketBook) {
            let key = Object.keys(ticketBook[0])[0];
            return CalculateBingo.calculateRemaining(calledNums, ticketBook[0][key]);
        }
    }

    static calculateRemaining(calledNums, ticketBook){
        let maxNums = 15;

        ticketBook = JSON.parse(ticketBook);
        let lowestNumsRemaining = maxNums;
        for (let i=0; i < ticketBook.length; i++){   //for each ticket
            let ticket = ticketBook[i];
            let numsRemaining = maxNums;
            for (let j=0; j < ticket.length; j++){   //for each row
                let row = ticket[j];
                for (let k=0; k < row.length; k++){   //for each cell
                    let cell = row[k];
                    if (cell) {
                        if (calledNums.indexOf(cell) != -1){
                            numsRemaining--;
                        }
                    }
                }
            }
            if(numsRemaining < lowestNumsRemaining){
                lowestNumsRemaining = numsRemaining;
            }
        }
        return lowestNumsRemaining;
    }

    /*static isItBingo(calledNums, ticketBook) {
        let key = Object.keys(ticketBook[0])[0];
        //return CalculateBingo.calculate(calledNums, ticketBook[0][key]);
        return CalculateBingo.calculateRemaining(calledNums, ticketBook[0][key]) <= 0;
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
    }*/
}

module.exports = CalculateBingo;
