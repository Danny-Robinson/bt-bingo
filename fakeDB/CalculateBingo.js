
class CalculateBingo {

    static isItBingo(calledNums, ticketBook) {
        let key = Object.keys(ticketBook[0])[1];
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

    static numsRemaining(calledNums, ticketBook) {
        let key = Object.keys(ticketBook[0])[0];
        return CalculateBingo.calculateRemaining(calledNums, ticketBook[0][key]);
    }

    static calculateRemaining(calledNums, ticketBook){

        ticketBook = JSON.parse(ticketBook);
        let lowestNumsRemaining = 15;
        for (let i=0; i < ticketBook.length; i++){   //for each ticket
            let ticket = ticketBook[i];
            let numsRemaining = 15;
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


}

module.exports = CalculateBingo;
