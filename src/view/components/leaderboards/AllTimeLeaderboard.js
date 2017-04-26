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
            jackpot: "£15!"
        };
        this._init = this._init.bind(this);
        this.refreshLeaderboard = this.refreshLeaderboard.bind(this);
        this.resetLeaderboard = this.resetLeaderboard.bind(this);
        this.setLeaderboard = this.setLeaderboard.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('setLeaderboard_AllTime', this.setLeaderboard);
        socket.on('refreshLeaderboard_AllTime', this.refreshLeaderboard);
        socket.emit('getLeaderboard_AllTime');
    }

    _init(data){

        let winners = data["winners"];
        this.setState({
            global_winners: winners
        });
        console.log("_init_:", this.state.global_winners);
    }

    refreshLeaderboard() {
        console.log("refreshLeaderboard_AllTime");
        const {socket} = this.props;
        socket.emit('getLeaderboard_AllTime');
    }

    setLeaderboard(data){

        let winners = data["winners"];
        this.setState({
            global_winners: winners
        });
        console.log("setLeaderboard_AllTime:", this.state.global_winners);
    }

    resetLeaderboard(){
        const { socket } = this.props;
        this.setState({
            global_winners: {"winners": []}
        });
        socket.emit('resetLeaderboard_AllTime');
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


