import React from 'react';
import NavigationBar from '../static/NavigationBar';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
const socket = io();

const LeaderboardPage = () => (
    <span>
        <NavigationBar/>
        <div className="pageContent">
            <div>
                <RealTimeLeaderboard socket={socket} />
            </div>
        </div>
  </span>
);

export default LeaderboardPage;
