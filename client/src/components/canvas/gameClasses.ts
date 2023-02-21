import { kartConstructorType, kartType, teamConstructorType, teamType } from "../../types/Types";
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
  angle: number;

  constructor();
  constructor(kartConstructorData: kartConstructorType);
  constructor(kartConstructorData?: kartConstructorType) {
    this.position = kartConstructorData?.position ?? {x:0, y:0};
    this.velocity = kartConstructorData?.velocity ?? {x:0, y:0};;
    this.radius = 15;
    this.imgSrc = kartConstructorData?.imgSrc ?? '';
    this.angle = kartConstructorData?.angle ?? 0;
  }

  updateKartWithJson(jsonString: string) {
    const kartUpdate: kartType = JSON.parse(jsonString);
    this.position = kartUpdate.position;
    this.velocity = kartUpdate.velocity;
    this.radius = kartUpdate.radius;
    this.imgSrc = kartUpdate.imgSrc;
    this.angle = kartUpdate.angle;
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
    function reverseArrs(arr: any) {
      //reverses each arrays elements w/in a 2d array
      for (let i = 0; i < arr.length; i++) {
        arr[i].reverse();
      }
      return arr;
    }

    function reverseOrderOfArrs(arr: any) {
      //reverses order of arrays w/in a 2d array
      let left = 0;
      let right = arr.length - 1;

      while (left < right) {
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        left++;
        right--;
      }

      return arr;
    }

    const quad1 = quadrants[this.mapQuadrants.i];
    const quad2 = reverseArrs(quadrants[this.mapQuadrants.ii]);
    const quad3 = reverseOrderOfArrs(quadrants[this.mapQuadrants.iii]);
    const quad4 = reverseArrs(reverseOrderOfArrs(quadrants[this.mapQuadrants.iv]));

    const combinedTop = quad1.map((arr: any[], i: number) => arr.concat(quad2[i]));
    const combinedBottom = quad3.map((arr: any[], i: number) => arr.concat(quad4[i]));

    this.mapArr = [...combinedTop, ...combinedBottom];
  }

  generateMapPropertiesArrs(){
    const {boundaries, pellets, spawnPoints} = mapSwitchCase(this.mapArr);

    this.boundaries = boundaries;
    this.pellets = pellets;
    this.spawnPoints = spawnPoints;
  }
}

