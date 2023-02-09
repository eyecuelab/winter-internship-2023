import { kartConstructorType, kartType, teamConstructorType, teamType } from "../../types/Types";

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
  constructor();
  constructor(kartConstructorData: kartConstructorType);
  constructor(kartConstructorData?: kartConstructorType) {
    this.position = kartConstructorData?.position ?? {x:0, y:0};
    this.velocity = kartConstructorData?.velocity ?? {x:0, y:0};;
    this.radius = 15;
  }

  updateKartWithJson(jsonString: string) {
    const kartUpdate: kartType = JSON.parse(jsonString);
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
  score: number;
  constructor();
  constructor(teamData: teamConstructorType);
  constructor(teamData?: teamConstructorType) {
    this.teamId = teamData?.teamId ?? "";
    this.color = teamData?.color ?? "";
    this.players = teamData?.players ?? { x: "", y: "string" };
    this.playerInControl = teamData?.players ? teamData.players.x :  "";
    this.score = teamData?.score ?? 0;
  }

  changePlayerInControl() {
    if (this.playerInControl === this.players.x) {
      this.playerInControl = this.players.y;
    } else {
      this.playerInControl = this.players.x;
    }
  }

  updateTeamWithJson(jsonString: string) {
    const teamUpdate: teamType = JSON.parse(jsonString);
    this.teamId = teamUpdate.teamId;
    this.color = teamUpdate.color;
    this.players = teamUpdate.players;
    this.playerInControl = teamUpdate.playerInControl;
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
  // isShowing: boolean;
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    this.radius = 3;
    Pellet.scoreValue = 10;
  }
}
