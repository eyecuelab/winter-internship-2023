import { Boundary, Kart, Pellet, SpawnPoint } from "./gameClasses";

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
  mapBrickSvg: HTMLImageElement | undefined,
  pelletSvg: HTMLImageElement | undefined,
  redKartSvg: HTMLImageElement | undefined,
  orangeKartSvg: HTMLImageElement | undefined,
  blueKartSvg: HTMLImageElement | undefined,
  pinkKartSvg: HTMLImageElement | undefined,
  redGhostSvg: HTMLImageElement | undefined,
  orangeGhostSvg: HTMLImageElement | undefined,
  pinkGhostSvg: HTMLImageElement | undefined,
  blueGhostSvg: HTMLImageElement | undefined
) {
  const transform = this.getTransform();
  this.translate(-transform.e, -transform.f);
  this.translate(-myKart.position.x+60, -myKart.position.y+60)


  

// extract the x and y translations
//The e and f properties are convenience properties that provide direct access to the translation values of the matrix. They are equivalent to accessing the matrix elements directly using the m13 and m23 properties,

 // how far away it is from the origin of x
// from here we change the translate to 2 translations, first we send it back to the origin with negative x and y translations, then we move it again to the proper position


  // const getTransform = this.getTransform();
  // console.log(getTransform);
  // this.translate(myKart.position.x, myKart.position.y);

  const camera = {
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  };
  function clamp(value: number, min: number, max: number){
      if(value < min) return min;
      else if(value > max) return max;
      return value;
  }
  function moveCamera() {
      camera.x = clamp(myKart.position.x - (camera.width / 2), 0, size.width);
      camera.y = clamp(myKart.position.y - (camera.height / 2), 0, size.height);
  }
  
// once, we've moved the camera, we move it again if its outside the boundaries to be back in
this.clearRect(0, 0, size.width, size.height);


  
  // MAYBE HERE
  // this.drawImage(mapBrick, 1, 100, 100, 100);


  const drawBoundary = (boundary: Boundary) => {
    // this.fillStyle = "pink";
    // this.fillRect(
    //   boundary.position.x,
    //   boundary.position.y,
    //   Boundary.width,
    //   Boundary.height
    // );
    this.drawImage(mapBrickSvg, boundary.position.x, boundary.position.y, 40, 40)
  };

  const drawPellet = (pellet: Pellet) => {
    if (pellet.isVisible === true) {
      // var grd = this.createLinearGradient(
      //   pellet.position.x - 5,
      //   pellet.position.y - 5,
      //   pellet.position.x + 5,
      //   pellet.position.y + 5
      // );
      // grd.addColorStop(0, "#fa06f9");
      // grd.addColorStop(1, "white");

      // // this.beginPath();
      // // this.arc(
      // //   pellet.position.x,
      // //   pellet.position.y,
      // //   pellet.radius,
      // //   0,
      // //   Math.PI * 2
      // // );
      // this.fillStyle = grd;
      // this.fill();
      this.drawImage(pelletSvg, pellet.position.x - 5,
        pellet.position.y - 5, 11, 11)
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
    isGhost: boolean
  ) => {
    let img;
    if (color === "red"){
      if(isGhost){
        img = redGhostSvg;
      }else {
        img = redKartSvg;
      }
    } else if(color === "orange"){
      if(isGhost){
        img = orangeGhostSvg;
      }else {
        img = orangeKartSvg;
      }
    }else if (color === "pink"){
      if(isGhost){
        img = pinkGhostSvg;
      }else {
        img = pinkKartSvg;
      }
    }else if (color === "blue"){
      if(isGhost){
        img = blueGhostSvg;
      }else {
        img = blueKartSvg;
      }
    }
    this.save();
    this.translate(x, y);
    this.rotate(angle);
    // this.beginPath();
    // this.moveTo(-width / 2, height / 2); //start at the bottom left corner
    // this.lineTo(width / 2, height / 2); //draw to bottom right
    // this.lineTo(0, -height / 2); //to top center
    // this.closePath();
    // this.fillStyle = color;
    this.drawImage(img, -width / 2, -height / 2, 35, 35)
    //moveCamera();
    this.fill(); //we change this one to hold the camera parameters
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
      entry.kart.isGhost
    );
  });

  //this.translate(myKart.position.x - size.width/2, myKart.position.y - size.height/2)
  //final fill to be here
}
export default frameRenderer;

 /* HERE WE WILL BEGIN THE VIEWPORTS */
 



/*
// Get a reference to the canvas element and its context
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Define the player's position and dimensions
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

// Define the camera's position and dimensions
const camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height
};

// Move the camera to follow the player
function moveCamera() {
  camera.x = player.x - (camera.width / 2);
  camera.y = player.y - (camera.height / 2);
}

// Draw the player and other game objects relative to the camera
function draw() {
  // Clear the canvas

  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
*/
  // Move the camera
  //moveCamera();

  // Draw the player
  //ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);

  // Draw other game objects
  // ...
//}

// Call the draw function repeatedly to update the screen
//setInterval(draw, 16);




/*
// clamp(10, 20, 30) - output: 20
// clamp(40, 20, 30) - output: 30
// clamp(25, 20, 30) - output: 25
function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}


// center the camera aroud the player,
// but clamp the camera position (top left corner) to the world bounds
const camX = clamp(player.x - canvas.width/2, worldBounds.minX, worldBounds.maxX - canvas.width);
const camY = clamp(player.y - canvas.height/2, worldBounds.minY, worldBounds.maxY - canvas.height);

*/