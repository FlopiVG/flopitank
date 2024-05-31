import { Bullet } from "./Bullet";
import { Bullets } from "./Bullets";
import { Entity } from "./Entity";
import { Players } from "./Players";
import { Terrains } from "./Terrains";
import { HEIGHT, WIDTH } from "./constants";

export class Player extends Entity {
  mouseAngle: number;
  attackDelay: number;
  life: number;
  toRemove: boolean;
  baseAngle: number;
  pressUP: boolean;
  pressDOWN: boolean;
  pressRIGHT: boolean;
  pressLEFT: boolean;
  pressATTACK: boolean;

  bullets: Bullets;
  terrains: Terrains;
  players: Players;


  constructor(id: string, bullets: Bullets, terrains: Terrains, players: Players) {
    super(id, 250, 250, 50, 50, "player");

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

    this.bullets = bullets;
    this.terrains = terrains;
    this.players = players;
  }

  update(): void {
    super.update();
    this.updateSpd();
    this.collisionEntity();
    if (this.pressATTACK) {
      if (this.attackDelay++ % 20 == 0) {
        // Delay del ataque
        this.shootBullet(this.mouseAngle);
      }
    }
    this.calculateBaseAngle();
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

  shootBullet(angle: number) {
    this.bullets.add(new Bullet(this, angle, this.terrains));
  }

  updateSpd() {
    if (this.pressRIGHT && this.x + this.width < WIDTH) this.spdX = this.maxSpd;
    else if (this.pressLEFT && this.x > 0) this.spdX = -this.maxSpd;
    else this.spdX = 0;

    if (this.pressUP && this.y > 0) this.spdY = -this.maxSpd;
    else if (this.pressDOWN && this.y + this.height < HEIGHT)
      this.spdY = this.maxSpd;
    else this.spdY = 0;
  }

  collisionEntity(){
    for(const terrain of Object.values(this.terrains.getAll())){
        if(this.testCollision(this, terrain) && terrain.type === "obstaculo"){
            var check = this.collisionSide(this, terrain);
            if(check === 'b' || check === 't') this.spdY = 0;
            if(check === 'l' || check === 'r') this.spdX = 0;
        }
    }
    /*
     Comprobamos si el player toca alguna bala, si toca alguna bala que no sea suya le resta 1 vida.
     */
    for(const bullet of Object.values(this.bullets.getAll())){
        if(this.testCollision(this, bullet) && bullet.parent.id !== this.id){
            // handle collision. ex: hp--;
            this.life--;
            if(this.life <= 0) this.toRemove = true;
            bullet.toRemove = true;
        }
    }
    /*
     Comprobamos si el player toca a otro player, si lo toca no podra avanzar por la posicion del otro player
     */
    for(const player of Object.values(this.players.getAll())) {
        if (this.testCollision(this, player) && this.id !== player.id) {
            var check = this.collisionSide(this, player);
            if (check === 'b' || check === 't') this.spdY = 0;
            if (check === 'l' || check === 'r') this.spdX = 0;
        }
    }
};
}
