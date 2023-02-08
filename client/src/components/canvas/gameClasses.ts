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
  players: { x: string; y: string };
  playerInControl: string;
  score: number;
  constructor({ players }: { players: { x: string; y: string } }, { score }: {score: number}) {
    this.players = players;
    this.playerInControl = this.players.x;
    this.score = score;
  }

  changePlayerInControl() {
    if (this.playerInControl === this.players.x) {
      this.playerInControl = this.players.y;
    } else {
      this.playerInControl = this.players.x;
    }
  }
}

export class Pellet {
  static scoreValue = 10;
  position: { x: number; y: number };
  radius: number;
  constructor({ position }: { position: { x: number; y: number };
}) {
    this.position = position;
    this.radius = 3;
    Pellet.scoreValue = 10;
  }
}
