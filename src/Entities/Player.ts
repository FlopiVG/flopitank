import { IPlayerEntity } from "./IPlayer";
import { BaseEntity } from "./Base";
import { HEIGHT, WIDTH } from "../constant";

export class Player extends BaseEntity implements IPlayerEntity {
  mouseAngle: number;
  baseAngle: number;
  life: number;
  attackDelay: number;
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
}
