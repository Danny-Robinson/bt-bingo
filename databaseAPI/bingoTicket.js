let ticketBook;
let blankTicketBook = [[
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
], [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
], [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
], [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
], [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
], [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
]];
let allocatedNumbers = [];
let ticketGen = 0;
let wave = 0;
let emptyWave = 0;
let genCount = 0;
let gen2Count = 0;
let gen3Count = 0;
let genWave1Complete = false;
let genWave2Complete = false;
let genWave3Complete = false;

class TicketBookApi {

    static provideBook(number){
        this.generateTicket();
        this.reorderCols();
        return this.getTicketBook(number);
    }

    static getTicketBook(number) {
        let arr = ticketBook.slice(0);
        arr.splice(number - 1, 6 - number);
        console.log("Tickets: ", number);
        console.log(arr.toString());
        return arr;
    }

    static generateTicket(){
        this.refresh();
        while (!this.genWave1Complete) {
            this.genWave1();
        }
        while (!this.genWave2Complete && this.gen2Count < 1000) {
            this.gen2Count++;
            this.genWave2();
        }
        while (!this.genWave3Complete && this.gen3Count < 1000) {
            this.gen3Count++;
            this.genWave3();
        }
        if (this.allocatedNumbers.length < 90 || this.hasBlankColumn()){
            //console.log("Regen");
            this.generateTicket();
        }
    }

    static refresh(){
        ticketBook = JSON.parse(JSON.stringify(blankTicketBook));
        this.allocatedNumbers = [];
        this.ticketGen = 0;
        this.wave = 0;
        this.emptyWave = 0;
        this.genCount = 0;
        this.gen2Count = 0;
        this.gen3Count = 0;
        this.genWave1Complete = false;
        this.genWave2Complete = false;
        this.genWave3Complete = false;
    }

    static genWave1() {
        let column = this.wave;
        for (let row = 0; row < 3; row++) {
            for (let ticket = 0; ticket < 6; ticket++) {
                this.genCellValue(ticket, row, column);
                if (column < 8) {
                    column++;
                } else {
                    column = 0;
                }
            }
        }
        if (this.allocatedNumbers.length < 90 && this.ticketGen < 16) {
            this.ticketGen++;
            this.wave++;
        } else if (this.allocatedNumbers.length < 90 && this.ticketGen < 40) {
            this.genWave1Complete = true;
        }
    }

    static genWave2() {
        let cell = this.findEmptyCol();
        this.emptyWave++;
        let ticket = cell[0];
        let column = cell[1];
        if (ticket == -1) {
            this.genWave2Complete = true;
        } else {
            for (let row = 0; row < 3; row++) {
                this.forceCellValue(ticket, row, column);
            }
            if (this.allocatedNumbers.length < 90 && this.ticketGen < 200) {
                this.ticketGen++;
            }
        }
    }

    static genWave3() {
        let incomplete = this.findIncompleteRow();
        let success = false;
        let ticket = incomplete[0];
        let row = incomplete[1];
        if (ticket == -1) {
        } else {
            for (let column = 0; column < 9; column++) {
                if (this.forceCellValue(ticket, row, column)){
                    success = true;
                }
            }
            if ((success == false && this.ticketGen > 200)){
                let unallocatedCol = Math.floor(this.getUnallocated()[0] / 10);
                if (unallocatedCol == 9) {unallocatedCol = 8}
                this.stealForRow(ticket, row, unallocatedCol);
            }
            if (this.allocatedNumbers.length < 90 && this.ticketGen < 400) {
                this.ticketGen++;
            } else {
                this.genWave3Complete = true;
            }
        }
    }

    static reorderCols(){
        for (let ticket=0; ticket<6; ticket++){
            for (let column=0; column<9; column++){
                this.orderColumn(ticket, column);
            }
        }
    }

    static orderColumn(ticket, column){
        let cell1 = ticketBook[ticket][0][column];
        let cell2 = ticketBook[ticket][1][column];
        let cell3 = ticketBook[ticket][2][column];
        let allocatedCells = this.allocatedCellsInTicketColumn(ticket, column);
        if (allocatedCells == 3){
            if (!(cell1 < cell2 && cell2 < cell3)){
                this.reorderThreeCells(ticket, column)
            }
        } else if (allocatedCells == 2){
            if (!this.cellHasValue(ticket, 0, column)){
                if (!(cell2 < cell3)) {
                    this.swapCell(ticket, 1, ticket, 2, column);
                }
            } else if (!this.cellHasValue(ticket, 1, column)){
                if (!(cell1 < cell3)) {
                    this.swapCell(ticket, 0, ticket, 2, column);
                }
            } else if (!this.cellHasValue(ticket, 2, column)){
                if (!(cell1 < cell2)){
                    this.swapCell(ticket, 0, ticket, 1, column);
                }
            }
        }
    }

