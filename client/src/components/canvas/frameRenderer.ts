import {Boundary, Pellet} from './gameClasses';

function frameRenderer(this: any, size: { width: any; height: any; }, kart: { position: { x: number; y: number; }; velocity: { x: number; y: number; }; radius: number; angle: number,imgSrc: string}, boundaries: Boundary[], pellets: Pellet[]) {
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

  boundaries.forEach((boundary) => {
    drawBoundary(boundary);
  });

  pellets.forEach((pellet) => {
    drawPellet(pellet);
  })

  function createImage(src: string) {
    const image = new Image()
    image.src = src
    return image 
  }

  const kartImg = createImage(kart.imgSrc);

  const drawKart = (x: number, y: number, radius: number, angle: number, image: HTMLImageElement) => {
    //top & bottom of Kart?
    //reflect over y axis?
    // console.log(angle);
    this.save()
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = 'transparent';
    this.fill();
    //const tweenAnimation 
    //package research for making the turn smoother
    //framer motion
    //

    if (angle !== 0) {
      //add this.transition 
      //('all', time (.2-.4))
    this.translate(x + 7.5, y + 7.5)
    this.rotate(angle * Math.PI / 180);  
    this.translate(-x - 7.5, -y - 7.5)
    }
    

    this.drawImage(image, x - 20, y - 30, 40, 40);
    this.restore();


  }


  drawKart(kart.position.x, kart.position.y, kart.radius, kart.angle, kartImg);
}

export default frameRenderer;
