import { Boundary, Pellet, SpawnPoint } from "./gameClasses";

const generateMapQuadrants = () => {
  const randomNumberSelector = () => {Math.floor(Math.random() * 10)}

  return { i: randomNumberSelector(), ii: randomNumberSelector(), iii: randomNumberSelector(), iv: randomNumberSelector() }
}


export class map {
  quadrants: { i: number; ii: number; iii: number; iv: number };
  boundaries: Boundary[];
  pellets: Pellet[];
  spawnPoints: SpawnPoint[];

  constructor({
    quadrants,
  }: {
    quadrants: { i: number; ii: number; iii: number; iv: number };
  }) {
    this.quadrants = quadrants;
    this.boundaries = [];
    this.pellets = [];
    this.spawnPoints = [];
  }

  generateMapArrays() {
    //run map through map switchcase and generate arrays
  }
}
