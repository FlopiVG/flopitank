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

var Entity = function(id){

    var self = {
        id: id,
        x: 250,
        y: 250,
        width: 25,
        height: 25,
        type: "estandar"
    };

    /*self.draw = function(canvas){
        canvas.save();
        canvas.fillRect(self.x, self.y, self.width, self.height);
        canvas.restore();
    };*/

    Entity.list[id] = self;

    return self;
};
Entity.list = {};

Entity.onConnect = function(socket){
    var entity = Entity(socket.id);
};

Entity.onDisconnect = function(socket){
    delete Entity.list[socket.id];
};

Entity.update = function(socket){
    var pack = [];

    for (var i in Entity.list){
        var entity = Entity.list[i];
        pack.push({
            x: entity.x,
            y: entity.y,
            width: entity.width,
            height: entity.height
        });
    }

    return pack;
};

SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Entity.onConnect(socket);

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        Entity.onDisconnect(socket);
    })

});

//Loop del juego
setInterval(function(){
    var pack = {
        entity: Entity.update()
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('client', pack);
    }
}, 1000/25);


