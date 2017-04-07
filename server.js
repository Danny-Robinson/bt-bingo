const path = require('path');
const express = require('express');
const mongoApi = require("./fakeDB/mongoApi");
const bingoTicket = require("./fakeDB/bingoTicket");
const callNumber = require("./fakeDB/callNumber");
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
                mongoApi.addTicket(bingoTicket.provideBook(data.number), data.user );
                socket.send('Purchased ticket for user: ' + data.user);
            });

            socket.on('getAllTickets',function(event){
                mongoApi.getAllTickets(function (ticket) {
                    if (ticket != "") {
                        socket.emit('deliverTicket', JSON.stringify(ticket));
                    }
                });
            });

            socket.on('storeSession', function(JSONuser) {
                var userObject = JSON.parse(JSONuser);
                userObject["userRole"] = 'user';
                mongoApi.storeUserSession(userObject, function (result) {
                    if (result != "") {
                        socket.emit('storedSession');
                    }
                });
            });


            socket.on('removeUserSession', function() {
                mongoApi.removeUserSession(function (user) {
                    if (user !== null) {
                        socket.emit('removedUserSession');
                    }
                });
            });

            socket.on('getBingo', function(user){
                mongoApi.getBingo(user, function (bingo) {
                    if (bingo) {
                        socket.emit('deliverBingo', bingo);
                    } else {
                        socket.emit('deliverBingo', false);
                    }
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
                        socket.emit('deliverUserNumsLeft', userList);
                    }
                });
            });

            /**
             * Leaderboard functionality:
             * Add new winner when: user clicks "BingoButton" > validate win > then 'insert/ increment' the user's score to the All-time Leaderboard.
             * Add real-time current-game winner: Access all users' tickets in the db > calculate: nums left to win, for each user > order by numsLeft > save to db.
             */
            socket.on('getWinnersLeaderboard', function () {
                mongoApi.getAllLeaderBoard(function (winners) {
                    socket.emit('leaderBoardInit', winners);
                });
            });
            socket.on('putNewWinner', function (winner) {
                mongoApi.upsertWinnerToLeaderboard(function (winners) {

                });
            });
            socket.on('getRTLeaderboard', function () {
                mongoApi.getRTLeaderboard(function (winners) {
                    socket.emit('RTleaderBoardInit', winners);
                });
            });
            socket.on('getAllBingoNumbersLeft', function(){
                mongoApi.getAllBingoNumbersLeft(function (data) {
                        socket.emit('deliverAllUserNumsLeft', data);
                    });
            });
            socket.on('addRTLeader', function(RTLeader){
                mongoApi.upsertRTLeader(RTLeader, function (winners) {
                    socket.emit('deliverAddedRTLeader', winners);
                });
            });

            /**
             * Call Number script integration: get, reset, callNewNum,
             */
            socket.on('resetCalledNumbers', function () {
                mongoApi.resetCalledNumbers();
                socket.emit('resettedList');
            });
            socket.on('callNewNum', function () {
                mongoApi.getCalledNumbers(function (original_numbers) {
                    let randNum = callNumber.getValidRandomNumber(original_numbers);
                    if (randNum !== -1) {
                        mongoApi.pushCalledNumber(randNum);
                        mongoApi.getCalledNumbers(function (new_numbers) {
                            new_numbers.reverse();
                            new_numbers.push(randNum);
                            new_numbers.reverse();
                            socket.emit('deliverCalledNumbers', new_numbers);
                        });
                    } else {
                        console.log("Error - calledNumber list Full");
                        socket.emit('deliverCalledNumbers', original_numbers);
                    }
                });
            });
            socket.on('getInitialCalledNums', function () {
                mongoApi.getCalledNumbers(function (numbers) {
                    socket.emit('deliverCalledNumbers', numbers);
                });
            });
            socket.on('getCalledNumbers', function() {
                mongoApi.getCalledNumbers(function (numbers) {
                    socket.emit('deliverCalledNumbers', numbers);
                });
            });
        });



  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });




    console.log(`Server running at http://localhost: ${port}`);
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
