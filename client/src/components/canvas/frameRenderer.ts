import {Boundary, Pellet} from './gameClasses';

function frameRenderer(this: any, size: { width: any; height: any; }, kart: { position: { x: number; y: number; }; velocity: { x: number; y: number; }; radius: number; }, boundaries: Boundary[], pellets: Pellet[]) {
  this.clearRect(0, 0, size.width, size.height);

  const drawBoundary = (boundary: Boundary) => {
    this.fillStyle = 'pink';
    this.fillRect(boundary.position.x, boundary.position.y, Boundary.width, Boundary.height)
  }
  const drawPellet = (pellet: Pellet) => {
    this.beginPath();
    this.arc(pellet.position.x, pellet.position.y, pellet.radius, 0, Math.PI * 2);
    this.fillStyle = 'white';
    this.fill();
    this.closePath();
  }
  // const boundaries: Boundary[] = [];

  // map.forEach((row, i) => {
  //   row.forEach((symbol: any, j: number) => {
  //     switch (symbol) {
  //       case '-':
  //         boundaries.push(
  //           new Boundary({
  //             position: {
  //               x: Boundary.width * j,
  //               y: Boundary.height * i,
  //             }
  //           })
  //         );
  //         break;
  //     }
  //   });
  // });
  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  })

  const drawKart = (x: number, y: number, radius: number, color: string) => {
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.fill();
    this.closePath();
  }

  drawKart(kart.position.x, kart.position.y, kart.radius, 'teal')
}

export default frameRenderer;
