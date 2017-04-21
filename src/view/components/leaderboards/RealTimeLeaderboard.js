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
        this._init = this._init.bind(this);
        this.setUserNumbersLeft= this.setUserNumbersLeft.bind(this);
        this.addRTLeader= this.addRTLeader.bind(this);
        this.refreshLeaderboard= this.refreshLeaderboard.bind(this);
        this.calculateLeaders= this.calculateLeaders.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('leaderBoardInit_AllTime', this._init);
        socket.on('deliverLeaders_RealTime', this.setUserNumbersLeft);
        socket.on('deliverAddedRTLeader', this.refreshLeaderboard);
        socket.on('refreshLeaderboard_RealTime', this.refreshLeaderboard);
        socket.emit('getLeaderboard_RealTime');
    }
    _init(data){

        let winners = data["winners"];
        this.setState({
            rt_winners: winners
        });
        console.log("_init_:", this.state.rt_winners);
    }

    /**
     * @param data - array of every user in the database
     *  Format: {"winners": [{user: username, numLeft: num}, ...]}
     */
    setUserNumbersLeft(data) {
        let winners = data["winners"];
        this.setState({
            rt_winners: winners
        });
        console.log("setUserNumbersLeft:",this.state.rt_winners);
    }

    refreshLeaderboard(){
        const { socket } = this.props;
        socket.emit('getLeaderboard_RealTime');
    }

    addRTLeader(){
        /*
         Calculate current leaders by calculating how close to bingo each player is - Server-side.
         */
        const { socket } = this.props;
        let min = 99;
        let max = 9999;
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; //Random int between min and max (inclusive)
        let temp_winners = {"user" : "user"+randomNumber, "numsLeft": randomNumber};
        socket.emit('addRTLeader', temp_winners);
    }
    calculateLeaders(){
        /*
         Calculate current leaders by calculating how close to bingo each player is - Server-side.
         */
        const { socket } = this.props;
        socket.emit('calculateLeaderboard_RealTime');
        socket.emit('getLeaderboard_RealTime');
        //socket.emit('getLeaderboard_AllTime');
    }



    render() {
        let {rt_winners} = this.state;
        return (
            <div>
                <span>
                    <div className='messages'>
                        <h2> Real Time: </h2>
                        <span>
                            <button type="button" className="btn btn-rtadd" onClick={this.calculateLeaders}>
                                Calculate Leaders
                            </button>
                        </span>
                        {
                            rt_winners.map((winner, i) => {
                                return (
                                    <LeaderScore key={i} user={winner.user} score={winner.numsLeft}/>
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