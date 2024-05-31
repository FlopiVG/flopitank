import { Bullet } from "./Bullet";

export class Bullets {
  private Bullets: Record<string, Bullet>;

  constructor() {
    this.Bullets = {};
  }

  public add(bullet: Bullet): void {
    this.Bullets = { ...this.Bullets, [bullet.id]: bullet };
  }

  public getAll(): Record<string, Bullet> {
    return this.Bullets;
  }

  update() {
    const pack = [];
    for (const bullet of Object.values(this.getAll())) {
      if (bullet.toRemove) delete this.Bullets[bullet.id];
      else {
        pack.push({
          x: bullet.x,
          y: bullet.y,
          width: bullet.width,
          height: bullet.height,
        });
      }
    }
    return pack;
  }
}
