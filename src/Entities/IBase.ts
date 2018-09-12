export interface IBaseEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  maxSpeed: number;
  spdX: number;
  spdY: number;
  update: () => void;
  updatePosition: () => void;
  getDistance: (x: IBaseEntity) => number;
  collisionSide: (x: IBaseEntity, y: IBaseEntity) => string | null;
  testCollision: (x: IBaseEntity, y: IBaseEntity) => boolean;
}
