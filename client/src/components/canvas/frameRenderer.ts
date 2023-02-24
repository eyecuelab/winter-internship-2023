import { Boundary, Kart, Pellet, SpawnPoint } from "./gameClasses";
import pinkKart from "./../../assets/karts/pinkKart.svg";
import Konva from 'konva';

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
  svg: SVGElement | null
) {
  this.clearRect(0, 0, size.width, size.height);
// console.log(pinkKart);

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

  // const image = new Image();
  // image.src = "blob:http://localhost:3000/69bfcb7c-6021-4307-9468-450bf2335eed";

 
    const drawKart = (
      x: number,
      y: number,
      velocityX: number,
      velocityY: number,
      width: number,
      height: number,
      color: string,
      angle: number,
      // image: HTMLImageElement
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
      this.restore();

      
      // var stage = new Konva.Stage({
      //   container: 'container',
      //   width: width,
      //   height: height,
      // });
    
      // stage.add(layer);
    
      var imageObj = new Image();
      imageObj.onload = function () {
        var kart = new Konva.Image({
          x: 50,
          y: 50,
          image: imageObj,
          width: 106,
          height: 118,
        });
        const layer = new Konva.Layer();

        Konva.Image.fromURL(pinkKart, (imageObj: any) => {
          layer.add(imageObj);
        });
      //   layer.add(kart);

      //   imageObj.src = pinkKart;

  
      // this.drawImage(image, 0, 0);
    
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

  // const createImage = (src: string) => {
  //   const image = new Image();
  //   // console.log(src);
  //   image.src = src;
  //   return image;
  // }





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
      // createImage(blobUrl)
    );
  });
}
}
export default frameRenderer;
