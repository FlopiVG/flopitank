import { BaseEntity } from "./Base";
import { IBulletEntity } from "./IBullet";
import { IPlayerEntity } from "./IPlayer";

export class BulletEntity extends BaseEntity implements IBulletEntity {
  parent: IPlayerEntity;
  timer: number;

  constructor(props) {
    super(props);

    this.id = Math.random().toString();
    this.parent = props.parent;
    this.toRemove = false;
    this.timer = 0;
    this.spdX = Math.cos((props.angle / 180) * Math.PI) * 10;
    this.spdY = Math.sin((props.angle / 180) * Math.PI) * 10;
  }

  update() {
    if (this.timer++ > 40) {
      this.toRemove = true;
    }
    this.collisionEntity();
    super.update();
  }
}
