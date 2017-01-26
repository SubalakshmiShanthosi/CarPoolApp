var flock = require('flockos');
var config = require('./config.js');
var express = require('express');
var fs = require('fs');

flock.setAppId(config.appId);
flock.setAppSecret(config.appSecret);

var app = express();
var mysql  = require('mysql');
var dbconn = mysql.createConnection({
  host     : 'localhost',
  user     : 'myusr',
  password : '123456',
  database : 'mydb'
});

dbconn.connect(function(err){
  if(err){
    console.log('Database connection error');
  }else{
    console.log('Database connection successful');
  }
});

// Listen for events on /events, and verify event tokens using the token verifier.
app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);

// Read tokens from a local file, if possible.

// save tokens on app.install
flock.events.on('app.install', function (event) {
    // tokens[event.userId] = event.token;
    var userTokenData = {id: event.userId, token: event.token};
console.log(userTokenData);
    dbconn.query('INSERT INTO users SET ?', userTokenData, function (err, response) {
        if (err) throw err;
        else {
            //Message user and ask for config data
        }
    });
});
flock.events.on('client.slashCommand',function (event) {
 var userTokenID=event.userId;
 var userTokenName=event.token;
 var stringToManipulate=event.text;
 stringToManipulate= stringToManipulate.split(" ");
 console.log(stringToManipulate);
 if(stringToManipulate[0]=="need")
 {  var inputParam= {place_need:stringToManipulate[1],needpplcount:stringToManipulate[2],time_need:stringToManipulate[3]};
 	dbconn.query('INSERT INTO need SET ?',inputParam,function(err,response){
 		if(err) throw err;
 		else
 		{

 		}
 	});
 }
 else
 {
 	var inputGiver={place:stringToManipulate[1],peoplecount:stringToManipulate[2],time_at:stringToManipulate[3]};
 	dbconn.query('INSERT INTO giver SET ?',inputGiver,function(err,response){
 		if(err) throw err;
 		else{

 		}
 	});
 }
});
// delete tokens on app.uninstall
flock.events.on('app.uninstall', function (event) {
   dbconn.query('DELETE FROM users WHERE id = ?', event.userId, function (error, results, fields) {
        if (error) throw error;
        console.log('deleted ');
    })
});

// Start the listener after reading the port from config
var port = config.port || 8888;
app.set('port', process.env.app_port || 8888)
app.listen(port, function () {
    console.log('Listening on port: ' + port);
});

// exit handling -- save tokens in token.js before leaving
process.on('SIGINT', process.exit);
process.on('SIGTERM', process.exit);

    
// save tokens on app.install


