let min = 1;
let max = 90;

class callNumber {

    /**
     * Returns a valid integer between the max and min values (inclusively).
     * Catch if(currentNumList != null)
     * @returns {*}
     */
    static getValidRandomNumber(currentNumList) {
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; //Random int between min and max (inclusive)
        if (!this.listIsFull(currentNumList)) {
            if (this.numExistsInList(randomNumber, currentNumList)) {
                return this.getValidRandomNumber(currentNumList);
            } else {
                return randomNumber;
            }
        }
        return -1;
    }
    static listIsFull(list){
        return (list.length >= max);
    }
    static numExistsInList(num, list){
        return (list.indexOf(num) != -1);
    }
}

module.exports = callNumber;