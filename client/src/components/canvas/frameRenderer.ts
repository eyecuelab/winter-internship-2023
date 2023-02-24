import { Boundary, Kart, Pellet, SpawnPoint } from "./gameClasses";


function frameRenderer(
  this: any,
  size: { width: any; height: any },
  karts: {
    color: string;
    kart: Kart;
  }[],
  boundaries: Boundary[],
  pellets: Pellet[],
  spawnPoints: SpawnPoint[],
  mapBrick: HTMLImageElement|undefined
) {
  this.clearRect(0, 0, size.width, size.height);

  if (typeof window !== 'undefined') {
    
      this.drawImage(mapBrick, 1, 100, 100, 100);
  }

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
      var grd = this.createLinearGradient(
        pellet.position.x - 5,
        pellet.position.y - 5,
        pellet.position.x + 5,
        pellet.position.y + 5
      );
      grd.addColorStop(0, "#fa06f9");
      grd.addColorStop(1, "white");

      this.beginPath();
      this.arc(
        pellet.position.x,
        pellet.position.y,
        pellet.radius,
        0,
        Math.PI * 2
      );
      this.fillStyle = grd;
      this.fill();
      this.closePath();
    }
  };

  const drawSpawnPoint = (spawnPoint: SpawnPoint) => {
    var grd = this.createLinearGradient(
      spawnPoint.position.x - 15,
      spawnPoint.position.y - 15,
      spawnPoint.position.x + 15,
      spawnPoint.position.y,
      +15
    );
    grd.addColorStop(0, "#00d4ff");
    grd.addColorStop(0.8, "#090979");
    grd.addColorStop(1, "#020024");

    this.fillStyle = grd;
    this.fillRect(
      spawnPoint.position.x - 15,
      spawnPoint.position.y - 15,
      30,
      30
    );
  };

  const drawKart = (
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    width: number,
    height: number,
    color: string,
    angle: number,
    image: HTMLImageElement
  ) => {
    this.save();
    this.translate(x, y);
    this.rotate(angle);
    this.beginPath();
    this.moveTo(-width / 2, height / 2);//start at the bottom left corner
    this.lineTo(width / 2, height / 2);//draw to bottom right
    this.lineTo(0, -height / 2)//to top center
    this.closePath();
    this.fillStyle = color;
    this.fill();

    // this.drawImage(image, x, y, height, width);
    this.restore();
  };

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  });

  spawnPoints.forEach((spawnPoint) => {
    drawSpawnPoint(spawnPoint);
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
      entry.kart.velocity.x,
      entry.kart.velocity.y,
      30,
      30,
      entry.color,
      entry.kart.angle,
      createImage(entry.kart.imgSrc)
    );
  });
}
export default frameRenderer;