    static reorderThreeCells(ticket, column){
        let cell1 = ticketBook[ticket][0][column];
        let cell2 = ticketBook[ticket][1][column];
        let cell3 = ticketBook[ticket][2][column];
        while (!(cell1 < cell2 && cell2 < cell3)){
            if (cell1 > cell2){
                this.swapCell(ticket, 0, ticket, 1, column);
            } else if (cell2 > cell3) {
                this.swapCell(ticket, 1, ticket, 2, column);
            } else if (cell1 > cell3){
                this.swapCell(ticket, 0, ticket, 2, column);
            }
            cell1 = ticketBook[ticket][0][column];
            cell2 = ticketBook[ticket][1][column];
            cell3 = ticketBook[ticket][2][column];
        }
    }

    static hasBlankColumn(){
        let hasBlankCol = false;
        for (let ticket=0; ticket < 6; ticket++){
            for (let column=0; column<9; column++){
                if (this.allocatedCellsInTicketColumn(ticket, column) == 0){
                    hasBlankCol = true;
                }
            }
        }
        return hasBlankCol;
    }

    static stealForRow(stealToTicket, stealToRow, unallocatedCol){
        let emptyCols = this.getEmptyCols(stealToTicket, stealToRow);
        for (let i = 0; i<emptyCols.length; i++){
            for (let ticket =0; ticket < 6; ticket++) {
                for (let row =0; row < 3; row++) {
                    if (this.rowHasRoomForUnallocated(ticket, row, unallocatedCol)
                        && this.rowHasCellToSteal(ticket, row, emptyCols[i])
                        && this.notLastNumberInTicketCol(ticket, row, emptyCols[i])
                        && !(ticket == stealToTicket && row == stealToRow)){
                        this.swapCell(ticket, row, stealToTicket, stealToRow, emptyCols[i]);
                        return;
                    }
                }
            }
        }
    }

    static swapCell(ticket, row, ticket2, row2, column){
        let temp = ticketBook[ticket][row][column];
        ticketBook[ticket][row][column] = ticketBook[ticket2][row2][column];
        ticketBook[ticket2][row2][column] = temp;
    }

    static notLastNumberInTicketCol(ticket, column){
        return (this.allocatedCellsInTicketColumn(ticket, column) != 1);
    }

    static allocatedCellsInTicketColumn(ticket, column){
        let count = 0;
        for (let row =0; row < 3; row++){
            if (this.cellHasValue(ticket, row, column)){
                count ++;
            }
        }
        return count;
    }

    static findEmptyCol() {
        if (this.emptyWave > 5) {
            this.emptyWave = 0;
        }
        for (let ticket = this.emptyWave; ticket < 6; ticket++) {
            for (let column = 0; column < 9; column++) {
                if (this.columnIsBlank(ticket, column)) {
                    return [ticket, column];
                }
            }
        }
        return [-1, 0];
    }

    static getUnallocated() {
        let missing = [];
        for (let i = 1; i < 91; i++)
            if (this.numberUnallocated(i)) {
                missing.push(i);
            }
        return missing;
    }

    static getEmptyCols(ticket, row){
        let empties = [];
        for (let column =0; column<8; column++){
            if (!this.cellHasValue(ticket, row, column)){
                empties.push(column);
            }
        }
        return empties;
    }

    static rowHasRoomForUnallocated(ticket, row, unallocatedCol) {
        return (!this.cellHasValue(ticket, row, unallocatedCol))
    }

    static rowHasCellToSteal(ticket, row, stealToColumn){
        return this.cellHasValue(ticket, row, stealToColumn);
    }

    static findIncompleteRow() {
        for (let ticket = 0; ticket < 6; ticket++) {
            for (let row = 0; row < 3; row++) {
                if (this.numbersInRow(ticket, row) < 5){
                    return [ticket, row];
                }
            }
        }
        return [-1.0];
    }

