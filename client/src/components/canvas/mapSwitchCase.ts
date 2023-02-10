import { Boundary, Pellet } from "./gameClasses";

export default function mapSwitchCase(gameMap) {
  const boundaries: Boundary[] = [];
  const pellets: Pellet[] = [];

  gameMap.forEach((row, i) => {
    row.forEach((symbol: any, j: number) => {
      switch (symbol) {
        case "-":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
            })
          );
          break;
        case ".":
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
            })
          );
          break;
      }
    });
  });

  return {boundaries, pellets};
}