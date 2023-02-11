import { Boundary, Kart, Pellet } from "./gameClasses";

function frameRenderer(
  this: any,
  size: { width: any; height: any },
  karts: {
    color: string;
    kart: Kart;
}[],
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
    if (pellet.isVisible === true) {
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
    }
  };

  const drawKart = (
    x: number,
    y: number,
    radius: number,
    color: string,
    angle: number,
    image: HTMLImageElement
  ) => {
    this.save();
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.fill();

    if (angle !== 0) {
      this.translate(x + 7.5, y + 7.5);
      this.rotate((angle * Math.PI) / 180);
      this.translate(-x - 7.5, -y - 7.5);
    }

    this.drawImage(image, x - 20, y - 30, 40, 40);
    this.restore();
  };

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  });

  function createImage(src: string) {
    const image = new Image();
    image.src = src;
    return image;
  }

  //notes for rotating kart:
  //if positive x velocity and y 0-- rotation faces 90 degrees... etc.
  //to animate: store rotation as var. in Kart -- ie: takes 30 frames to move 90 degrees. an easing function. take current rotation and velocity and what rotation should be based on velocity and find out what the difference is and determine how much movement happens each tick-- adjust

    karts.forEach((entry) => {
      drawKart(
        entry.kart.position.x,
        entry.kart.position.y,
        entry.kart.radius,
        entry.color,
        entry.kart.angle,
        createImage(entry.kart.imgSrc)
      );
    });

}

export default frameRenderer;