    static numbersInRow(ticket, row) {
        let numberCount = 0;
        for (let i = 0; i < 9; i++) {
            if (ticketBook[ticket][row][i] > 0) {
                numberCount++;
            }
        }
        return numberCount;
    }

    static validRow(ticket, row) {
        return (this.numbersInRow(ticket, row) < 5)
    }

    static cellHasValue(ticket, row, column) {
        return (ticketBook[ticket][row][column] != '')
    }

    static firstOfThree(ticket, row, column, dimension) {
        switch (dimension) {
            case "horizontal" :
                if (this.cellHasValue(ticket, row, column + 1) && this.cellHasValue(ticket, row, column + 2)) {
                    return true;
                }
                break;
            case "vertical" :
                if (this.cellHasValue(ticket, row + 1, column) && this.cellHasValue(ticket, row + 2, column)) {
                    return true;
                }
                break;
            case "empty" :
                if (!this.cellHasValue(ticket, row + 1, column) && !this.cellHasValue(ticket, row + 2, column)) {
                    if (!this.cellHasValue(ticket, row, column)) {
                        return true;
                    }
                }
                break;
        }
        return false;
    }

    static middleOfThree(ticket, row, column, dimension) {
        switch (dimension) {
            case "horizontal" :
                if (this.cellHasValue(ticket, row, column - 1) && this.cellHasValue(ticket, row, column + 1)) {
                    return true;
                }
                break;
            case "vertical" :
                if (this.cellHasValue(ticket, row - 1, column) && this.cellHasValue(ticket, row + 1, column)) {
                    return true;
                }
        }
        return false;
    }

    static lastOfThree(ticket, row, column, dimension) {
        switch (dimension) {
            case "horizontal" :
                if (this.cellHasValue(ticket, row, column - 1) && this.cellHasValue(ticket, row, column - 2)) {
                    return true;
                }
                break;
            case "vertical" :
                if (this.cellHasValue(ticket, row - 1, column) && this.cellHasValue(ticket, row - 2, column)) {
                    return true;
                }
                break;
        }
        return false;
    }

    static isThirdConsecutiveInCol(ticket, row, column) {
        let consecutive = false;
        switch (row) {
            case 0:
                if (this.firstOfThree(ticket, row, column, "vertical")) {
                    consecutive = true;
                }
                break;
            case 1:
                if (this.middleOfThree(ticket, row, column, "vertical")) {
                    consecutive = true;
                }
                break;
            case 2:
                if (this.lastOfThree(ticket, row, column, "vertical")) {
                    consecutive = true;
                }
                break;
        }
        return consecutive;
    }

    static isThirdConsecutiveInRow(ticket, row, column) {
        let consecutive = false;
        switch (column) {
            case 0:
                if (this.firstOfThree(ticket, row, column, "horizontal")) {
                    consecutive = true;
                }
                break;
            case 1:
                if (this.middleOfThree(ticket, row, column, "horizontal")
                    || this.firstOfThree(ticket, row, column, "horizontal")) {
                    consecutive = true;
                }
                break;
            case 7:
                if (this.middleOfThree(ticket, row, column, "horizontal")
                    || this.lastOfThree(ticket, row, column, "horizontal")) {
                    consecutive = true;
                }
                break;
            case 8:
                if (this.lastOfThree(ticket, row, column, "horizontal")) {
                    consecutive = true;
                }
                break;
            default:
                if (this.firstOfThree(ticket, row, column, "horizontal")
                    || this.middleOfThree(ticket, row, column, "horizontal")
                    || this.lastOfThree(ticket, row, column, "horizontal")) {
                    consecutive = true;
                }
                break;
        }
        return consecutive;
    }

    static validAdd(ticket, row, column, number) {
        return (this.validRow(ticket, row)
        && (!this.isThirdConsecutiveInRow(ticket, row, column) || this.genCount < 20)
        && (!this.isThirdConsecutiveInCol(ticket, row, column) || (this.ticketGen > 100 && this.lastNumberForCol(column)))
        && !this.lastColumnNumberInWrongTicket(ticket, column)
        && !this.lastTicketNumberInWrongColumn(ticket, column)
        && number > 0)
    }

    static lastTicketNumberInWrongColumn(ticket, column) {
        if (!this.columnIsBlank(ticket, column) || (this.numbersInTicket(ticket) + this.blankColsInTicket(ticket) > 15)) {
        }
        return (!this.columnIsBlank(ticket, column) && (this.numbersInTicket(ticket) + this.blankColsInTicket(ticket) > 18) )
    }

