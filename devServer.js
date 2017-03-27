const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const createServer = require('./server');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.urlencoded ({
    extended: true
}));

app.use(bodyParser.json());

createServer(app, port);

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
