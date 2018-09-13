import { IPlayerEntity } from "./IPlayer";
import { BaseEntity } from "./Base";
import { HEIGHT, WIDTH } from "../constant";

export class Player extends BaseEntity implements IPlayerEntity {
  mouseAngle: number;
  baseAngle: number;
  life: number;
  attackDelay: number;
  toRemove: boolean;
  pressUP: boolean;
  pressDOWN: boolean;
  pressRIGHT: boolean;
  pressLEFT: boolean;
  pressATTACK: boolean;

  constructor(props) {
    super(props);

    this.mouseAngle = 0;
    this.attackDelay = 0;
    this.life = 3;
    this.toRemove = false;
    this.baseAngle = 0;

    this.pressUP = false;
    this.pressDOWN = false;
    this.pressRIGHT = false;
    this.pressLEFT = false;
    this.pressATTACK = false;
  }

  calculateBaseAngle() {
    if (this.pressUP && this.pressLEFT) this.baseAngle = 45;
    else if (this.pressUP && this.pressRIGHT) this.baseAngle = -45;
    else if (this.pressDOWN && this.pressLEFT) this.baseAngle = 145;
    else if (this.pressDOWN && this.pressRIGHT) this.baseAngle = -145;
    else if (this.pressUP) this.baseAngle = 90;
    else if (this.pressDOWN) this.baseAngle = -90;
    else if (this.pressLEFT) this.baseAngle = 180;
    else if (this.pressRIGHT) this.baseAngle = -180;
  }

  shootBullet(angle) {
    console.log(`To implement ...`);
    console.log(`angle: ${angle}`);
  }

  updateSpeed() {
    if (this.pressRIGHT && this.x + this.width < WIDTH)
      this.spdX = this.maxSpeed;
    else if (this.pressLEFT && this.x > 0) this.spdX = -this.maxSpeed;
    else this.spdX = 0;

    if (this.pressUP && this.y > 0) this.spdY = -this.maxSpeed;
    else if (this.pressDOWN && this.y + this.height < HEIGHT)
      this.spdY = this.maxSpeed;
    else this.spdY = 0;
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
