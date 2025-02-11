const LOCALHOST = "127.0.0.1" ; // 192.168.189.59
const LOCALPORT = 80 ; // 80

/*************************/
/****** BASIC SETUP ******/
/*************************/

var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client/',express.static(__dirname + '/client/'));

/*************************/
/******* SOCKET.IO *******/
/*************************/

var incrementalId = 0 ;
SOCKET_LIST = {};

var io = require('socket.io')(server);
io.sockets.on('connection', (socket) => {

  SOCKET_LIST[incrementalId] = socket;
  incrementalId++ ;

  socket.on('uploadScore',(data) => {
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] ${data}`);
    //for(var i in SOCKET_LIST){ SOCKET_LIST[i].emit('addToChat', data); }
  });

  socket.on('disconnect',() => {delete SOCKET_LIST[socket.id];});
});

server.listen( LOCALPORT, LOCALHOST );

console.log(
  "Server started and listening on: " +
  `http://${LOCALHOST}:${LOCALPORT}/${
  ( LOCALHOST == "127.0.0.1" && LOCALPORT == 80 ) ? " | http://localhost/" : ""
}`) ;