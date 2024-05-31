/**
 * Created by FlopiVG on 04/04/2016.
 */

var express = require('express');
const { Players } = require('./src/Players');
const { Terrains } = require('./src/Terrains');
const { Bullets } = require('./src/Bullets');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));

serv.listen(5000);
console.log("Server started http://localhost:5000");

const players = new Players();
const terrains = new Terrains();
const bullets = new Bullets();

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    players.onConnect(socket, bullets, terrains, players);

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        players.onDisconnect(socket);
    })

});

//Loop del juego
setInterval(function(){
    for (const player of Object.values(players.getAll())) {
        player.update();
    }

    for (const bullet of Object.values(bullets.getAll())) {
        bullet.update();
    }

    for (const terrain of Object.values(terrains.getAll())) {
        terrain.update();
    }

    var pack = {
        player: players.update(),
        bullet: players.update(),
        terrain: terrains.update()
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('client', pack);
    }
}, 1000/25);

//START THE SERVER
terrains.onConnect();


