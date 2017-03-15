

let prev_numbers = [1,2,3,4,5,6,7,8];

let min = 1;
let max = 90;

class callNumber {
    //import callNumber from '../../fakeDB/callNumber';
    //<div>{callNumber.getAllRandomNumbers()}</div>
    //<div> Previous numbers: {callNumber.prevNumbers_Get_All()} </div>

    static getAllRandomNumbers()
    {
        while (true) {
            if (this.prevNumbers_IsFull()) {
                this.prevNumbers_PrintAll();
                return this.prevNumbers_Get(0);
            } else {
                let num = this.getValidRandomNumber();
                if (num != -1){
                    this.prevNumbers_Push(num);
                }
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
                //console.log("getValidRandomNumber Exception");
            }
        }else {
            //console.log("prev_numbers is full");
        }
        return -1;
    }

    static prevNumbers_PrintAll() {
        for (let x = 0; x <= this.prevNumbers_Length(); x++) {
            //console.log(this.prevNumbers_Get(x));
        }
    }
    static prevNumbers_IsFull(){
        return (this.prevNumbers_Length() >= max);
    }
    static prevNumbers_Get(index){
        return prev_numbers[index];
    }
    static prevNumbers_Get_All(){
        return prev_numbers.toString();
    }
    static prevNumbers_Push(num){
        prev_numbers.push(num);
    }
    static prevNumbers_Length() {
        return prev_numbers.length;
    }
    static prevNumbers_ExistsIn(num){
        return (this.prevNumbers_IndexOf(num) != -1);
    }
    static prevNumbers_IndexOf(num) {
        return prev_numbers.indexOf(num);
    }
}

export default callNumber;