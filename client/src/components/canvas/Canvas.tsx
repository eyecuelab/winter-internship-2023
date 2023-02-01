import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player } from "./gameClasses";

import SocketHandling from "../socketHandling/socketHandling";
import * as io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");

function Canvas() {
  const lastKeyRef = useRef('');
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
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = -5;
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
    if(!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if(!context) {
      return;
    } 
    updateBoundaries();
    updatePlayer();
    frameRenderer.call(context, size, playerRef.current, mapRef.current);
  };


  const tick = () => {
    if (!canvasRef.current) return;
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
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

  function handleKeyPress(e: KeyboardEvent) { //
    console.log(e);// arrow keys don't work yet
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === " ") { //this works to recognize the key
      console.log("send it !!!!!"); // wasd and space are sorted, we can now send that information to the server
      //keypress(e.key);
    }
    else {
      console.log("don't send it");
    };
  }
  document.body.classList.add('background-black');
  return ( 
    <div  style={{color: "white", backgroundColor: "black"}}>
      <p>welcome to da game</p>
      <canvas {...size} ref={canvasRef} />
      <SocketHandling />
    </div>
  );
}

export default Canvas;