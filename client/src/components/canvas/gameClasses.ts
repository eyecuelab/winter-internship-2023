export class Boundary {
  static width = 40;
  static height = 40;
  position: { x: number; y: number };
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    Boundary.width = 40;
    Boundary.height = 40;
    // this.image = image;
  }
}

export class Kart {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  constructor({
    position,
    velocity,
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
  }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }
}
export class Team {
  teamId: string;
  color: string;
  playerInControl: string;
  players: { x: string; y: string };
  kart: Kart;
  constructor({ teamId, color, players, kart }: { teamId: string, color: string, players: { x: string; y: string }, kart: Kart }) {
    this.teamId = teamId;
    this.color = color;
    this.players = players;
    this.playerInControl = this.players.x;
    this.kart = kart;
  }

  changePlayerInControl() {
    if (this.playerInControl === this.players.x) {
      this.playerInControl = this.players.y;
    } else {
      this.playerInControl = this.players.x;
    }
  }
}
