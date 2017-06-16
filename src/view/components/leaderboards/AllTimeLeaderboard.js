/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';

class AllTimeLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            global_winners: [],
            jackpot: "£15!"
        };

        this._init = this._init.bind(this);
        this.refreshLeaderboard = this.refreshLeaderboard.bind(this);
        this.setLeaderboard = this.setLeaderboard.bind(this);
        this.componentWillReceiveProps= this.componentWillReceiveProps.bind(this);
        this.gotJackpot = this.gotJackpot.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('setLeaderboard_AllTime', this.setLeaderboard);
        socket.on('refreshLeaderboard_AllTime', this.refreshLeaderboard);
        socket.on('gotJackpot', this.gotJackpot);
        socket.emit('getLeaderboard_AllTime');

    }

    componentWillUnmount() {
        this.props.socket.on('setLeaderboard_AllTime');
        this.props.socket.on('refreshLeaderboard_AllTime');
        this.props.socket.on('gotJackpot');
    }

    _init(data){

        let winners = data["winners"];
        this.setState({
            global_winners: winners
        });
        console.log("_init_:", this.state.global_winners);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            nextProps
        });
    }

    gotJackpot(gameJackpot){
        this.setState({
            jackpot: "£"+gameJackpot
        });
        console.log("gotjackpot:", this.state.jackpot);
    }

    refreshLeaderboard() {
        console.log("refreshLeaderboard_AllTime");
        const {socket} = this.props;
        socket.emit('getLeaderboard_AllTime');
        socket.emit('getJackpot');
    }

    setLeaderboard(data){

        let winners = data["winners"];
        this.setState({
            global_winners: winners
        });
        console.log("setLeaderboard_AllTime:", this.state.global_winners);
    }

    render() {
        let { global_winners } = this.state;
        return (
            <div>
                <div className='messages'>
                    <div>
                        Current Jackpot: {this.state.jackpot}
                    </div>

                    <h2> All Time: </h2>
                    {
                        global_winners.map((winner, i) => {
                            return (
                                <LeaderScore
                                    key={i}
                                    user={winner.user}
                                    score={winner.winnings}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default AllTimeLeaderboard;


