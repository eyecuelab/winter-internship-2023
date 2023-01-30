import {Boundary} from './gameClasses';

function frameRenderer(this: any, size: { width: any; height: any; }, player: { position: { x: number; y: number; }; velocity: { x: number; y: number; }; radius: number; }, map: any[]) {
  this.clearRect(0, 0, size.width, size.height);

  // const drawCircle = (x: any, y: any, radius: any, color: string, alpha: undefined) => {
  //   this.save();
  //   this.beginPath();
  //   this.arc(x, y, radius, 0, Math.PI * 2);
  //   this.fillStyle = color;
  //   this.globalAlpha = alpha;
  //   this.fill();
  //   this.closePath();
  //   this.restore();
  // };

  // drawCircle(ball.x, ball.y, ball.radius, "#444", undefined);
  const drawBoundary = (boundary: Boundary) => {
    this.fillStyle = 'blue';
    this.fillRect(boundary.position.x, boundary.position.y, Boundary.width, Boundary.height)
  }

  const boundaries: Boundary[] = [];

  map.forEach((row, i) => {
    row.forEach((symbol: any, j: number) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              }
            })
          );
          break;
      }
    });
  });

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  const drawPlayer = (x: number, y: number, radius: number, color: string) => {
    this.save();
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.fill();
    this.closePath();
    this.restore();
  }

  drawPlayer(player.position.x, player.position.y, player.radius, 'yellow')
}

export default frameRenderer;
