export class Boundary {
  static width = 40;
  static height = 40;
  position: { x: number; y: number; };
  constructor({ position }: {position: {x: number, y: number}}) {
    this.position = position;
    Boundary.width = 40;
    Boundary.height = 40;
    // this.image = image;
  }

  // draw() {
  //   c.fillStyle = 'blue';
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height);
  //   // c.drawImage(this.image, this.position.x, this.position.y);
  // }
}

export class Player {
  position: object;
  velocity: object;
  radius: number;
  constructor({ position, velocity }: {position: object, velocity: object}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }

  // draw() {
  //   c.beginPath();
  //   c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  //   c.fillStyle = 'yellow';
  //   c.fill();
  //   c.closePath();
  // }

  // update() {
  //   this.draw();
  //   this.position.x += this.velocity.x; //updates left/right location by 1 increment of velocity unit
  //   this.position.y += this.velocity.y; ////updates up/down location by 1 increment of velocity unit
  // }
}