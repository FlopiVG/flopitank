import { Entity } from "./Entity";
import { Player } from "./Player";
import { Players } from "./Players";
import { Terrains } from "./Terrains";

export class Bullet extends Entity {
  parent: Player;
  toRemove: boolean;
  timer: number;
  spdX: number;
  spdY: number;

  terrains: Terrains;


  constructor(player: Player, angle: number, terrains: Terrains) {
    super(
      String(Math.random()),
      player.x + player.width / 2 - player.width / 2 / 2,
      player.y + player.height / 2 - player.height / 2 / 2,
      player.width / 2,
      player.height / 2,
      "bullet"
    );

    this.parent = player;
    this.toRemove = false;
    this.timer = 0;
    this.spdX = Math.cos((angle / 180) * Math.PI) * 10;
    this.spdY = Math.sin((angle / 180) * Math.PI) * 10;

    this.terrains = terrains;
  }

  update() {
    if (this.timer++ > 40) {
      this.toRemove = true;
    }
    this.collisionEntity();
    super.update();
  }

  collisionEntity() {
    /*
    Comprobamos si la bala toca algun player, si toca algun player le resta 1 vida, si toca al mismo player que
    lanza la bala no hace nada.
     */
    for (const terrain of Object.values(this.terrains.getAll())) {
      if (this.testCollision(terrain, this) && terrain.type === "obstaculo") {
        // handle collision. ex: hp--;
        this.toRemove = true;
      }
    }
  }
}
