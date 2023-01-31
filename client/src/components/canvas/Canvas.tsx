import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player } from "./gameClasses";

function Canvas() {
  // const [keys, setKeys] = useState({
  //   w: {
  //     pressed: false,
  //   },
  //   a: {
  //     pressed: false,
  //   },
  //   s: {
  //     pressed: false,
  //   },
  //   d: {
  //     pressed: false,
  //   },
  // })
  // const [lastKey, setLastKey] = useState('')
  const lastKeyRef = useRef(''); //because we want to keep those properties across rerenders, and because we want to be able to manipulate those values without causing rerenders of our React component, we store our game objects in ref containers
  const keysPressedRef = useRef({
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
  const playerRef = useRef({position: {x: 60, y: 60}, velocity: {x: 0, y: 0}, radius: 15 })
  const mapRef = useRef<any[][]>([
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
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 700, height: 700 };

  //collision detection function:
  function circleCollidesWithRectangle({ circle, rectangle }: {circle: Player, rectangle: Boundary}) {
    return (
      circle.position.y - circle.radius + circle.velocity.y <=
        rectangle.position.y + Boundary.height &&
      circle.position.x + circle.radius + circle.velocity.x >=
        rectangle.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >=
        rectangle.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <=
        rectangle.position.x + Boundary.width
    );
  }

  //updates Boundaries flat array based on map.
  const updateBoundaries = () => {
    const tempBoundaries: ((prevState: never[]) => never[]) | Boundary[] = [];
    mapRef.current.forEach((row: any[], i: number) => {
      row.forEach((symbol: any, j: number) => {
        switch (symbol) {
          case '-':
            tempBoundaries.push(
              new Boundary({
                position: {
                  x: Boundary.width * j,
                  y: Boundary.height * i,
                }
              })
            );
            break;
        }
      });
    });
    setBoundaries(tempBoundaries)
  }

  //updates player movement based on collision detection
  const updatePlayer = () => {
    const player = playerRef.current;
    if (keysPressedRef.current.w.pressed && lastKeyRef.current === 'w') {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: -5,
              },
            },
            rectangle: boundary,
          })//are we colliding with any boundaries in the next frame if we move up or press 'w'?
        ) {
          player.velocity.y = 0; //if collision is detected-- stop player movement
          break;
        } else {
          player.velocity.y = -5; //if not colliding, move player up
        }
        
      }
    } else if (keysPressedRef.current.a.pressed && lastKeyRef.current === 'a') {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: -5,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.x = 0;
          break;
        } else {
          player.velocity.x = -5;
        }
      }
    } else if (keysPressedRef.current.s.pressed && lastKeyRef.current === 's') {
      for (let i = 0; i < boundaries.length; i++) {
        console.log(player);
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: 5,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = 5;
        }
        
      }
    } else if (keysPressedRef.current.d.pressed && lastKeyRef.current === 'd') {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...player,
              velocity: {
                x: 5,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          playerRef.current = {...playerRef.current, velocity: {x: 0, y: 0} };
          break;
        } else {
          playerRef.current = {...playerRef.current, velocity: {x: 5, y: 0} };
        }
      }
    }

    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    boundaries.forEach((boundary) => {

      if (
        circleCollidesWithRectangle({
          circle: player,
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        player.velocity.x = 0;
      }
    });
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
    updateBoundaries();
    updatePlayer(); //updates player velocity and location using collision detection logic
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

  
  //add keyboard event listeners when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d"){
        lastKeyRef.current = e.key;
        keysPressedRef.current = {
          ...keysPressedRef.current, 
          [e.key]: {
          pressed: true,
        }}
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d"){
        keysPressedRef.current = {
          ...keysPressedRef.current, 
          [e.key]: {
          pressed: false,
        }}
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [])

  return (
    <div 
      // onKeyDown = {(e)=> handleKeyDownEvent(e)}
      // onKeyUp = {(e)=> handleKeyUpEvent(e)}
      >
        <p>welcome to da game</p>
        
      <canvas {...size} ref={canvasRef} />
    </div>
  );
  //pass canvasRef to canvas element-we will be able to access a reference to the canvas element in our DOM so we can access its 2D drawing context, later on. a call to useRef will return a mutable object. This means that we can alter the value of its .current property without unexpected behavior or side effects. we can alter that value and it will not cause a rerender of our component.  Mutating the .current property doesn’t cause a re-render.Okay. So by using useRef we can:
  // Store a value inside an object
  // Manipulate that value whenever we want without causing a rerender of our component
  // Access that same value on every rerender
}

export default Canvas;