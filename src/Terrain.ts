import { Entity } from "./Entity";
import { HEIGHT, WIDTH } from "./constants";

export class Terrain extends Entity {
    img: string;

    constructor(x: number, y: number, type: string) {
        super(String(Math.random()), x, y, WIDTH / 10, HEIGHT / 10, type);
        this.img = this.getRandomImg();
    }

    getRandomImg(){
        var rand = Math.floor(Math.random() * 4 + 1);
        if(rand === 1) return "dirt";
        else if (rand === 2) return "grass";
        else if(rand === 3) return "sand";
        else return "snow";
    };
}
