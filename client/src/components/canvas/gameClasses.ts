import { kartType, teamType } from "../../types/Types";

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
  public constructor({
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

  updateTeamWithJson(jsonString: string){
    const kartUpdate:kartType = JSON.parse(jsonString);
    this.position = kartUpdate.position;
    this.velocity = kartUpdate.velocity;
    this.radius = kartUpdate.radius;
  }
}
export class Team {
  teamId: string;
  color: string;
  playerInControl: string;
  players: { x: string; y: string };
  kart: Kart;
  score: number;
  constructor({
    teamId,
    color,
    players,
    kart,
    score
  }: {
    teamId: string;
    color: string;
    players: { x: string; y: string };
    kart: Kart;
    score:  number;
  }) {
    this.teamId = teamId;
    this.color = color;
    this.players = players;
    this.playerInControl = this.players.x;
    this.kart = kart;
    this.score = score;
  }

  changePlayerInControl() {
    if (this.playerInControl === this.players.x) {
      this.playerInControl = this.players.y;
    } else {
      this.playerInControl = this.players.x;
    }
  }

  updateTeamWithJson(jsonString: string){
    const teamUpdate:teamType = JSON.parse(jsonString);
    this.teamId = teamUpdate.teamId;
    this.color = teamUpdate.color;
    this.players = teamUpdate.players;
    this.playerInControl = teamUpdate.playerInControl;
    this.kart = teamUpdate.kart;
    this.score = teamUpdate.score;
  }

  // toJSON() {
  //   return {};
  // }
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
