export class Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  maxSpd: number;
  spdX: number;
  spdY: number;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    type: string
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.maxSpd = 5;
    this.spdX = 0;
    this.spdY = 0;
  }

  update() {
    this.updatePosition();
  }

  updatePosition() {
    this.x += this.spdX;
    this.y += this.spdY;
  }

  getDistance(entity: Entity) {
    return Math.sqrt(
      Math.pow(this.x - entity.x, 2) + Math.pow(this.y - entity.y, 2)
    );
  }

  collisionSide(entityA: Entity, entityB: Entity): string | null {
    var vX = entityA.x + entityA.width / 2 - (entityB.x + entityB.width / 2),
      vY = entityA.y + entityA.height / 2 - (entityB.y + entityB.height / 2),
      // add the half widths and half heights of the objects
      hWidths = entityA.width / 2 + entityB.width / 2,
      hHeights = entityA.height / 2 + entityB.height / 2,
      colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          entityA.y += oY;
        } else {
          colDir = "b";
          entityA.y -= oY;
        }
      } else {
        if (vX > 0) {
          colDir = "l";
          entityA.x += oX;
        } else {
          colDir = "r";
          entityA.x -= oX;
        }
      }
    }
    return colDir;
  }

  testCollision(entityA: Entity, entityB: Entity) {
    return (
      entityA.x < entityB.x + entityB.width &&
      entityA.x + entityA.width > entityB.x &&
      entityA.y < entityB.y + entityB.height &&
      entityA.y + entityA.height > entityB.y
    );
  }
}
