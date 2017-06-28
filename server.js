const path = require('path');
const express = require('express');
const mongoApi = require("./databaseAPI/mongoApi");
const bingoTicket = require("./databaseAPI/bingoTicket");
const callNumber = require("./databaseAPI/callNumber");
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const crypto = require('crypto');

module.exports = (app, port) => {
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/bootstrap', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')
  ));

    const server = app.listen(port, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        const io = require('socket.io')(server);

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '/public', 'index.html'));
        });
        console.log(`Server running at http://localhost: ${port}`);


        io.on('connection', (socket) => {

            process.on('uncaughtException', function (err) {
                console.error(err.stack);
                console.log("Node NOT Exiting...");
            });

            console.log('User connected to Server');
            let name = userNames.getGuestName();
            socket.emit('init', {
                name: name,
                users: userNames.get()
            });

            socket.broadcast.emit('user:join', {
                name: name
            });

            socket.on('send:message', function (data) {
                socket.broadcast.emit('send:message', {
                    user: data.user,
                    text: data.text
                });
            });

            // validate a user's name change, and broadcast it on success
            socket.on('change:name', function (data, fn) {
                if (userNames.claim(data.name)) {
                    let oldName = name;
                    userNames.free(oldName);
                    name = data.name;
                    if (name && oldName) {
                        socket.broadcast.emit('change:name', {
                            oldName: oldName,
                            newName: name
                        });
                    }
                    fn(true);
                } else {
                    fn(false);
                }
            });

            socket.on('message',function(event){
                console.log('Received message from client!',event);
            });

            socket.on('purchase',function(data){
                mongoApi.getUsernameFromSessionId(data.user, function (username) {
                    console.log("Printing" + data);
                    mongoApi.addTicket(bingoTicket.provideBook(data.number), username );
                    mongoApi.addNumTickets(username, data.number);
                    socket.send('Purchased ticket for user: ' + username);
                });
            });

            socket.on('getAllTickets',function(event){
                mongoApi.getAllTickets(function (ticket) {
                    if (ticket != "") {
                        socket.emit('deliverTicket', JSON.stringify(ticket));
                    }
                });
            });
            socket.on('getUserTickets',function(user){
                console.log("GETTING USER TICKETS");
                mongoApi.getUsernameFromSessionId(user, function (username) {
                    console.log("SessionID: " + user + " Username: " + username);
                    mongoApi.getUserTickets(username, function (ticket) {
                        if (ticket != "") {
                            console.log("Ticket: "+ ticket);
                            socket.emit('deliverTicket', JSON.stringify(ticket[0][username]));
                        }
                    });
                });
            });


            /**
            * Saving the user session object in the database.
            * Session format: {"username":"611427411",
            *                  "password":"abcd",
            *                  "sessionId":"cc192d25b7cd12470c1a15d7d0295821792ad180fe1e12b6cca19e9a0655c19",
            *                  "userRole":"user"
            *                 }
            **/
            socket.on('storeSession', function(JSONuser) {
                var userObject = JSON.parse(JSONuser);
                userObject["userRole"] = 'user';
                mongoApi.storeUserSession(userObject, function (result) {
                    if (result != "") {
                        socket.emit('storedSession');
                    }
                });
            });


            /**
            * Removes the user sessionId from the database upon successful logout.
            **/
            socket.on('removeUserSession', function(sessionId) {
                mongoApi.removeUserSession(sessionId, function (result) {
                    if (result !== null) {
                        socket.emit('removedUserSession');
                    }
                });
            });

            socket.on('retrieveUserType', function(sessionId) {
                mongoApi.getUserTypeFromSessionId(sessionId, function (userType) {
                    if (userType !== '' && userType !== null) {
                        socket.emit('retrievedUserType', userType);
                    }
                });
            });

            socket.on('startNewGame',function(){
                console.log("Starting new game...");
                console.log("Stop new tickets");
                mongoApi.blockNewTickets(function (success) {
                    //Notify all clients that new users are blocked (in a nice way)
                    socket.emit('blockedTickets');
                    socket.broadcast.emit('blockedTickets');
                });
                console.log("Block more users");
                mongoApi.blockNewUsers(function (success) {
                    //Notify all clients that new users are blocked (in a nice way)
                    socket.emit('blockedUsers');
                    socket.broadcast.emit('blockedUsers');
                });
                //Notify all clients that game is about to start
                socket.emit('newGameReady');
                socket.broadcast.emit('newGameReady');
            });
            socket.on('resetGame',function(){
                console.log("Resetting game...");
            });
            socket.on('callNumSetSize',function(setsize){
                let data = setsize.callNumSetSize;
                console.log("Call Num set size", data);
            });


            socket.on('getBingo', function(userSessionId){
                mongoApi.getUsernameFromSessionId(userSessionId, function (username) {
                    mongoApi.getBingo(username, function (bingo) {
                        socket.emit('deliverBingo', bingo);

                        if (bingo) {
                            mongoApi.getUsernameWinnings(username, function (prev_winnings) {
                                if (prev_winnings != 0 && (prev_winnings == null || prev_winnings == "")) {
                                    return;
                                }

                                mongoApi.getCurrentJackpot(function (current_jackpot) {
                                    if (current_jackpot!= 0 && (current_jackpot== null || current_jackpot == "")) {
                                        return;
                                    }
                                    console.log("curr_j:",current_jackpot);
                                    let new_winnings = +prev_winnings + +(current_jackpot);
                                    console.log("new_w:",new_winnings);
                                    mongoApi.upsertLeader_AllTime({
                                        "user": username,//.user,
                                        "winnings": new_winnings
                                    }, function (winners) {
                                        socket.emit('setLeaderboard_AllTime', winners);
                                        socket.emit('refreshLeaderboard_AllTime', winners);
                                    });

                                    mongoApi.updateUsernameWinnings(username, new_winnings);
                                });
                            });

                            socket.emit('resetGame');
                        }
                    });
                });
            });

            socket.on('disconnect', () => {
                socket.broadcast.emit('user:left', {
                    name: name
                });
                userNames.free(name);
                console.log('User disconnected from Server');
            });

            socket.on('getListOfUsers', function () {
                mongoApi.getAllTickets(function (book) {
                    if (book != "") {
                        let userList = [];
                        book = JSON.parse(book);
                        for (let i = 0; i < book.length; i++) {
                            for (let name in book[i]) {
                                userList.push(name);
                            }
                        }
                        socket.emit('deliverUserList', userList);
                    }
                });
            });
            socket.on('getUserNumsLeft', function () {
                mongoApi.getAllTickets(function (book) {
                    if (book != "") {
                        book = JSON.parse(book);
                        for (let i = 0; i < book.length; i++) {
                            for (let name in book[i]) {

                                this.setBook(JSON.parse(book[i][name]));
                            }
                        }
                        socket.emit('setLeaderboard_RealTime', userList);
                    }
                });
            });

            socket.on('getJackpot',function(){
               mongoApi.getNumTicketsPurchased(function(numTicketsPurchased){
                   console.log("numsPurchased",numTicketsPurchased);
                    let jackpot = numTicketsPurchased/2;
                    socket.emit('gotJackpot',jackpot);
                    socket.emit('setJackpot',jackpot);
               });
            });

            /**
             * When user clicks "Bingo", simulate they have all the correct numbers (for testing Leaderboards).
             */
            socket.on('simulateBingoWin_RealTime', function(user){
                mongoApi.upsertLeader_RealTime({"user" : user["user"], "numsLeft": "2"}, function (winners) {
                    socket.emit('deliverBingo', true);
                    socket.emit('setLeaderboard_RealTime', winners);
                });
            });
            socket.on('simulateBingoWin_AllTime', function(userSessionId){

                mongoApi.getUsernameFromSessionId(userSessionId, function (username) {
                    mongoApi.getUsernameWinnings(username, function (prev_winnings) {
                        if (prev_winnings != 0 && (prev_winnings == null || prev_winnings == "")) {
                            return;
                        }
                        let current_jackpot = 30;
                        let new_winnings = +prev_winnings + +(current_jackpot / 2);

                        mongoApi.upsertLeader_AllTime({
                            "user": username,//.user,
                            "winnings": new_winnings
                        }, function (winners) {
                            socket.emit('setLeaderboard_AllTime', winners);
                            socket.emit('refreshLeaderboard_AllTime', winners);
                            socket.emit('deliverBingo', true);
                        });

                        mongoApi.updateUsernameWinnings(username, new_winnings);
                    });
                });
            });

            /**
             * Leaderboard functionality:
             * Add new winner when: user clicks "BingoButton" > validate win > then 'insert/ increment' the user's score to the All-time Leaderboard.
             * Add real-time current-game winner: Access all users' tickets in the db > calculate: nums left to win, for each user > order by numsLeft > save to db.
             */
            socket.on('getLeaderboard_AllTime', function () {
                mongoApi.getLeaderBoard_AllTime(function (winners) {
                    socket.emit('setLeaderboard_AllTime', winners);
                    socket.broadcast.emit('setLeaderboard_AllTime', winners);

                    mongoApi.getNumTicketsPurchased(function(numTicketsPurchased){
                        let jackpot = numTicketsPurchased/2;
                        socket.emit('gotJackpot',jackpot);
                        socket.broadcast.emit('gotJackpot',jackpot);
                    });
                });
            });
            socket.on('resetLeaderboard_AllTime', function () {
                mongoApi.resetLeaderboard_AllTime(function () {
                    socket.emit('refreshLeaderboard_AllTime');
                    socket.broadcast.emit('refreshLeaderboard_AllTime');
                });
            });
            /*socket.on('putNewWinner', function (winner) {
                mongoApi.upsertLeader_RealTime({"user" : user["user"], "numsLeft": "2"}, function (winners) {
                    socket.emit('deliverBingo', true);
                });
            });*/
            socket.on('calculateLeaderboard_RealTime', function () {
                mongoApi.calculateLeaderboard_RealTime(function () {
                    mongoApi.getLeaderboard_RealTime(function (data) {
                        socket.emit('setLeaderboard_RealTime', data);
                        socket.broadcast.emit('setLeaderboard_RealTime', data);
                    });
                });
            });
            socket.on('getLeaderboard_RealTime', function(){
                mongoApi.getLeaderboard_RealTime(function (data) {
                        socket.emit('setLeaderboard_RealTime', data);
                        socket.broadcast.emit('setLeaderboard_RealTime', data);
                    });
            });
            socket.on('resetLeaderboard_RealTime', function(){
                socket.emit('resettedLeaderboard_RealTime', data);
                socket.broadcast.emit('resettedLeaderboard_RealTime', data);
            });
            socket.on('addLeader_RealTime', function(RTLeader){
                mongoApi.upsertLeader_RealTime(RTLeader, function (winners) {
                    socket.emit('setLeaderboard_RealTime', winners);
                    socket.broadcast.emit('setLeaderboard_RealTime', winners);
                });
            });

            /**
             * Call Number script integration: get, reset, callNewNumSet
             */
            socket.on('resetCalledNumbers', function () {
                mongoApi.resetCalledNumbers();
                socket.emit('resettedList');
                socket.broadcast.emit('resettedList');
            });
            socket.on('getCalledNumbers', function() {
                mongoApi.getCalledNumbers(function (numbers) {
                    if(numbers == [] || numbers.length == 0){
                        numbers = ["0"]; //set last num and called numbers to 0, to show no numbers called yet.
                    }
                    socket.emit('deliverCalledNumbers', numbers);
                    socket.broadcast.emit('deliverCalledNumbers', numbers);
                });
            });

            //Call new set of Nums:
            socket.on('callNewNumSet',function (sizeOfNumSet) {
                let calledNumSuccess = true;
                let randomNums = [];
                for (let x = 0; x < sizeOfNumSet; x++) {
                    console.log("iteration:", x);
                    mongoApi.getCalledNumbers(function (original_numbers) {
                        let randNum = callNumber.getValidRandomNumber(original_numbers);
                        if (randNum == -1 || randNum == 0) {
                            console.log("Error - randNum error");
                            socket.emit('calledNumsFull');
                            socket.broadcast.emit('calledNumsFull');
                            return;
                        }
                        if (randomNums.indexOf(randNum) == -1) {
                            randomNums.push(randNum);
                        }else{
                            x++;
                        }
                    });
                }
                if (randomNums != []) {
                    mongoApi.pushCalledNumSet(randomNums);
                    console.log("randomNums:", randomNums);
                } else {
                    console.log("Error - calledNumber list error");
                    calledNumSuccess = false;
                }

                console.log("calledNum success:", calledNumSuccess);
                if (calledNumSuccess) {
                    mongoApi.getCalledNumbers(function (new_numbers) {
                        socket.emit('deliverCalledNumbers', new_numbers);
                        socket.broadcast.emit('deliverCalledNumbers', new_numbers);
                    });
                } else {
                    mongoApi.getCalledNumbers(function (original_numbers) {
                        socket.emit('deliverCalledNumbers', original_numbers);
                        socket.broadcast.emit('deliverCalledNumbers', original_numbers);
                    });
                }
            });
        });
  });


    let userNames = (function () {
        let names = {};

        let claim = function (name) {
            if (!name || names[name]) {
                return false;
            } else {
                names[name] = true;
                return true;
            }
        };

        // find the lowest unused "guest" name and claim it
        let getGuestName = function () {
            let name,
                nextUserId = 1;

            do {
                name = 'Guest ' + nextUserId;
                nextUserId += 1;
            } while (!claim(name));

            return name;
        };

        // serialize claimed names as an array
        let get = function () {
            let res = [];
            for (let user in names) {
                res.push(user);
            }

            return res;
        };

        let free = function (name) {
            if (names[name]) {
                delete names[name];
            }
        };

        return {
            claim: claim,
            free: free,
            get: get,
            getGuestName: getGuestName
        };
    }());
    app.use(bodyParser.urlencoded ({
        extended: true
    }));

    app.use(bodyParser.json());


    var adminClient = ldap.createClient({
        url: 'ldap://iuserldap.nat.bt.com'
    });

    var serverLdap = ldap.createServer();

    serverLdap.listen(389, function() {
        console.log('server is up');
    });

    app.post('/activeTickets', function(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let btDN = 'CN=' + username + ',OU=employee,OU=btplc,DC=iuser,DC=iroot,DC=adidom,DC=com';

        adminClient.bind(btDN, password, function(err) {

            if (err !== null) {

                if (err.name === "InvalidCredentialsError") {
                    res.sendStatus(401);
                } else {
                    res.send("Unknown error: " + JSON.stringify(err));
                }
            } else {
                res.send(JSON.stringify(generateSessionID(username, password)));
            }
        });

        function generateSessionID(username, password) {
            var milliseconds = Date.now();
            sessionID = username + milliseconds + password;
            return crypto.createHmac('sha256', generateKey()).update(sessionID).digest('hex');
        }

        function generateKey() {
            return crypto.randomBytes(32).toString('base64');
        }

    });


};
