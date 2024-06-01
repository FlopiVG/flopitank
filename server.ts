import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import { Players } from './src/Players';
import { Terrains } from './src/Terrains';
import { Bullets } from './src/Bullets';

const app = express();
const serv = http.createServer(app);
const io = socketIO(serv);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));

serv.listen(5000);
console.log("Server started http://localhost:5000");

const players = new Players();
const terrains = new Terrains();
const bullets = new Bullets();

var SOCKET_LIST: Record<string, SocketIO.Socket> = {};

io.sockets.on('connection', function(socket) {

    socket.id = String(Math.random());
    SOCKET_LIST[socket.id] = socket;

    players.onConnect(socket, bullets, terrains, players);

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        players.onDisconnect(socket);
    })

});

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
        bullet: bullets.update(),
        terrain: terrains.update()
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('client', pack);
    }
}, 1000/25);

terrains.onConnect();


