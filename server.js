const path = require('path');
const express = require('express');
const mongoApi = require("./src/fakeDB/mongoApi");
const bingoTicket = require("./src/fakeDB/bingoTicket");
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const callNumber = require("./src/fakeDB/callNumber");


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
