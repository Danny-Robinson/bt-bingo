import React from 'react';
import NavigationBar from '../static/NavigationBar';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
import WinnersLeaderboard from '../leaderboards/AllTimeLeaderboard';
const socket = io();

const LeaderboardPage = () => (
    <span>
        <NavigationBar/>
        <div className="pageContent">
            <div>
                <WinnersLeaderboard socket={socket} />
            </div>
        </div>
  </span>
);

export default LeaderboardPage;
