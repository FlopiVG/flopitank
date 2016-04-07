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
// ENTITY \\
var Entity = function(id, x, y, width, height, type){

    var self = {
        //== GENERAL ==\\
        id: id,
        x: x,
        y: y,
        width: width,
        height: height,
        type: type,
        maxSpd: 5,
        spdX: 0,
        spdY: 0
    };

    self.update = function(){
        self.updatePosition();
        //self.collisionEntity();
    };

    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    };

    self.getDistance = function(pt){	//return distance (number)
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    };

    /*self.collisionEntity = function(){ // Colision contra otra entidad
        for (var i in Entity.list){
            var entity = Entity.list[i];
            if (entity.id != self.id){
                if (self.testCollision(entity, self)) {
                    // Hacer algo cuando 2 player colisionan
                }
            }
        }
    };*/

    self.testCollision = function(entity1, entity2){
        return (entity1.x < entity2.x + entity2.width  && entity1.x + entity1.width  > entity2.x &&
        entity1.y < entity2.y + entity2.height && entity1.y + entity1.height > entity2.y);
    };

    Entity.list[id] = self;

    return self;
};
Entity.list = {};
Entity.update = function(socket){

};

// PLAYER \\
var Player = function(id){
    var self = Entity(id, 250, 250, 50, 50, 'player'); // id, x, y, width, height, type
    self.mouseAngle = 0;
    self.attackDelay = 0;
    self.life = 3;
    self.toRemove = false;
    //== KEYS == \\
    self.pressUP = false;
    self.pressDOWN = false;
    self.pressRIGHT = false;
    self.pressLEFT = false;
    self.pressATTACK = false;

    var super_update = self.update;
    self.update = function(){
        super_update();
        self.updateSpd();

        if(self.pressATTACK) {
            if(self.attackDelay++ % 20 == 0) { // Delay del ataque
                self.shootBullet(self.mouseAngle);
            }
        }
    };

    self.shootBullet = function(angle){
        Bullet(self, angle);
    };

    self.updateSpd = function(){
        if (self.pressRIGHT && self.x + self.width < WIDTH) self.spdX = self.maxSpd;
        else if (self.pressLEFT && self.x > 0) self.spdX = -self.maxSpd;
        else self.spdX = 0;

        if (self.pressUP && self.y > 0) self.spdY = -self.maxSpd;
        else if (self.pressDOWN && self.y + self.height < HEIGHT) self.spdY = self.maxSpd;
        else self.spdY = 0;
    };

    Player.list[id] = self;

    return self;
};
Player.list = {};
Player.onConnect = function(socket){
    var player = Player(socket.id);

    socket.on('keyPress', function(data){
        if(data.inputId === 'left') {
            player.pressLEFT = data.state;
        }
        else if(data.inputId === 'right') {
            player.pressRIGHT = data.state;
        }
        else if(data.inputId === 'up') {
            player.pressUP = data.state;
        }
        else if(data.inputId === 'down') {
            player.pressDOWN = data.state;
        }
        else if(data.inputId === 'attack'){
            player.pressATTACK = data.state;
        }
        else if(data.inputId === 'mouseAngle'){
            player.mouseAngle = data.state;
        }
    });
};
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
};
Player.update = function(socket){
    var pack = [];

    for (var i in Player.list){
        var player = Player.list[i];
        if(player.toRemove) delete Player.list[i];
        else {
            pack.push({
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height
            });
        }
    }

    return pack;
};

// BULLET \\
var Bullet = function(parent, angle){
    var id = Math.random();
    var self = Entity(
        id,
        parent.x + parent.width / 2 - parent.width / 2 / 2,
        parent.y + parent.height / 2 - parent.height / 2 / 2,
        parent.width/2,
        parent.height/2,
        "bullet"
    );
    self.id = Math.random();
    self.parent = parent;
    self.toRemove = false;
    self.timer = 0;
    self.spdX = Math.cos(angle/180*Math.PI) * 10;
    self.spdY = Math.sin(angle/180*Math.PI) * 10;

    var super_update = self.update;
    self.update = function(){
        if(self.timer++ > 40) {
            self.toRemove = true;
        }
        self.collisionEntity();
        super_update();
    };

    self.collisionEntity = function(){
        /*
        Comprobamos si la bala toca algun player, si toca algun player le resta 1 vida, si toca al mismo player que
        lanza la bala no hace nada.
         */
        for(var i in Player.list){
            var p = Player.list[i];
            if(self.testCollision(p, self) && self.parent.id !== p.id){
                // handle collision. ex: hp--;
                p.life--;
                if(p.life <= 0) p.toRemove = true;
                self.toRemove = true;
            }
        }
    };

    var super_updatePosition = self.updatePosition;
    self.updatePosition = function(){
        if(angle < 0) angle = 360 + angle;

        if(angle >= 45 && angle < 135) self.spdX = 0; //down
        else if(angle >= 135 && angle < 225) self.spdY = 0; //left
        else if(angle >= 225 && angle < 315) self.spdX = 0;	//up
        else self.spdY = 0; // right

        super_updatePosition();
    };

    Bullet.list[self.id] = self;
    return self;

};
Bullet.list = {};
Bullet.update = function(socket){
    var pack = [];
    for (var i in Bullet.list){
        var bullet = Bullet.list[i];
        if(bullet.toRemove) delete Bullet.list[i];
        else {
            pack.push({
                x: bullet.x,
                y: bullet.y,
                width: bullet.width,
                height: bullet.height
            });
        }
    }
    return pack;
};

SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    })

});

//Loop del juego
setInterval(function(){

    for(var i in Player.list){
        Player.list[i].update();
    }

    for(var i in Bullet.list){
        Bullet.list[i].update();
    }

    var pack = {
        player: Player.update(),
        bullet: Bullet.update()
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('client', pack);
    }
}, 1000/25);



