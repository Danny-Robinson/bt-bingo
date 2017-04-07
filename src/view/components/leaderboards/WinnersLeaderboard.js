/**
 * Created by 611218504 on 05/04/2017.
 */
import React from 'react';
import LeaderScore from './LeaderScore';

class WinnersLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            global_winners: []
        };
        this._initialize = this._initialize.bind(this);
        this.addUserToLeaderboard = this.addUserToLeaderboard.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('leaderBoardInit', this._initialize);
        socket.emit('getWinnersLeaderboard');
    }

    _initialize(data) {
        let {global_winners} = this.state;
        let winners = data["winners"];

        for (let i = 0; i < winners.length; i++) {
            global_winners.push({
                user: winners[i]["user"],
                score: winners[i]["winnings"]
            });
        }
        this.setState({global_winners});
    }
    addUserToLeaderboard(){
        const { socket } = this.props;
        //socket.emit('putToWinnersLeaderboard', username, score);
    }

    render() {
        let { global_winners } = this.state;
        return (
            <div>
                <div>LeaderBoards:</div>
                <div className='messages'>
                    <h2> All Time: </h2>
                    {
                        global_winners.map((winner, i) => {
                            return (
                                <LeaderScore key={i} user={winner.user} score={winner.score}/>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default WinnersLeaderboard;


