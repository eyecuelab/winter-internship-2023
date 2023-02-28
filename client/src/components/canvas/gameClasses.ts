import { kartType, teamType } from "../../types/Types";
import mapSwitchCase from "./mapSwitchCase";
import { quadrants } from "./quadrants";

export class Boundary {
  static width = 40;
  static height = 40;
  position: { x: number; y: number };
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    Boundary.width = 40;
    Boundary.height = 40;
  }
}

export class Kart {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  imgSrc: string;
  angle: {currentAngle: number, goalAngle: number, steps:number};
  isGhost: boolean

  constructor();
  constructor(kartData: kartType);
  constructor(kartData?: kartType) {
    this.position = kartData?.position ?? {x:0, y:0};
    this.velocity = kartData?.velocity ?? {x:0, y:0};;
    this.radius = 15;
    this.imgSrc = kartData?.imgSrc ?? '';
    this.angle = kartData?.angle ?? {currentAngle: 0, goalAngle: 0, steps: 5};
    this.isGhost = kartData?.isGhost ?? false;
  }

  updateKartWithJson(jsonString: string) {
    const kartUpdate: kartType = JSON.parse(jsonString);
    this.position = kartUpdate.position;
    this.velocity = kartUpdate.velocity;
    this.radius = kartUpdate.radius;
    this.imgSrc = kartUpdate.imgSrc;
    this.angle = kartUpdate.angle;
    this.isGhost = kartUpdate.isGhost;
  }

  calculateStepsToGoal() {
    const angleDiff = this.angle.goalAngle - this.angle.currentAngle;
    let direction = Math.sign(angleDiff);
    const absAngleDiff = Math.abs(angleDiff);
    const halfSteps = Math.floor(this.angle.steps / 2);
    let steps = 0;
  
    if (absAngleDiff > Math.PI) {
      // If the absolute difference is greater than PI, we should take the opposite direction.
      direction *= -1;
    }
  
    if (absAngleDiff > Math.PI / 2) {
      // If the absolute difference is greater than PI/2, we need to turn more than half way around.
      steps = Math.ceil(absAngleDiff / (Math.PI / 2)) * halfSteps;
    } else {
      // Otherwise, we can turn less than half way around.
      steps = Math.ceil(absAngleDiff / (Math.PI / this.angle.steps));
    }
  
    this.angle.steps= steps * direction;
  }
  
}

export class Team {
  teamId: string;
  color: string;
  playerInControl: string;
  players: { x: string; y: string };
  score: number;
  
  constructor();
  constructor(teamData: teamType);
  constructor(teamData?: teamType) {
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
}

export class Pellet {
  static scoreValue = 10;
  position: { x: number; y: number };
  radius: number;
  isVisible: boolean;
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    this.radius = 5;
    Pellet.scoreValue = 10;
    this.isVisible = true;
  }
}

export class SpawnPoint {
  position: { x: number; y: number };
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
  }
}
export class GameMap {
  mapQuadrants: { i: number; ii: number; iii: number; iv: number };
  mapArr: any[];
  boundaries: Boundary[];
  pellets: Pellet[];
  spawnPoints: SpawnPoint[];

  constructor(
    mapQuadrants
  : {i: number; ii: number; iii: number; iv: number }
  ) {
    this.mapQuadrants = mapQuadrants;
    this.mapArr = [];
    this.boundaries = [];
    this.pellets = [];
    this.spawnPoints = [];
  }

  generateMapArr() {
    const tempQuads = quadrants.map((quad) => quad.slice().map(innerArr => innerArr.slice()));
  
    function reverseArrs(arr: any[]) {
      //reverses each arrays elements w/in a 2d array
      const reversedArr = arr.map((innerArr: any[]) => innerArr.slice().reverse());
      return reversedArr;
    }
  
    function reverseOrderOfArrs(arr: any[]) {
      //reverses order of arrays w/in a 2d array
      const reversedArr = arr.slice().reverse().map((innerArr: any[]) => innerArr.slice());
      return reversedArr;
    }
  
    const quad1 = tempQuads[this.mapQuadrants.i];
    const quad2 = reverseArrs(tempQuads[this.mapQuadrants.ii]);
    const quad3 = reverseOrderOfArrs(tempQuads[this.mapQuadrants.iii]);
    const quad4 = reverseArrs(reverseOrderOfArrs(tempQuads[this.mapQuadrants.iv]));
  
    const combinedTop = quad1.map((arr, i) => arr.concat(quad2[i]));
    const combinedBottom = quad3.map((arr, i) => arr.concat(quad4[i]));
    this.mapArr = [...combinedTop, ...combinedBottom];
  }
  

  generateMapPropertiesArrs(){
    const {boundaries, pellets, spawnPoints} = mapSwitchCase(this.mapArr);

    this.boundaries = boundaries;
    this.pellets = pellets;
    this.spawnPoints = spawnPoints;
  }
}

