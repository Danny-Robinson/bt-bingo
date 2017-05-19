import React from 'react';
import NavigationBar from '../static/NavigationBar';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
import WinnersLeaderboard from '../leaderboards/AllTimeLeaderboard';
import socket from '../static/socket';

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
