import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player } from "./gameClasses";

function Canvas() {
  const [keys, setKeys] = useState({
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  })
  const [lastKey, setLastKey] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);

  // const ballRef = useRef({ x: 50, y: 50, vx: 3.9, vy: 3.3, radius: 20 });//because we want to keep those properties across rerenders, and because we want to be able to manipulate those values without causing rerenders of our React component, we store the ball object in a ref container
  const playerRef = useRef({position: {x: 60, y: 60}, velocity: {x: 3.9, y: 3.3}, radius: 15 })
  const mapRef = useRef<any[]>([
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '_', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '.', '.', '.', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '-', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ])

  const size = { width: 700, height: 700 };

  const updatePlayer = () => {
    const player = playerRef.current;
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;
    if (player.position.x + player.radius >= size.width) {
      player.velocity.x = -player.velocity.x;
      player.position.x = size.width - player.radius;
    }
    if (player.position.x - player.radius <= 0) {
      player.velocity.x = -player.velocity.x;
      player.position.x = player.radius;
    }
    if (player.position.y + player.radius >= size.height) {
      player.velocity.y = -player.velocity.y;
      player.position.y = size.height - player.radius;
    }
    if (player.position.y - player.radius <= 0) {
      player.velocity.y = -player.velocity.y;
      player.position.y = player.radius;
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
    updatePlayer(); //links ball movements with canvas element
    frameRenderer.call(context, size, playerRef.current, mapRef.current);//draws ball on canvas
  };


  const tick = () => {
    if (!canvasRef.current) return;//breakout error handling
    renderFrame();//updates properties of drawn elements (ball in example) and then draws it on canvas
    requestIdRef.current = requestAnimationFrame(tick);//recursively re-run tick and thus animate our canvas by displaying new frames. we pass the returned value of requestAnimationFrame to the requestIdRef reference object. The returned value is a so-called request ID, meaning that it’s an identifier of the frame that was started by calling it.
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);//once component mounts our canvas animation is initiated with our recursive tick function.
    return () => {//callback clean up function to end animation ticks when component unmounts
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  const handleKeyDownEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'w':
        setKeys({...keys, w: {pressed: true}});
        setLastKey('w');
        break;
      case 'a':
        setKeys({...keys, a: {pressed: true}});
        setLastKey('a');
        break;
      case 's':
        setKeys({...keys, s: {pressed: true}});
        setLastKey('s');
        break;
      case 'd':
        setKeys({...keys, d: {pressed: true}});
        setLastKey('d');
        break;
    }
    console.log('keydown:', lastKey, keys)
  }

  const handleKeyUpEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    
    switch (e.key) {
      case 'w':
        setKeys({...keys, w: {pressed: false}});
        break;
      case 'a':
        setKeys({...keys, a: {pressed: false}});
        break;
      case 's':
        setKeys({...keys, s: {pressed: false}});
        break;
      case 'd':
        setKeys({...keys, d: {pressed: false}});
        break;
    }
    console.log('keyup:',lastKey, keys)
  }

  function handleKeyPress(e: KeyboardEvent) { //
    console.log(e);// arrow keys don't work yet
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === " ") { //this works to recognize the key
      console.log("send it !!!!!"); // wasd and space are sorted, we can now send that information to the server
      //keypress(e.key);
    }
    else {
      console.log("don't send it");
    };
  return (
    <div 
      onKeyDown = {(e)=> handleKeyDownEvent(e)}
      onKeyUp = {(e)=> handleKeyUpEvent(e)}
      >

        <input 
          type="text" 
          id="fname" 
          name="fname"
          // onKeyDown = {(e)=> handleKeyDownEvent(e)}
          // onKeyUp = {(e)=> handleKeyUpEvent(e)}
          >
        </input>
        <p>welcome to da game</p>
        
      <canvas {...size} ref={canvasRef} />
    </div>
  );
  //pass canvasRef to canvas element-we will be able to access a reference to the canvas element in our DOM so we can access its 2D drawing context, later on. a call to useRef will return a mutable object. This means that we can alter the value of its .current property without unexpected behavior or side effects. we can alter that value and it will not cause a rerender of our component.  Mutating the .current property doesn’t cause a re-render.Okay. So by using useRef we can:
  // Store a value inside an object
  // Manipulate that value whenever we want without causing a rerender of our component
  // Access that same value on every rerender
}
}

export default Canvas;