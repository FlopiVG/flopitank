import { IBaseEntity } from "./IBase";

export interface IPlayerEntity extends IBaseEntity {
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
  calculateBaseAngle: () => void;
  shootBullet: (angle: number) => void;
  updateSpeed: () => void;
  collisionEntity: () => void;
}
