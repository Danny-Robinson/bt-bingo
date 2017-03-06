let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

let url = 'mongodb://localhost:27017/bingo';

class MongoApi {

    static test() {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            let doc = [
                {a: 1}, {a: 2}, {a: 3}
            ];
            this.insertDocuments(db, doc, function () {
                this.updateDocument(db, function () {
                    this.removeDocument(db, function () {
                        db.close();
                    });
                });
            });
        });
    };

    static insertDocuments(db, document, callback) {
        let collection = db.collection('documents');
        collection.insertMany(document, function (err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        });
    };


    static findDocuments(db, document, callback) {
        let collection = db.collection('documents');
        collection.find(document).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            callback(docs);
        });
    };

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
    };

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
    };

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

export default MongoApi;
