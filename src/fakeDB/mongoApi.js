'use strict';
let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

let url = 'mongodb://localhost:27017/bingo';
const CalculateBingo = require("../../fakeDB/CalculateBingo");


class MongoApi {

    static addTicket(ticket, user){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                console.log("Connected successfully to server");
                MongoApi.insertTicket(db, ticket, user, function () {
                    db.close();
                });
            }
        });
    }

    static getAllTickets(callback){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                MongoApi.findDocuments(db, function (result) {
                    callback(result);
                });
            }
        });
        callback("");
    }

    static getUserTickets(user, callback){
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                MongoApi.findTicket(user, db, function (result) {
                    callback(result);
                });
            }
        });
        callback("");
    }

    static pushCalledNumber(number){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                MongoApi.getCalledNumbers(function (numbers) {
                    if(numbers.indexOf(number) === -1){
                        numbers.reverse();
                        numbers.push(number);
                        numbers.reverse();
                        MongoApi.setNumbers(numbers, db);
                        console.log("pushedNum Success: ", number, ", now: ", numbers);
                    }else {
                        console.log("MongoApi Error - Num already in list - ", number);
                    }
                });
            }
        });
    }
    static getCalledNumbers(callback){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('calledNumbers');
                collection.findOne({"numbers": {$exists : true}}, function(err, result) {
                    if (!result){
                        MongoApi.firstNumInsert(db,function(){});
                    } else {
                        callback(result["numbers"]);
                    }
                });
            }
        });
    }


    static setNumbers(numbers, db){
        let collection = db.collection('calledNumbers');
        collection.updateOne({ "numbers" : {$exists : true}}
            , { $set: { "numbers" : numbers} });
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
    * Gets the username from the existing sessionId value.
    **/
    static getUsernameFromSession(sessionId, callback) {
        MongoClient.connect(url, function(err, db) {
           if (err == null) {
                let collection = db.collection('users');
                let findBySession = {sessionId: sessionId};
                collection.findOne(findBySession, function (err, result) {
                    callback(result.username);
                });
           }
        });
    }


    /**
    * Stores the user session object to the database.
    * Session format: {"username":"611427411",
    *                  "password":"abcd",
    *                  "sessionId":"cc192d25b7cd12470c1a15d7d0295821792ad180fe1e12b6cca19e9a0655c19",
    *                  "userRole":"user"
    *                 }
    **/
    static storeUserSession(user, callback) {
        MongoClient.connect(url, function(err, db) {
            if (err == null) {
                let collection = db.collection('users');
                collection.insert(user, function(err, result) {
                     callback(result);
                });
            }
        });
    }


    /**
    * Removes the user sessionId from the database.
    **/
    static removeUserSession(sessionId, callback) {
        MongoClient.connect(url, function(err, db) {
            if (err == null) {
                let collection = db.collection('users');
                let deleteEntity = {sessionId: sessionId};
                collection.deleteOne(deleteEntity, function(err, result) {
                    if (err === null) {
                        callback(result);
                    }
                    callback("");
                });
            }
        });
        callback("");
    }


    static retrieveUserTypeFromSessionId(sessionId, callback) {
        MongoClient.connect(url, function(err, db) {
            if (err === null) {
                let collection = db.collection('users');
                let findBySession = {sessionId: sessionId};
                collection.findOne(findBySession, function(err, result) {
                    if (err === null) {
                        callback(result.userRole);
                    }
                    callback("");
                });

            }
        });

    }

    /**
     * Leaderboard get with calculations, etc.
     * @param callback
     */
    static getAllLeaderBoard(callback) {
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
     * Update/insert winner into All Time Leaderboard.
     * @param winner of type: (user, score).
     */
    static upsertWinnerToLeaderboard(winner) {
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('winners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    result = JSON.parse(result);
                    console.log("result:",result);
                    if(result.get(winner.user)!== null){
                        result.push(winner);
                        console.log("result:",result);
                    }
                    let resultArray = result.toArray();
                    console.log("result:",resultArray);
                    resultArray.push(winner);
                    console.log("result:",resultArray);
                    //collection.updateOne({"winners": {$exists: true}}, {$set: {"winners": [result]}});
                });
            }
        });
    }
    static getAllBingoNumbersLeft(callback){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOne({"winners": {$exists : true}}, function(err, result) {
                    callback(result);
                });
                //callback format: "winners": [{"user" : "w", "numsleft" : "x"}, {"user" : "y", "numsleft" : "z"}]
            }
        });
    }

    /**
     * update/ insert RTLeader to RTWinners collection.
     * @param RTleader - format: {"user": "x", "numsleft": "Y"}
     */
    static upsertRTLeader(RTleader, callback){
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('rtwinners');
                collection.findOne({"winners": {$exists: true}}, function (err, result) {
                    let temp_winners = result["winners"].slice();
                    let index = temp_winners.indexOf(RTleader);
                    if(index === -1) {
                        temp_winners.push(RTleader);
                        console.log("winners:", temp_winners);
                        collection.updateOne(result, {$set : {"winners": temp_winners}});
                        callback(temp_winners);
                    }else{
                        temp_winners[index] = RTleader;
                        console.log("Already added, changed score:", temp_winners);
                        collection.updateOne(result, {$set : {"winners": temp_winners}});
                        callback(temp_winners);
                    }
                });
            }
        });
    }


    static getBingo(user, callback){
        console.log(user);
        let result ="";
        MongoApi.getCalledNumbers(function (calledNums){
            MongoApi.getUserTickets(user, function (ticket) {
                if (ticket) {
                    result = CalculateBingo.isItBingo(calledNums, ticket);
                    callback(result);
                }
            });
        });

    }

    static findTicket(db, callback) {
        let collection = db.collection('tickets');
        collection.findOne(function(err, result) {
            console.log("Found ticket");
            console.log("0", result);
            callback(result);
        });
    }

    static insertTicket(db, ticket, user, callback) {
        let collection = db.collection('tickets');
        let doc = {};
        doc[user] = JSON.stringify(ticket);
        collection.insert(doc, function(err, result) {
            console.log("Inserted ticket");
            console.log(result);
            callback(result);
        });
    }

    static test() {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            let tick = [ [ [ '', '', 27, 39, '', 55, '', 70, 86 ],    [ 1, 15, '', '', '', '', 61, 71, 90 ], [ '', 19, 29, '', 46, 59, 63, '', '' ] ],
                [ [ '', 14, 20, 30, 40, '', '', 73, '' ],    [ '', 18, 22, 37, '', '', '', 79, 84 ],    [ 8, '', 28, '', 42, 53, 62, '', '' ] ],
                [ [ '', '', 21, 35, 44, 50, 68, '', '' ],    [ 5, '', 26, '', 48, '', '', 76, 81 ],    [ 7, 10, '', '', '', 52, 69, 77, '' ] ],
                [ [ '', '', '', 31, 43, 57, 60, '', 88 ],    [ 3, 11, 23, '', '', 58, '', '', 89 ],    [ '', 16, '', 33, 47, '', 65, 78, '' ] ],
                [ [ '', '', '', '', 45, 56, 64, 72, 83 ],    [ 4, 13, 25, 34, '', '', '', '', 85 ],    [ '', 17, '', 38, '', '', 67, 74, 87 ] ],
                [ [ 2, '', '', '', 41, 51, 66, '', 80 ],    [ 6, '', 24, 32, 49, '', '', 75, '' ],    [ 9, 12, '', 36, '', 54, '', '', 82 ] ] ]
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
        collection.insert(doc, function(err, result) {
            console.log("Inserted 3 documents into the collection");
            console.log(result);
            callback(result);
        });
    }

    static firstNumInsert(db, callback) {
        let collection = db.collection('calledNumbers');
        collection.insert({numbers: []}, function(err, result) {
            callback(result);
        });
    }

    static findDocuments(db, callback) {
        let collection = db.collection('tickets');
        collection.find().toArray(function(err, docs) {
            callback(docs);
        });
    }

    static findTicket(user, db, callback) {
        console.log(user.user);
        var key = user.user;
        var userObject = {};
        userObject[key] = {$exists:true};
        let collection = db.collection('tickets');
        collection.find(userObject).toArray(function (err, docs) {
            callback(docs);
        });
    }

    static updateDocument(db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a : 2 }
        , { $set: { b : 1 } }, function(err, result) {
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
    collection.deleteOne({ a : 3 }, function(err, result) {
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
}

module.exports = MongoApi;
