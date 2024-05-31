import { Bullets } from "./Bullets";
import { Player } from "./Player";
import { Terrains } from "./Terrains";

export class Players {
  private Players: Record<string, Player>;

  constructor() {
    this.Players = {};
  }

  public add(players: Player): void {
    this.Players = { ...this.Players, [players.id]: players };
  }

  public getAll(): Record<string, Player> {
    return this.Players;
  }

  update() {
    var pack = [];

    for (const player of Object.values(this.Players)) {
      if (player.toRemove) delete this.Players[player.id];
      else {
        pack.push({
          x: player.x,
          y: player.y,
          width: player.width,
          height: player.height,
          angle: player.mouseAngle,
          baseAngle: player.baseAngle,
        });
      }
    }

    return pack;
  }

  onConnect(socket: SocketIO.Socket, bullets: Bullets, terrains: Terrains, players: Players){
    const player = new Player(socket.id, bullets, terrains, players);
    players.add(player);

    socket.on('keyPress', function(data: {inputId: string, state: boolean}){
        if(data.inputId === 'left') {
            player.pressLEFT = data.state;
        }
        else if(data.inputId === 'right') {
            player.pressRIGHT = data.state;
        }
        else if(data.inputId === 'up') {
            player.pressUP = data.state;
        }
        else if(data.inputId === 'down') {
            player.pressDOWN = data.state;
        }
        else if(data.inputId === 'attack'){
            player.pressATTACK = data.state;
        }
        else if(data.inputId === 'mouseAngle'){
            player.mouseAngle = data.state as unknown as number;
        }
    });
};

  onDisconnect(socket: SocketIO.Socket) {
    delete this.Players[socket.id];
  }
}
