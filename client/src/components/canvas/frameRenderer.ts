import { Boundary, Kart, Pellet, Poof, SpawnPoint } from "./gameClasses";

function frameRenderer(
  this: any,
  size: { width: any; height: any },
  myKart: Kart,
  karts: {
    color: string;
    kart: Kart;
  }[],
  boundaries: Boundary[],
  pellets: Pellet[],
  spawnPoints: SpawnPoint[],
  poofs: Poof[],
  mapBrickSvg: HTMLImageElement | undefined,
  pelletSvg: HTMLImageElement | undefined,
  redKartSvg: HTMLImageElement | undefined,
  orangeKartSvg: HTMLImageElement | undefined,
  blueKartSvg: HTMLImageElement | undefined,
  pinkKartSvg: HTMLImageElement | undefined,
  redGhostSvg: HTMLImageElement | undefined,
  orangeGhostSvg: HTMLImageElement | undefined,
  blueGhostSvg: HTMLImageElement | undefined,
  pinkGhostSvg: HTMLImageElement | undefined,
  poofSvg: HTMLImageElement | undefined
) {
  const transform = this.getTransform();
  this.translate(-transform.e, -transform.f);
  this.translate(-myKart.position.x+120, -myKart.position.y+120)
  this.clearRect(0, 0, size.width, size.height);
  
  const drawBoundary = (boundary: Boundary) => {
    this.drawImage(
      mapBrickSvg,
      boundary.position.x,
      boundary.position.y,
      Boundary.width,
      Boundary.height
    );
  };

  const drawPellet = (pellet: Pellet) => {
    if (pellet.isVisible === true) {
      //this.drawImage(pelletSvg, pellet.position.x - 5,
      //  pellet.position.y - 5, 11, 11)
      this.drawImage(
        pelletSvg,
        pellet.position.x - 10,
        pellet.position.y - 10,
        22,
        22
      );
      this.closePath();
    }
  };

  const drawPoof = (poof: Poof) => {
    this.globalAlpha = this.opacity;
    this.save();
    this.translate( poof.position.x,
      poof.position.y);
    this.beginPath();
    this.rotate(poof.angle);
    this.drawImage(
      poofSvg,
      -poof.size / 2,
      -poof.size / 2,
      poof.size,
      poof.size
    );
    this.closePath();
    this.restore();
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
    isGhost: boolean
  ) => {
    let img;
    if (color === "red") {
      if (isGhost) {
        img = redGhostSvg;
      } else {
        img = redKartSvg;
      }
    } else if (color === "orange") {
      if (isGhost) {
        img = orangeGhostSvg;
      } else {
        img = orangeKartSvg;
      }
    } else if (color === "pink") {
      if (isGhost) {
        img = pinkGhostSvg;
      } else {
        img = pinkKartSvg;
      }
    } else if (color === "blue") {
      if (isGhost) {
        img = blueGhostSvg;
      } else {
        img = blueKartSvg;
      }
    }
    this.save();
    this.translate(x, y);
    this.rotate(angle);
   
    this.drawImage(img, -width / 2, -height / 2, 80, 80);
    this.restore();
  };

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  });

  karts.forEach((entry) => {
    drawKart(
      entry.kart.position.x,
      entry.kart.position.y,
      entry.kart.velocity.x,
      entry.kart.velocity.y,
      75,
      75,
      entry.color,
      entry.kart.angle.currentAngle,
      entry.kart.isGhost
    );
  });

  poofs.forEach((poof) => {
    drawPoof(poof);
  });
}
export default frameRenderer;