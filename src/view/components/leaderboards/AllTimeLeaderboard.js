/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';

class AllTimeLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            global_winners: []
        };

        this.refreshLeaderboard = this.refreshLeaderboard.bind(this);
        this.setLeaderboard = this.setLeaderboard.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props;
        socket.on('setLeaderboard_AllTime', function (winners) {
            this.setLeaderboard(winners);
        }.bind(this));
        socket.on('refreshLeaderboard_AllTime', this.refreshLeaderboard);
        socket.emit('getLeaderboard_AllTime');
    }

    componentWillUnmount() {
        const { socket } = this.props;
        socket.off('setLeaderboard_AllTime');
        socket.off('refreshLeaderboard_AllTime');
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

    setLeaderboard(winners){
        this.setState({
            global_winners: winners['winners']
        });
        console.log("setLeaderboard_AllTime:", this.state.global_winners);
    }

    render() {
        let { global_winners } = this.state;
        return (

             <div className='leaderboard_RealTime'>
                 <h2> All Time: </h2>
                 {
                     global_winners.map((winner, i) => {
                         return (
                             <LeaderScore
                                 key={i}
                                 user={winner.user}
                                 score={"£"+winner.winnings}
                             />
                         );
                     })
                 }
                </div>

        );
    }
}

export default AllTimeLeaderboard;


