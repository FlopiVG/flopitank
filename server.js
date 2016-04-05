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

// Cambiar en caso de tener que cambiar tambien en cliente
var WIDTH = 500;
var HEIGHT = 500;

var Entity = function(id){

    var self = {
        //== GENERAL ==\\
        id: id,
        x: 250,
        y: 250,
        width: 50,
        height: 50,
        type: "estandar",
        maxSpd: 5,
        spdX: 0,
        spdY: 0,
        //== KEYS == \\
        pressUP: false,
        pressDOWN: false,
        pressRIGHT: false,
        pressLEFT: false
    };

    self.update = function(){
        self.updateSpd();
        self.updatePosition();
    };

    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    };

    self.updateSpd = function(){
            if (self.pressRIGHT && self.x + self.width < WIDTH) self.spdX = self.maxSpd;
            else if (self.pressLEFT && self.x > 0) self.spdX = -self.maxSpd;
            else self.spdX = 0;

            if (self.pressUP && self.y > 0) self.spdY = -self.maxSpd;
            else if (self.pressDOWN && self.y + self.height < HEIGHT) self.spdY = self.maxSpd;
            else self.spdY = 0;
    };

    self.getDistance = function(entity2){	//return distance (number)
        var vx = self.x - entity2.x;
        var vy = self.y - entity2.y;
        return Math.sqrt(vx*vx+vy*vy);
    };

    self.testCollision = function(entity2){	//return if colliding (true/false)
        var rect1 = {
            x:self.x-self.width/2,
            y:self.y-self.height/2,
            width:self.width,
            height:self.height
        };
        var rect2 = {
            x:entity2.x-entity2.width/2,
            y:entity2.y-entity2.height/2,
            width:entity2.width,
            height:entity2.height
        };
        return testCollisionRectRect(rect1,rect2);
    };

    Entity.list[id] = self;

    return self;
};
Entity.list = {};

Entity.onConnect = function(socket){
    var entity = Entity(socket.id);

    socket.on('keyPress', function(data){
        if(data.inputId === 'left') {
            entity.pressLEFT = data.state;
        }
        else if(data.inputId === 'right') {
            entity.pressRIGHT = data.state;
        }
        else if(data.inputId === 'up') {
            entity.pressUP = data.state;
        }
        else if(data.inputId === 'down') {
            entity.pressDOWN = data.state;
        }
    });
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

testCollisionRectRect = function(rect1,rect2){
    return rect1.x <= rect2.x+rect2.width
        && rect2.x <= rect1.x+rect1.width
        && rect1.y <= rect2.y + rect2.height
        && rect2.y <= rect1.y + rect1.height;
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

    for(var i in Entity.list){
        Entity.list[i].update();
    }

    var pack = {
        entity: Entity.update()
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('client', pack);
    }
}, 1000/25);



