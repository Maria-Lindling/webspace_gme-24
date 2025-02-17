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

  socket.on('changeMap', (event) => {
      let timestamp = new Date() ;
      console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] User requested new map.`);
      socket.emit( 'newMap', {
        map: [
        'DDDDZZDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', // 00
        'M                                                M', // 01
        'M                                                M', // 02
        'M    PPPPPPP             PPPPP         T         M', // 03
        'M                                     PPPP       M', // 04
        'M              PPPPPPP                           M', // 05
        'M                        PPPPPPP                 M', // 06
        'M         T                    T      PPPPP      M', // 07
        'M       PPPPP                  PPPPP           T M', // 08
        'A                   PPPPPPP                  PPPPM', // 09
        'AGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGM', // 10
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', // 11
      //'01234567890123456789012345678901234567890123456789'
      // 0         1         2         3         4
      ],
      tileset: "tileset",
      tileSize: 40,
      tiles: 'ADMPSEBGTZ',
      blocker: 'BDEMPS',
      background: "background",
      nonstatic: 'T',
      collectible: 'T'
    } )
    timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] New map dispatched.`);
  }
  ) ;

  socket.on('uploadScore',(event) => {
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] <<< "${event.requestData}"`);

    fs.appendFile(SCORESHEET, `${event.requestData}\n`, err => {
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

  socket.on('logToServer',(event) => {
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] <<< "${event.requestData}"`);
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