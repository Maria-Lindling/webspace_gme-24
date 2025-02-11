"use strict" ;
const LOCALHOST   = "127.0.0.1" ; // 192.168.189.59
const LOCALPORT   = 80 ; // 80
const SCORESHEET  = __dirname + '/scoresheet.txt' ;

/*************************/
/****** BASIC SETUP ******/
/*************************/

var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.get('/',(req, res) => { res.sendFile(__dirname + '/client/index.html'); });

app.use('/client/',express.static(__dirname + '/client/'));

/*************************/
/******* FILESYSTEM ******/
/*************************/

const fs = require('node:fs');

/*************************/
/******* SOCKET.IO *******/
/*************************/

var incrementalId = 0 ;
const SOCKET_LIST = {};

var io = require('socket.io')(server);
io.sockets.on('connection', (socket) => {

  SOCKET_LIST[incrementalId] = socket;
  incrementalId++ ;
  let timeOfConnection = new Date() ;
  console.log( `[${timeOfConnection.getHours()}:${timeOfConnection.getMinutes()}:${timeOfConnection.getSeconds()}] New user connected.`);

  socket.on('uploadScore',(data) => {
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] <<< "${data}"`);

    fs.appendFile(SCORESHEET, `${data}\n`, err => {
      if (err) {
        console.error(err);
      } else {
        let msg = "Score successfully uploaded!" ;
        timestamp = new Date() ;
        console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] >>> "${msg}"`);
        socket.emit( 'writeToConsole', msg );
      }
    });
  });

  socket.on('logToServer',(data) => {
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] <<< "${data}"`);
  });

  socket.on('disconnect',() => {
    delete SOCKET_LIST[socket.id] ;
    let timeOfDisconnect = new Date() ;
    console.log( `[${timeOfDisconnect.getHours()}:${timeOfDisconnect.getMinutes()}:${timeOfDisconnect.getSeconds()}] User disconnected.`);
  } ) ;
});

server.listen( LOCALPORT, LOCALHOST );

console.log(
  "Server started and listening on: " +
  `http://${LOCALHOST}:${LOCALPORT}/${
  ( LOCALHOST == "127.0.0.1" && LOCALPORT == 80 ) ? " | http://localhost/" : ""
}`) ;