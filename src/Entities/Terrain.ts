import { BaseEntity } from "./Base";
import { ITerrainEntity } from "./interfaces/ITerrain";
import { WIDTH, HEIGHT } from "../constant";

export class TerrainEntity extends BaseEntity implements ITerrainEntity {
  constructor(props) {
    super(props);

    this.width = WIDTH / 10;
    this.height = HEIGHT / 10;
  }

  setImg() {
    const rand = Math.floor(Math.random() * 4 + 1);
    if (rand === 1) this.img = "dirt";
    else if (rand === 2) this.img = "grass";
    else if (rand === 3) this.img = "sand";
    else if (rand === 4) this.img = "snow";
  }
}
