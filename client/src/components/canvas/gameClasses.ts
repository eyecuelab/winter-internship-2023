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

export class Player {
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
  constructor({ players }: { players: { x: string; y: string } }) {
    this.players = players;
    this.playerInControl = "x";
  }

  changePlayerInControl() {
    if (this.playerInControl === "x") {
      this.playerInControl = "y";
    } else {
      this.playerInControl = "x";
    }
  }
}
