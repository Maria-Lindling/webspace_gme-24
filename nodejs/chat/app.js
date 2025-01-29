const LOCALHOST = "127.0.0.1" ;
const LOCALPORT = 80 ; // 4141

/*************************/
/****** BASIC SETUP ******/
/*************************/
var express = require('express');
var app = express();

var server = require('http').createServer(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));


console.log(`Server started.`);

/*************************/
/******* SOCKET.IO *******/
/*************************/

SOCKET_LIST = {};

var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){

  console.log('new user!');
  var socketId = Math.random();
  SOCKET_LIST[socketId] = socket;

  socket.on('sendMsgToServer',function(data){
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] ${data}`);
    for(var i in SOCKET_LIST){ SOCKET_LIST[i].emit('addToChat', data); }
  });

  socket.on('disconnect',function(){delete SOCKET_LIST[socket.id];});
});

server.listen(LOCALPORT);


console.log(`Server listening on: http://${LOCALHOST}:${LOCALPORT}`);