    static numbersInTicket(ticket) {
        let numbersInTicket = 0;
        for (let row = 0; row < 2; row++) {
            numbersInTicket += this.numbersInRow(ticket, row);
        }
        return numbersInTicket;
    }

    static blankColsInTicket(ticket) {
        let blankCols = 0;
        for (let column = 0; column < 8; column++) {
            if (this.columnIsBlank(ticket, column)) {
                blankCols++;
            }
        }
        return blankCols;
    }

    static columnIsBlank(ticket, column) {
        return this.firstOfThree(ticket, 0, column, "empty")
    }

    static lastColumnNumberInWrongTicket(ticket, column) {
        if (this.lastNumberForCol(column)) {
            for (let tick = 0; tick < 6; tick++) {
                if (this.firstOfThree(tick, 0, column, "empty") && tick != ticket) {
                    return true;
                }
            }
        }
        return false;
    }

    static lastNumberForCol(column) {
        let start = column * 10;
        let range = 9;
        let count = 0;
        if (column == 0) {
            start++;
        } else if (column == 8) {
            range++;
        }
        for (let number = start; number < start + range; number++) {
            if (this.numberUnallocated(number)) {
                count++;
            }
        }
        return (count == 1);
    }

    static numberUnallocated(number) {
        return this.allocatedNumbers.indexOf(number) == -1;
    }

    static random(column) {
        let min = 0;
        let max = 9;
        if (column == 8) {
            max = 10;
        } else if (column == 0) {
            min = 1;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateNewNumber(column) {
        let rand = this.random(column);
        let number = column * 10 + rand;
        if (this.allocatedNumbers.indexOf(number) == -1) {
            this.genCount = 0;
            return number;
        } else {
            this.genCount++;
            if (this.genCount > 1000) {
                return this.generateNewNumber(column);
            } else {
                return '';
            }
        }

    }

    static inputCellValue(ticket, row, column, number) {
        this.allocatedNumbers.push(number);
        ticketBook[ticket][row][column] = number;
    }

    static genCellValue(ticket, row, column) {
        if (ticketBook[ticket][row][column] == '') {
            let number = this.generateNewNumber(column);
            if (this.validAdd(ticket, row, column, number)) {
                this.inputCellValue(ticket, row, column, number);
            }
        }
    }

    static forceCellValue(ticket, row, column) {
        let success = false;
        if (ticketBook[ticket][row][column] == '') {
            let number = this.getUnallocatedNumber(column);
            if (this.validAdd(ticket, row, column, number)) {
                this.inputCellValue(ticket, row, column, number);
                success = true;
            }
        }
        return success;
    }

    static getUnallocatedNumber(column) {
        let start = column * 10;
        let range = 10;
        if (column == 0) {
            start++;
            range--;
        } else if (column == 8) {
            range++;
        }
        for (let number = start; number < start + range; number++) {
            if (this.numberUnallocated(number)) {
                return number;
            }
        }
        return -1;
    }
}

module.exports = TicketBookApi;

// let ticketBook2 = [[
//   ['1', '', '26', '', '48', '', '63', '79', ''],
//   ['2', '14', '23', '', '', '', '', '73', '81'],
//   ['', '15', '28', '31', '41', '', '67', '', '']
// ],[
//   ['4', '13', '', '', '43', '', '66', '77', ''],
//   ['', '14', '23', '33', '', '', '66', '', '81'],
//   ['3', '', '28', '', '41', '52', '', '', '83']
// ], [
//   ['7', '', '24', '', '43', '', '66', '77', ''],
//   ['', '', '', '', '42', '55', '66', '73', '81'],
//   ['8', '15', '', '', '41', '', '', '72', '83']
// ], [
//   ['5', '', '26', '', '48', '', '63', '79', ''],
//   ['9', '14', '23', '', '', '', '', '73', '81'],
//   ['', '15', '28', '31', '41', '', '67', '', '']
// ], [
//   ['1', '', '26', '', '48', '', '63', '79', ''],
//   ['2', '14', '23', '', '', '', '', '73', '81'],
//   ['', '15', '28', '31', '41', '', '67', '', '']
// ], [
//   ['1', '', '26', '', '48', '', '63', '79', ''],
//   ['2', '14', '23', '', '', '', '', '73', '81'],
//   ['', '15', '28', '31', '41', '', '67', '', '']
// ]];
