import React from 'react';
import NavigationBar from '../static/NavigationBar';
import RealTimeLeaderboard from '../leaderboards/RealTimeLeaderboard';
import AllTimeLeaderboard from '../leaderboards/AllTimeLeaderboard';
const socket = io();

const LeaderboardPage = () => (
    <span>
        <NavigationBar/>
        <div className="pageContent">
            <div>
                <AllTimeLeaderboard socket={socket} />
            </div>
        </div>
  </span>
);

export default LeaderboardPage;
