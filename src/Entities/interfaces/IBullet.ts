import { IBaseEntity } from "./IBase";
import { IPlayerEntity } from "./IPlayer";

export interface IBulletEntity extends IBaseEntity {
  parent: IPlayerEntity;
  timer: number;
}
