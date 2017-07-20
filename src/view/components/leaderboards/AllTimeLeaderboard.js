/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';
import JackpotComponent from '../JackpotComponent';

class AllTimeLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            global_winners: []
        };

        this._init = this._init.bind(this);
        this.refreshLeaderboard = this.refreshLeaderboard.bind(this);
        this.setLeaderboard = this.setLeaderboard.bind(this);
        this.componentWillReceiveProps= this.componentWillReceiveProps.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('setLeaderboard_AllTime', this.setLeaderboard);
        socket.on('refreshLeaderboard_AllTime', this.refreshLeaderboard);
        socket.emit('getLeaderboard_AllTime');
    }

    componentWillUnmount() {
        this.props.socket.on('setLeaderboard_AllTime');
        this.props.socket.on('refreshLeaderboard_AllTime');
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

    render() {
        let { global_winners } = this.state;
        const {socket} = this.props;
        return (
            <div>
                <div className='messages'>
                    <h2> All Time: </h2>
                    {
                        global_winners.map((winner, i) => {
                            return (
                                <LeaderScore
                                    key={i}
                                    user={winner.user}
                                    score={"£"+winner.winnings.toFixed(2)}
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


