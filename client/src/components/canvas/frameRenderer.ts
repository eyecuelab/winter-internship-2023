import { Boundary, Pellet } from "./gameClasses";

function frameRenderer(
  this: any,
  size: { width: any; height: any },
  karts: any[],
  boundaries: Boundary[],
  pellets: Pellet[]
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
  const drawPellet = (pellet: Pellet) => {
    this.beginPath();
    this.arc(
      pellet.position.x,
      pellet.position.y,
      pellet.radius,
      0,
      Math.PI * 2
    );
    this.fillStyle = "white";
    this.fill();
    this.closePath();
  };

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  });

  const drawKart = (x: number, y: number, radius: number, color: string) => {
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    //this.rotate() or whatever it's called
    this.fillStyle = color;
    this.fill();
    this.closePath();
  };

  //notes for rotating kart:
  //if positive x velocity and y 0-- rotation faces 90 degrees... etc.
  //to animate: store rotation as var. in Kart -- ie: takes 30 frames to move 90 degrees. an easing function. take current rotation and velocity and what rotation should be based on velocity and find out what the difference is and determine how much movement happens each tick-- adjust

  //needs to check for undefined array..
  karts.forEach((entry) => {
    drawKart(
      entry.kart.position.x,
      entry.kart.position.y,
      entry.kart.radius,
      entry.color
    );
  });
}

export default frameRenderer;
