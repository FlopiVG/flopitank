/**
 * Created by FlopiVG on 04/04/2016.
 */

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));

serv.listen(5000);
console.log("Server started http://localhost:5000");

var Player = function(){

    var self = {
        x: 250,
        y: 250,
        width: 25,
        height: 25
    };

    return self;
};

SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    console.log(socket.id);

    socket.on('disconnected', function(){
        delete SOCKET_LIST[socket.id];
    })

});


