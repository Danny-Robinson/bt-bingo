'use strict';
let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

let url = 'mongodb://localhost:27017/bingo';
const CalculateBingo = require("./CalculateBingo");
var calledNums = [5,22,38,42,72,10,13,25,39,46,56,53,61,78,90,1,20,41,84];


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
                let collection = db.collection('bingo');
                collection.findOne({"numbers": {$exists : true}}, function(err, result) {
                    //assert(result["numbers"] != "");
                    callback(result["numbers"]);
                });
            }
        });
    }
    static setNumbers(numbers, db){
        let collection = db.collection('bingo');
        collection.updateOne({ "numbers" : {$exists : true}}
            , { $set: { "numbers" : numbers} });
    }
    static resetCalledNumbers() {
        console.log("resettingNumbers");
        MongoClient.connect(url, function (err, db) {
            if (err === null) {
                let collection = db.collection('bingo');
                collection.updateOne({"numbers": {$exists: true}}, {$set: {"numbers": []}});
            }
        });
    }

    static getBingo(user, callback){
        console.log(user);
        let result ="";
        let calledNums = MongoApi.getCalledNumbers();
        MongoApi.getUserTickets(user, function (ticket) {
            if (ticket) {
                result = CalculateBingo.isItBingo(calledNums, ticket);
                callback(result);
            }
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
