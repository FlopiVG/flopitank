import { IBaseEntity } from "./IBase";

export abstract class BaseEntity implements IBaseEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  maxSpeed: number;
  spdX: number;
  spdY: number;
  toRemove: boolean;
  img: string;

  constructor(props) {
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.toRemove = false;
    this.type = props.type;
    this.maxSpeed = 5;
    this.spdX = 0;
    this.spdY = 0;
    this.img = "";
  }

  update() {
    this.updatePosition();
  }

  updatePosition() {
    this.x += this.spdX;
    this.y += this.spdY;
  }

  getDistance(entity) {
    return Math.sqrt(
      Math.pow(this.x - entity.x, 2) + Math.pow(this.y - entity.y, 2)
    );
  }

  collisionSide(entity) {
    var vX = this.x + this.width / 2 - (entity.x + entity.width / 2),
      vY = this.y + this.height / 2 - (entity.y + entity.height / 2),
      hWidths = this.width / 2 + entity.width / 2,
      hHeights = this.height / 2 + entity.height / 2,
      colDir = null;

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          this.y += oY;
        } else {
          colDir = "b";
          this.y -= oY;
        }
      } else {
        if (vX > 0) {
          colDir = "l";
          this.x += oX;
        } else {
          colDir = "r";
          this.x -= oX;
        }
      }
    }
    return colDir;
  }

  testCollision(entity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    );
  }

  collisionEntity() {
    console.log("To implement...");
    /*
    for(var i in Terrain.list){
            var t = Terrain.list[i];
            if(self.testCollision(self, t) && t.type === "obstaculo"){
                var check = self.collisionSide(self, t);
                if(check === 'b' || check === 't') self.spdY = 0;
                if(check === 'l' || check === 'r') self.spdX = 0;
            }
        }

         Comprobamos si el player toca alguna bala, si toca alguna bala que no sea suya le resta 1 vida.

        for(var i in Bullet.list){
          var b = Bullet.list[i];
          if(self.testCollision(self, b) && b.parent.id !== self.id){
              // handle collision. ex: hp--;
              self.life--;
              if(self.life <= 0) self.toRemove = true;
              b.toRemove = true;
          }
      }

       Comprobamos si el player toca a otro player, si lo toca no podra avanzar por la posicion del otro player

      for(var i in Player.list) {
          var p = Player.list[i];
          if (self.testCollision(self, p) && self.id !== p.id) {
              var check = self.collisionSide(self, p);
              if (check === 'b' || check === 't') self.spdY = 0;
              if (check === 'l' || check === 'r') self.spdX = 0;
          }
      }
    */
  }
}
