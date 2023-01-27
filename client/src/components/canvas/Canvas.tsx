import { useEffect, useRef } from "react";
import frameRenderer from "./frameRenderer";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3.9, vy: 3.3, radius: 20 });//because we want to keep those properties across rerenders, and because we want to be able to manipulate those values without causing rerenders of our React component, we store the ball object in a ref container
  const size = { width: 400, height: 250 };

  const updateBall = () => {
    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x + ball.radius >= size.width) {
      ball.vx = -ball.vx;
      ball.x = size.width - ball.radius;
    }
    if (ball.x - ball.radius <= 0) {
      ball.vx = -ball.vx;
      ball.x = ball.radius;
    }
    if (ball.y + ball.radius >= size.height) {
      ball.vy = -ball.vy;
      ball.y = size.height - ball.radius;
    }
    if (ball.y - ball.radius <= 0) {
      ball.vy = -ball.vy;
      ball.y = ball.radius;
    }
  };
  
  const renderFrame = () => {//updates properties of drawn elements (ball in example) and then draws it on canvas
    const canvas = canvasRef.current;
    if(!canvas) {//error handling for type null
      return;
    }
    const context = canvas.getContext('2d');
    if(!context) {
      return;
    } 
    updateBall();
    frameRenderer.call(context, size, ballRef.current);
    
  };


  const tick = () => {
    if (!canvasRef.current) return;//breakout error handling
    renderFrame();//updates properties of drawn elements (ball in example) and then draws it on canvas
    requestAnimationFrame(tick);//recursively re-run tick and thus animate our canvas by displaying new frames
  };

  useEffect(() => {
    requestAnimationFrame(tick);//once component mounts our canvas animation is initiated with our recursive tick function.
  }, []);

  return <canvas {...size} ref={canvasRef} />;//pass canvasRef to canvas element-we will be able to access a reference to the canvas element in our DOM so we can access its 2D drawing context, later on. a call to useRef will return a mutable object. This means that we can alter the value of its .current property without unexpected behavior or side effects. we can alter that value and it will not cause a rerender of our component.  Mutating the .current property doesn’t cause a re-render.Okay. So by using useRef we can:
  // Store a value inside an object
  // Manipulate that value whenever we want without causing a rerender of our component
  // Access that same value on every rerender
}

export default Canvas;