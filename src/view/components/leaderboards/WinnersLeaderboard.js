/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';

class WinnersLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            global_winners: [],
            jackpot: "£30!"
        };
        this._init = this._init.bind(this);
        this.refreshLeaderboard = this.refreshLeaderboard.bind(this);
        this.resetLeaderboard= this.resetLeaderboard.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('leaderBoardInit_AllTime', this._init);
        //socket.on('deliverAddedLeader_AllTime', this.refreshLeaderboard);
        //socket.on('resettedLeaderBoard_AllTime', this.refreshLeaderboard);
        socket.on('refreshLeaderboard_AllTime', this.refreshLeaderboard);
        socket.emit('getLeaderboard_AllTime');
        socket.emit('getLeaderboard_RealTime');
    }

    refreshLeaderboard() {
        console.log("refreshLeaderboard_AllTime");
        const {socket} = this.props;
        socket.emit('getLeaderboard_AllTime');
        socket.emit('getLeaderboard_RealTime');
    }

    _init(data){

        let winners = data["winners"];
        this.setState({
            global_winners: winners
        });
        console.log("_init_:", this.state.global_winners);
    }

    resetLeaderboard(){
        const { socket } = this.props;
        socket.emit('resetLeaderboard_AllTime');
        this.setState({
            global_winners: {"winners": []}
        });
        socket.emit('getLeaderboard_AllTime');
        socket.emit('getLeaderboard_RealTime');
    }

    render() {
        let { global_winners } = this.state;
        return (
            <div>
                <div className='messages'>
                    <div>
                        Current Jackpot: {this.state.jackpot}
                    </div>
                    <span>
                        <button type="button" className="btn btn-resetalltime-leaders" onClick={this.resetLeaderboard}>
                            Reset
                        </button>
                    </span>
                    <h2> All Time: </h2>
                    {
                        global_winners.map((winner, i) => {
                            return (
                                <LeaderScore key={i} user={winner.user} score={winner.winnings}/>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default WinnersLeaderboard;


