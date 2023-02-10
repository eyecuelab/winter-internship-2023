import { Boundary, Pellet } from "./gameClasses";

export default function mapSwitchCase(gameMap: any) {
  const boundaries: Boundary[] = [];
  const pellets: Pellet[] = []; //change this to an object that has location, and true/false stored, we might need both bc frame renderer still reads the array to draw them initially
  //we could update 

  //Alex idea, add boolean to the pellet class is isEaten? and we create a method that toggles it
  //so whenever removePellets is called (every frame), we receive from the socket, the most recent updated pellet array
  //draw funciton redraws all the pellets without the consumed ones

  gameMap.forEach((row: any, i: any) => {
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