function frameRenderer(this: any, size: { width: any; height: any; }, ball: { x: any; y: any; radius: any; }) {//takes 
  this.clearRect(0, 0, size.width, size.height);

  const drawCircle = (x: any, y: any, radius: any, color: string, alpha: undefined) => {
    this.save();
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.globalAlpha = alpha;
    this.fill();
    this.closePath();
    this.restore();
  };

  drawCircle(ball.x, ball.y, ball.radius, "#444", undefined);
}

export default frameRenderer;
