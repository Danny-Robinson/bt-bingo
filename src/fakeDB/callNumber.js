

let prev_numbers = [];

let min = 1;
let max = 5;

class callNumber {
    //<div>{callNumber.getAllRandomNumbers()}</div>

    static getAllRandomNumbers()
    {
        while (true) {
            //let randNum = this.getValidRandomNumber();
            //if (randNum == -1) {

            if (this.prevNumbers_IsFull()) {
                return this.prevNumbers_Get(0);
            } else {
                this.prevNumbers_Push(this.getValidRandomNumber());
            }
        }
    }

    /**
     * Returns a valid integer between the max and min values (inclusively).
     * @returns {*}
     */
    static getValidRandomNumber() {

        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; //Random int between min and max (inclusive)

        if( ! this.prevNumbers_IsFull()) {
            try {
                if (this.prevNumbers_ExistsIn(randomNumber)) {
                    return this.getValidRandomNumber();
                } else {
                    return randomNumber;
                }
            } catch (Exception) {
                console.log("getValidRandomNumber Exception");
            }
        }else {
            console.log("prev_numbers is full");
        }
        return -1;
    }

    static prevNumbers_IsFull(){
        return (this.prevNumbers_Length() >= max);
    }
    static prevNumbers_Get(index){
        return prev_numbers[index];
    }
    static prevNumbers_Push(num){
        prev_numbers.push(num);
    }
    static prevNumbers_Length() {
        return prev_numbers.length;
    }
    static prevNumbers_IndexOf(num) {
        return prev_numbers.indexOf(num);
    }
    static prevNumbers_ExistsIn(num){
        return (this.prevNumbers_IndexOf(num) != -1);
    }
}

export default callNumber;