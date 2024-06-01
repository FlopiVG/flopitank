import { Terrain } from "./Terrain";

export class Terrains {
  private terrains: Record<string, Terrain>;

  constructor() {
    this.terrains = {};
  }

  public add(terrain: Terrain): void {
    this.terrains = { ...this.terrains, [terrain.id]: terrain };
  }

  public getAll(): Record<string, Terrain> {
    return this.terrains;
  }

  update() {
    const pack = [];
    for (const terrain of Object.values(this.terrains)) {
      pack.push({
        x: terrain.x,
        y: terrain.y,
        width: terrain.width,
        height: terrain.height,
        img: terrain.img,
        type: terrain.type,
      });
    }
    return pack;
  }

  onConnect(){
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            this.add(new Terrain(i * 50,j * 50, 'terrain'));
        }
    }
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(Math.random() * 100 > 75) this.add(new Terrain(i * 50,j * 50, 'obstaculo')); //25% de generar obstaculo
        }
    }
};
}
