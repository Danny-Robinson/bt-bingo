import React from 'react';
import LeaderScore from './LeaderScore';

class RealTimeLeaderboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rt_winners: []
        };
        this._init = this._init.bind(this);
        this.componentWillUnmount= this.componentWillUnmount.bind(this);
        this.componentDidMount= this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const {socket} = this.props;
        socket.on('refreshLeaderboard_RealTime', this.refreshLeaderboard);
        socket.on('setLeaderboard_RealTime', this.setLeaderboard);
        socket.on('resettedLeaderboard_RealTime', this.resetLeaderboard);
        socket.emit('getLeaderboard_RealTime');
    }

    componentWillUnmount() {
        this.props.socket.off('refreshLeaderboard_RealTime' );
        this.props.socket.off('setLeaderboard_RealTime');
        this.props.socket.off('resettedLeaderboard_RealTime');
    }

    _init(data){

        let winners = data["winners"];
        this.setState({
            rt_winners: winners
        });
        console.log("_init_:", this.state.rt_winners);
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            nextProps
        });
    };

    /**
     * @param data - array of every user in the database
     *  Format: {"winners": [{user: username, numLeft: num}, ...]}
     */
    setLeaderboard = (data) => {
        let winners = data["winners"];
        this.setState({
            rt_winners: winners
        });
        for(let x = 0; x < winners.length; x++){
            let winner = winners[x];
            if (winner['numsLeft'] == 0){
                console.log("Found winner!!: ", winner['user'])
                //const { socket } = this.props;
                //let userSessionId = JSON.parse(localStorage.getItem('userSession')).sessionID;
                //socket.emit('simulateBingoWin_AllTime', userSessionId);
            }
        }
    };

    resetLeaderboard = () => {
        const { socket } = this.props;
        this.setState({
            rt_winners: {"winners": []}
        });
        socket.emit('resetLeaderboard_RealTime');
    };

    refreshLeaderboard = () => {
        const {socket} = this.props;
        socket.emit('calculateLeaderboard_RealTime');
        //socket.emit('getLeaderboard_RealTime');
    };

    addLeader_RealTime = () => {
        /*
         Calculate current leaders by calculating how close to bingo each player is - Server-side.
         */
        const { socket } = this.props;
        let min = 99;
        let max = 9999;
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; //Random int between min and max (inclusive)
        let temp_winners = {"user" : "user"+randomNumber, "numsLeft": randomNumber};
        socket.emit('addLeader_RealTime', temp_winners);
    };

    render() {
        let {rt_winners} = this.state;
        return (
            <div>
                <span>
                    <div className='messages'>
                        <h2> Real Time: </h2>
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
/*
 <span>
 <button type="button" className="btn btn-rtadd" onClick={this.calculateLeaders}>
 Calculate Leaders
 </button>
 </span>
 */
export default RealTimeLeaderboard;