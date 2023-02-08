import { Boundary } from "./gameClasses";

function frameRenderer(
  this: any,
  size: { width: any; height: any },
  karts: any[],
  map: any[]
) {
  this.clearRect(0, 0, size.width, size.height);

  const drawBoundary = (boundary: Boundary) => {
    this.fillStyle = "pink";
    this.fillRect(
      boundary.position.x,
      boundary.position.y,
      Boundary.width,
      Boundary.height
    );
  };

  const boundaries: Boundary[] = [];

  map.forEach((row, i) => {
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
      }
    });
  });

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  const drawKart = (x: number, y: number, radius: number, color: string) => {
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.fill();
    this.closePath();
  };

    //needs to check for undefined array..
    karts.forEach((kart) => {
      drawKart(kart.kart.position.x, kart.kart.position.y, kart.kart.radius, kart.color);
    });
}

export default frameRenderer;
