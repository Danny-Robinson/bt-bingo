import React from 'react';
import NavigationBar from '../static/NavigationBar';
import AllTimeLeaderboard from '../leaderboards/AllTimeLeaderboard';
import socket from '../static/socket';

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
