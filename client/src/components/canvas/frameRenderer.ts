function frameRenderer(this: any, size: { width: any; height: any; }, player: { position: { x: number; y: number; }; velocity: { x: number; y: number; }; radius: number; }) {
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
