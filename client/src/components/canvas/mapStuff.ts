import { Boundary, Pellet, SpawnPoint } from "./gameClasses";
import { quadrants } from "./quadrants";

export class gameMap {
  mapQuadrants: { i: number; ii: number; iii: number; iv: number };
  mapArr: any[];
  boundaries: Boundary[];
  pellets: Pellet[];
  spawnPoints: SpawnPoint[];

  constructor(
    mapQuadrants
  : {i: number; ii: number; iii: number; iv: number };
  ) {
    this.mapQuadrants = mapQuadrants;
    this.mapArr = [];
    this.boundaries = [];
    this.pellets = [];
    this.spawnPoints = [];
  }

  generateMapArray() {
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
}
