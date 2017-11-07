'use strict';
let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

let url = 'mongodb://localhost:27017/bingo';
const CalculateBingo = require("./CalculateBingo");


class MongoApi {

    /**
     * Ticket control
     *
     * @param ticket
     * @param user
     */

    static clearTickets(user){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                console.log("Connected successfully to server");
                let collection = db.collection('tickets');
                collection.deleteMany({[user]:{$exists:true}}, function (err, result) {
                    console.log("------------------------------------------------------------------------");
                    console.log(result);
                });
            }
        });
    }

    static addTicket(ticket, user) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                console.log("Connected successfully to server");
                MongoApi.insertTicket(db, ticket, user, function () {
                    db.close();
                });
            }
        });
    }
    static getAllTickets(callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                MongoApi.findDocuments(db, function (result) {
                    callback(result);
                });
            }
        });
        callback("");
    }
    static getUserTickets(user, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let userObject = {};
                userObject[user] = {$exists: true};
                let collection = db.collection('tickets');
                collection.find(userObject).toArray(function (err, docs) {
                    if(docs != null){
                        callback(docs);
                    }
                });
            }
        });
    }

    /**
     *
     * Called Numbers manipulation
     *
     *
     *
     *  @param randomNums
     */
    static pushCalledNumSet(randomNums) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                MongoApi.getCalledNumbers(function (numbers) {
                    for (let y = 0; y < randomNums.length; y++) {
                        let randomNum = randomNums[y];
                        if (numbers.indexOf(randomNum) == -1) {
                            numbers.reverse();
                            numbers.push(randomNum);
                            numbers.reverse();
                        } else {
                            console.log("MongoApi Error - Num already in list - ", randomNum);
                        }
                    }
                    MongoApi.setNumbers(numbers, db);
                });
            }
        });
    }

    /**
     * calledNumbers table format:
     * { "_id" : ObjectId("58e7582fdb445e29e4ee0686"), "numbers" : [ 11, 49, 23, 87, 6, 4, 75, 43 ] }
     *
     * @param callback
     */
    static getCalledNumbers(callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('calledNumbers');
                collection.findOne({"numbers": {$exists: true}}, function (err, result) {
                    if (!result) {
                        //Initialise calledNumbers table
                        MongoApi.firstNumInsert(db, function () { });
                    } else {
                        let numbers = result["numbers"];
                        if(numbers == null) {
                            console.log("Incorrect Mongo format: calledNumbers");
                            return;
                        }
                        callback(numbers);
                    }
                });
            }
        });
    }
    static setNumbers(numbers, db) {
        let collection = db.collection('calledNumbers');
        collection.updateOne({"numbers": {$exists: true}}
            , {$set: {"numbers": numbers}});
    }
    static resetCalledNumbers() {
        console.log("resettingNumbers");
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('calledNumbers');
                collection.updateOne({"numbers": {$exists: true}}, {$set: {"numbers": []}});
            }
        });
    }

    /**
     *
     * User Management
     *
     * Format:
     * { "_id" : ObjectId("58fa21cd35cafb180805a394"), "username" : "611218504", "sessionId" : "5d39bab174d1dc8b0ae82f1ace5cdcc5d64e7f40baf481fa54e61798cdc980f5", "userRole" : "user", "userWinnings" : 1056 }
     *
     *
     * Gets the username from the existing sessionId value.
     **/
    static getUsernameFromSessionId(sessionId, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                let findBySession = {sessionId: sessionId};
                collection.findOne(findBySession, function (err, result) {
                    if(err == null) {
                        callback(result.username);
                    }else{
                        console.log("username not found FromSessionID: ",sessionId);
                    }
                });
            }
        });
    }
    static getUserFromSessionId(sessionId, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                let findBySession = {sessionId: sessionId};
                collection.findOne(findBySession, function (err, result) {
                    if(err == null) {
                        console.log("user found:",result);
                        callback(result);
                    }else{
                        console.log("user not found FromSessionID: ",sessionId);
                    }
                });
            }
        });
    }
    static logAllUsersOut(){
        //Log all users out.
        MongoApi.getAllUsernames(function (listOfUsers) {
            for (let i = 0; i < listOfUsers.length; i++) {
                let username = listOfUsers[i][0];
                console.log("logging out:",username);
                MongoApi.logUserOut(username);
            }
        });
    }
    static logUserOut(username){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                console.log("logging UserOut:",username);
                let findByUsername = {username: username};
                collection.findOneAndUpdate(findByUsername, {$set: {"loggedIn": false}}, {upsert : true}, function (err, result) {
                    if(result == null || err != null){
                        /*If loggedIn not created:
                        user["loggedIn"] = false;
                        collection.insert(user, function (err, result) {
                            console.log("inserted db-createdLoggedIn-logged out");
                        });*/
                        console.log("'loggedIn' created, logged out");
                    }else if (err == null) {
                        console.log("updated db-updatedLoggedIn:",username);
                    }
                });
            }
        });
    }
    static userLoggedIn(user, callback){
        MongoClient.connect(url, function (err, db) {
            if (err == null && user != null) {
                let collection = db.collection('users');
                let findByUser = {username: user.username};
                collection.findOne(findByUser, function (err, result) {
                    if(err == null && result != null) {
                        let loggedIn = result.loggedIn;
                        if(loggedIn != null && loggedIn){
                            console.log("userLoggedIn",user.username);
                            callback(result.username == user.username);
                        }else{
                            callback(false);
                        }
                    }else{
                        console.log("username not logged in: ", user.username);
                        callback(false);
                    }
                });
            }
        });
    }
    static getAllUsernames(callback){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                collection.find().toArray(function (err, listOfUsers) {
                    if (err == null) {
                        let listOfUsernames = [];
                        for (let i = 0; i < listOfUsers.length; i++)
                        {
                            let user = listOfUsers[i].username;
                            listOfUsernames.push([user]);
                        }
                        callback(listOfUsernames);
                    }
                });
            }
        });
    }

    /**
     * Stores the user session object to the database.
     * Session format: {"username":"611427411",
    *                  "sessionId":"cc192d25b7cd12470c1a15d7d0295821792ad180fe1e12b6cca19e9a0655c19",
    *                  "userRole":"user"
    *                 }
     **/
    static storeUserSession(user, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                /*
                 * Allow Update of Session ID & LoggedIn in Mongo (and new inserts)
                 */
                let findByUsername = {username: user.username};
                if(user.username == null){
                    return;
                }
                console.log("storingSession:",user.username,user.userRole);
                collection.findOneAndUpdate(findByUsername, {$set: {"sessionId": user.sessionId, "loggedIn": true}}, function (err, result) {
                    if(result.value == null || err != null){
                        user["userRole"] = 'user';
                        user["userWinnings"] = "0";
                        user["loggedIn"] = true;
                        user["password"] = "";
                        collection.insert(user, function (err, result) {
                            console.log("inserted db");
                            callback(result);
                        });
                    }else if (err == null) {
                        console.log("updated db", user.sessionId);
                        callback(result);
                    }
                });
            }
        });
    }
    /**
     * Removes user sessionId from the database.
     **/
    static removeUserSession(sessionId, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('users');
                let deleteEntity = {sessionId: sessionId};

                collection.findOneAndUpdate(deleteEntity, {$set: {"sessionId": ""}}, function (err, result) {
                    console.log("removeSession-updated db", result);
                    callback(result);
                });
                /*collection.deleteOne(deleteEntity, function (err, result) {
                    if (err === null) {
                        callback(result);
                    }
                    callback("");
                });*/
            }
        });
        callback("");
    }
    static getUserTypeFromSessionId(sessionId, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('users');
                let findBySession = {sessionId: sessionId};
                collection.findOne(findBySession, function (err, result) {
                    if (err === null) {
                        callback(result.userRole);
                    }
                    callback("");
                });

            }
        });
    }
    static getUserTypeFromUsername(username, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('users');
                let findBySession = {username: username};
                collection.findOne(findBySession, function (err, result) {
                    if (err === null) {
                        callback(result.userRole);
                    }
                });

            }
        });
    }

    /**
     * Manipulation of DB: each user's "winnings" in the "users" DB
     * @param user
     * @param callback
     */
    static getUserWinnings(user, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('winners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if(result.winners == null) {
                        console.log("Incorrect Mongo format: winners");
                        return;
                    }
                    let winners = result.winners;
                    for (let i = 0; i < winners.length; i++) {
                        if (winners[i].user == user) {
                            console.log("winner found",winners[i]);
                            callback(winners[i].winnings);
                        }
                    }
                    callback(0);
                });
            }
        });
    }
    static updateUserWinnings(username, winnings) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let findByUsername = {username: username};
                let collection = db.collection('users');
                if (winnings != null || winnings == "NaN") {
                    collection.findOneAndUpdate(findByUsername, {$set: {"userWinnings": winnings}});
                }else {
                    collection.findOneAndUpdate(findByUsername, {$set: {"userWinnings": 0}});
                }
            }
        });
    }
    static resetUserWinnings() {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                console.log("resettingUserWinnings");
                let collection = db.collection('users');
                collection.updateMany({}, {$set: {"userWinnings": 0}});
            }
        });
    }

    /**
     * All-Time Leaderboard manipulation:
     *
     * Format:
     * { "_id" : ObjectId("58f8d4a90e4ab368464bb058"), "winners" : [ { "user" : "611218504", "winnings" : 1056 } ] }
     *
     *
     * @param callback
     */
    static getLeaderBoard_AllTime(callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('winners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    callback(result);
                });
            }
        });
    }
    /**
     * update/ insert All Time Leader to Winners collection.
     * @param leader_AllTime - format: {"user": "x", "numsleft": "Y"}
     */
    static upsertLeader_AllTime(leader_AllTime, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {

                let collection = db.collection('winners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if (err === null) {
                        if(result["winners"] == null) {
                            console.log("Incorrect Mongo format: winners");
                            return;
                        }
                        let winners = result["winners"].slice();

                        for (let i = 0; i < winners.length; i++) {
                            if (winners[i].user == leader_AllTime.user) {
                                winners[i] = leader_AllTime;
                                collection.updateOne(result, {$set: {"winners": winners}});
                                callback(winners);
                                return;
                            }
                        }
                        winners.push(leader_AllTime);
                        collection.updateOne(result, {$set: {"winners": winners}});
                        callback(winners);
                    }
                });
            }
        });
    }
    static resetLeaderboard_AllTime() {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('winners');
                collection.findOneAndUpdate({"winners": {$exists: true}}, {$set: {"winners": []}});
                // resets the users' winnings in 'users' db.
                MongoApi.resetUserWinnings();
            }
        });
    }

    /**
     * Real-Time Leaderboard manipulation:
     *
     * Format:
     * { "_id" : ObjectId("596dd8799e7de2f803bad51d"), "winners" : [ { "user" : "611218504", "numsLeft" : 12 }, { "user" : "611176835", "numsLeft" : 13 } ] }
     *
     * @param callback
     */
    static getLeaderboard_RealTime(callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if(result["winners"] == null) {
                        console.log("Incorrect Mongo format: rtwinners");
                        return;
                    }
                    let winners = result["winners"].sort(function (a, b) {
                        return parseFloat(a.numsLeft) - parseFloat(b.numsLeft);
                    });
                    result["winners"] = winners;
                    callback(result);
                });
            }
        });
    }
    /**
     * update/ insert RTLeader to RTWinners table.
     * @param leader_RealTime - format: {"user": "x", "numsLeft": Y}
     */
    static upsertLeader_RealTime(leader_RealTime, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');

                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if(result["winners"] == null) {
                        console.log("Incorrect Mongo format: rtwinners");
                        return;
                    }
                    let winners = result["winners"].slice();
                    let index = winners.indexOf(leader_RealTime);
                    if (index === -1) {
                        winners.push(leader_RealTime);
                    } else {
                        winners[index] = leader_RealTime; //Already added, change score
                    }
                    collection.updateOne(result, {$set: {"winners": winners}});
                    callback(winners);
                });
            }
        });
    }
    //For every user in rtwinners: get userTickets and calledNumbers to calculate real-time scores.
    //Get nums remaining and calculate real-time scores, then update collection.
    /*static calculateLeaderboard_RealTime() {
        MongoApi.getAllUsernames(function (listOfUsers) {
            MongoApi.getCalledNumbers(function (calledNums) {

                for (let i = 0; i < listOfUsers.length; i++) {
                    let username = listOfUsers[i][0];

                    MongoApi.getUserTickets(username, function (ticketBook) {
                        if ((ticketBook != null || ticketBook != "") && ticketBook) {
                            let user = {user: username};
                            user["numsLeft"] = CalculateBingo.numsRemaining(calledNums, ticketBook);
                            let userFound = false;
                            let winners = MongoApi.getWinners_RealTime();

                            for (let i = 0; i < winners.length; i++) {
                                if (winners[i].user == user.user) {
                                    winners[i] = user;
                                    userFound = true;
                                    break;
                                }
                            }
                            if (!userFound) {
                                winners.push(user); //add new user to winners
                            }
                            MongoApi.updateWinners_RealTime(winners);
                        } else {
                            console.log("error getting User's tickets", username);
                        }
                    });
                }
            });
        });
    }*/
    static getWinners_RealTime(callback){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if(result["winners"] == null) {
                        console.log("Incorrect Mongo format: rtwinners");
                        return;
                    }
                    let winners = result["winners"].slice();
                    callback(winners);
                });
            }
        });
    }
    static updateWinners_RealTime(winners){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    if(result["winners"] == null) {
                        console.log("Incorrect Mongo format: rtwinners");
                        return;
                    }
                    collection.updateOne(result, {$set: {"winners": winners}});
                });
            }
        });
    }
    static resetLeaderboard_RealTime() {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOneAndUpdate({"winners": {$exists: true}}, {$set: {"winners": []}});
                //MongoApi.resetUserWinnings();
            }
        });
    }


    /**
     * BINGO, Tickets, Jackpot, etc.:
     *
     *
     *
     * @param user
     * @param callback
     */
    static getBingo(user, callback) {
        MongoApi.getCalledNumbers(function (calledNums) {
            MongoApi.getUserTickets(user, function (tickets) {
                if (tickets != null && tickets) {
                    let isItBingo = CalculateBingo.isItBingo(calledNums, tickets);
                    callback(isItBingo);
                }
                //getUserTickets returns multiple instances, cannot callback here, probably socket issues.
                //console.log("Not bingo");
                //callback(false);
            });
        });
    }

    static insertTicket(db, ticket, user, callback) {
        let collection = db.collection('tickets');
        let doc = {};
        doc[user] = JSON.stringify(ticket);
        collection.insert(doc, function (err, result) {
            console.log("Inserted ticket");
            console.log(result);
            callback(result);
        });
    }

    static getCurrentJackpot(callback) {
        MongoApi.getNumTicketsPurchased(function (totalTicketsNum) {
            callback(totalTicketsNum / 2);
        });
    }

    /**
     * numTicketsPurchased format:
     * { "_id" : ObjectId("5970bc3723174d23ace78a78"), "user" : "611218504", "numTickets" : 3 }
     * { "_id" : ObjectId("5970c69f6aa0c23f50a6befd"), "user" : "611176835", "numTickets" : 6 }
     *
     * @param callback
     */
    static getNumTicketsPurchased(callback){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                let collection = db.collection('numTicketsPurchased');
                collection.find().toArray(function (err, numTicketsPurchasedList) {
                    if (err == null) {
                        let totalTicketsNum = 0;
                        for (let i = 0; i < numTicketsPurchasedList.length; i++) {
                            let ticketsPurchased = numTicketsPurchasedList[i]['numTickets'];
                            if(ticketsPurchased == null) {
                                console.log("Incorrect Mongo format: numTicketsPurchased");
                                return;
                            }
                            totalTicketsNum += parseInt((ticketsPurchased).toString());
                        }
                        callback(totalTicketsNum);
                    }
                });
            }
        });
    }

    static test() {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            let tick = [[['', '', 27, 39, '', 55, '', 70, 86], [1, 15, '', '', '', '', 61, 71, 90], ['', 19, 29, '', 46, 59, 63, '', '']],
                [['', 14, 20, 30, 40, '', '', 73, ''], ['', 18, 22, 37, '', '', '', 79, 84], [8, '', 28, '', 42, 53, 62, '', '']],
                [['', '', 21, 35, 44, 50, 68, '', ''], [5, '', 26, '', 48, '', '', 76, 81], [7, 10, '', '', '', 52, 69, 77, '']],
                [['', '', '', 31, 43, 57, 60, '', 88], [3, 11, 23, '', '', 58, '', '', 89], ['', 16, '', 33, 47, '', 65, 78, '']],
                [['', '', '', '', 45, 56, 64, 72, 83], [4, 13, 25, 34, '', '', '', '', 85], ['', 17, '', 38, '', '', 67, 74, 87]],
                [[2, '', '', '', 41, 51, 66, '', 80], [6, '', 24, 32, 49, '', '', 75, ''], [9, 12, '', 36, '', 54, '', '', 82]]]
            let doc =
                    {ticket: JSON.stringify(tick)}
                ;
            MongoApi.insertDocuments(db, doc, function () {
                db.close;
            });
        });
    };

    static insertDocuments(db, doc, callback) {
        let collection = db.collection('test');
        collection.insert(doc, function (err, result) {
            console.log("Inserted 3 documents into the collection");
            console.log(result);
            callback(result);
        });
    }

    static firstNumInsert(db, callback) {
        let collection = db.collection('calledNumbers');
        collection.insert({numbers: []}, function (err, result) {
            callback(result);
        });
    }

    static findDocuments(db, callback) {
        let collection = db.collection('tickets');
        collection.find().toArray(function (err, docs) {
            callback(docs);
        });
    }

    static updateDocument(db, callback) {
        // Get the documents collection
        let collection = db.collection('documents');
        // Update document where a is 2, set b equal to 1
        collection.updateOne({a: 2}
            , {$set: {b: 1}}, function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated the document with the field a equal to 2");
                callback(result);
            });
    }

    static removeDocument(db, callback) {
        // Get the documents collection
        let collection = db.collection('documents');
        // Delete document where a is 3
        collection.deleteOne({a: 3}, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Removed the document with the field a equal to 3");
            callback(result);
        });
    }

    static indexCollection(db, callback) {
        db.collection('documents').createIndex(
            {"a": 1},
            null,
            function (err, results) {
                console.log(results);
                callback();
            }
        );
    };

    /**
     * Num Tickets format: "user" : "username", "numTickets": x
     * @param username
     * @param number
     */
    static addNumTickets(username, number) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                MongoApi.insertNumTickets(db, username, number, function () {
                    db.close();
                });
            }
        });
    }
    static insertNumTickets(db, user, number, callback) {
        let collection = db.collection('numTicketsPurchased');
        let doc = {"user": user, "numTickets": parseInt(number)};
        //let doc = {};
        //doc[user] = number;
        collection.insert(doc, function (err, result) {
            console.log("Inserted number of tickets purchased");
            console.log(result);
            callback(result);
        });
    }
}

module.exports = MongoApi;