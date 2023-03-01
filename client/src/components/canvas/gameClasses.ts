import { kartType, poofType, teamType } from "../../types/Types";
import mapSwitchCase from "./mapSwitchCase";
import { quadrants } from "./quadrants";

export class Boundary {
  static width = 80;
  static height = 80;
  position: { x: number; y: number };
  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    Boundary.width = 80;
    Boundary.height = 80;
  }
}

export class Kart {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  imgSrc: string;
  angle: { currentAngle: number; goalAngle: number };
  isGhost: boolean;

  constructor();
  constructor(kartData: kartType);
  constructor(kartData?: kartType) {
    this.position = kartData?.position ?? { x: 0, y: 0 };
    this.velocity = kartData?.velocity ?? { x: 0, y: 0 };
    this.radius = 35;
    this.imgSrc = kartData?.imgSrc ?? "";
    this.angle = kartData?.angle ?? { currentAngle: 0, goalAngle: 0 };
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

  determineAngleDirection() {
    const currentAngle = this.angle.currentAngle;
    const goalAngle = this.angle.goalAngle;
    let angleDiff = goalAngle - currentAngle;

    if (angleDiff > Math.PI) {
      angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
      angleDiff += 2 * Math.PI;
    }

    if ((angleDiff >= 0 && angleDiff <= Math.PI) || angleDiff <= -Math.PI) {
      return 1;
    } else {
      return -1;
    }
  }

  updateKartAngle() {
    if (this.angle.currentAngle !== this.angle.goalAngle) {
      const direction = this.determineAngleDirection();
      const angleDiff = this.angle.goalAngle - this.angle.currentAngle;
      this.angle.currentAngle += direction * Math.min(Math.abs(angleDiff), 0.3);

      if (this.angle.currentAngle >= 2 * Math.PI) {
        this.angle.currentAngle -= 2 * Math.PI;
      } else if (this.angle.currentAngle < 0) {
        this.angle.currentAngle += 2 * Math.PI;
      }

      if (Math.abs(angleDiff) < 0.01) {
        this.angle.currentAngle = this.angle.goalAngle;
      }
    }
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
    this.playerInControl = teamData?.players ? teamData.players.x : "";
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
    this.radius = 10;
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

export class Poof {
  position: { x: number; y: number };
  size: number;
  opacity: number;

  static readonly SHRINK_SPEED = 1;
  static readonly FADE_SPEED = 1;

  constructor(position: {x:number, y:number}) {
    this.position = position;
    this.size = 85;
    this.opacity = 100;
  }

  update() {
    this.size -= Poof.SHRINK_SPEED;
    
    this.opacity -= Poof.FADE_SPEED;

    this.size = Math.max(0, this.size);
    this.opacity = Math.max(0, this.opacity);
    this.size = Math.max(0, this.size);
    this.opacity = Math.max(0, this.opacity);
  }
}

export class GameMap {
  mapQuadrants: { i: number; ii: number; iii: number; iv: number };
  mapArr: any[];
  boundaries: Boundary[];
  pellets: Pellet[];
  spawnPoints: SpawnPoint[];

  constructor(mapQuadrants: {
    i: number;
    ii: number;
    iii: number;
    iv: number;
  }) {
    this.mapQuadrants = mapQuadrants;
    this.mapArr = [];
    this.boundaries = [];
    this.pellets = [];
    this.spawnPoints = [];
  }

  generateMapArr() {
    const tempQuads = quadrants.map((quad) =>
      quad.slice().map((innerArr) => innerArr.slice())
    );

    function reverseArrs(arr: any[]) {
      //reverses each arrays elements w/in a 2d array
      const reversedArr = arr.map((innerArr: any[]) =>
        innerArr.slice().reverse()
      );
      return reversedArr;
    }

    function reverseOrderOfArrs(arr: any[]) {
      //reverses order of arrays w/in a 2d array
      const reversedArr = arr
        .slice()
        .reverse()
        .map((innerArr: any[]) => innerArr.slice());
      return reversedArr;
    }

    const quad1 = tempQuads[this.mapQuadrants.i];
    const quad2 = reverseArrs(tempQuads[this.mapQuadrants.ii]);
    const quad3 = reverseOrderOfArrs(tempQuads[this.mapQuadrants.iii]);
    const quad4 = reverseArrs(
      reverseOrderOfArrs(tempQuads[this.mapQuadrants.iv])
    );

    const combinedTop = quad1.map((arr, i) => arr.concat(quad2[i]));
    const combinedBottom = quad3.map((arr, i) => arr.concat(quad4[i]));
    this.mapArr = [...combinedTop, ...combinedBottom];
  }

  generateMapPropertiesArrs() {
    const { boundaries, pellets, spawnPoints } = mapSwitchCase(this.mapArr);

    this.boundaries = boundaries;
    this.pellets = pellets;
    this.spawnPoints = spawnPoints;
  }
}
