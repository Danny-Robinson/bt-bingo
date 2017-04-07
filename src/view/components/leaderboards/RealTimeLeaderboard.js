/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';

class RealTimeLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rt_winners: []
        };
        this.userNumbersLeft= this.userNumbersLeft.bind(this);
        this.emitAddRTLeader= this.emitAddRTLeader.bind(this);
        this.refreshLeaderboard= this.refreshLeaderboard.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('deliverAllUserNumsLeft', this.userNumbersLeft);
        socket.on('deliverAddedRTLeader', this.refreshLeaderboard);
        socket.emit('getAllBingoNumbersLeft');
    }

    /**
     * @param data - array of {username, numLeft} for every user in the database.
     */
    userNumbersLeft(data) {
        let winners = data["winners"];
        this.setState({
            rt_winners: winners
        });
        console.log("userNumbersLeft:",this.state.rt_winners);
    }
    refreshLeaderboard(){
        const { socket } = this.props;
        socket.emit('getAllBingoNumbersLeft');
    }
    emitAddRTLeader(){
        const { socket } = this.props;
        let min = 99;
        let max = 9999;
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; //Random int between min and max (inclusive)
        let temp_winners = {"user" : "user"+randomNumber, "numsleft": randomNumber};
        socket.emit('addRTLeader', temp_winners);
    }

    render() {
        let {rt_winners} = this.state;
        return (
            <div>
                <span>
                    <button type="button" className="btn btn-rtadd" onClick={this.emitAddRTLeader}>
                        Add random RT Leader
                    </button>
                </span>
                <span>
                    <div>LeaderBoards:</div>
                    <div className='messages'>
                        <h2> All Time: </h2>
                        {
                            rt_winners.map((winner, i) => {
                                return (
                                    <LeaderScore key={i} user={winner.user} score={winner.numsleft}/>
                                );
                            })
                        }
                    </div>
                </span>
            </div>
        );
    }
}

export default RealTimeLeaderboard;