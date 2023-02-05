import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player, Team } from "./gameClasses";
import { socketID, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";

// import SocketHandling from "../socketHandling/socketHandling";
// import * as io from 'socket.io-client';
// const socket = io.connect("http://localhost:3001");
interface Props {
  gameId: string;
}

function Canvas(props: any) {
  const { gameId } = props;
  const lastKeyRef = useRef("");

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
  });

  const playerRef = useRef({
    position: { x: 60, y: 60 },
    velocity: { x: 0, y: 0 },
    radius: 15,
  });

  const mapRef = useRef<any[][]>([
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "_", ".", ".", ".", ".", "-"],
    ["-", ".", "-", "-", ".", ".", ".", "-", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", "-", ".", ".", ".", "-", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", ".", ".", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ]);

  const boundariesRef = useRef<Boundary[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 700, height: 700 };

  const currentGameRef = useRef({
    userList: [],
    myTeam: { players: { x: "", y: "" }, playerInControl: "x" },
  });

  //collision detection function:
  function circleCollidesWithRectangle({
    circle,
    rectangle,
  }: {
    circle: Player;
    rectangle: Boundary;
  }) {
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
          case "-":
            tempBoundaries.push(
              new Boundary({
                position: {
                  x: Boundary.width * j,
                  y: Boundary.height * i,
                },
              })
            );
            break;
        }
      });
    });
    // setBoundaries(tempBoundaries)
    boundariesRef.current = tempBoundaries;
  };

  //updates player movement based on collision detection
  const updatePlayer = () => {
    const player = playerRef.current;
    if (keysPressedRef.current.w.pressed && lastKeyRef.current === "w") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
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
    } else if (keysPressedRef.current.a.pressed && lastKeyRef.current === "a") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
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
    } else if (keysPressedRef.current.s.pressed && lastKeyRef.current === "s") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
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
    } else if (keysPressedRef.current.d.pressed && lastKeyRef.current === "d") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
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
          playerRef.current = {
            ...playerRef.current,
            velocity: { x: 0, y: 0 },
          };
          break;
        } else {
          playerRef.current = {
            ...playerRef.current,
            velocity: { x: 5, y: 0 },
          };
        }
      }
    }

    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    boundariesRef.current.forEach((boundary) => {
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

  //canvas animation functions:
  const renderFrame = () => {
    //updates properties of drawn elements (ball in example) and then draws it on canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    if(currentGameRef.current.myTeam.playerInControl === socketID){
      updateBoundaries();
      updatePlayer();
      const tempPlayer = playerRef.current;
      socket.emit("player_update", { tempPlayer, gameId });
    }

    frameRenderer.call(context, size, playerRef.current, mapRef.current);
  };

  const tick = () => {
    if (!canvasRef.current) return;
    try {
      const t = performance.now();
      const nextTick = TimeMath._lastTick + TimeMath._timestep;
      let numTicks = 0;
      if (t > nextTick) {
        numTicks = Math.floor((t - TimeMath._lastTick) / TimeMath._timestep);
      }
      if (numTicks > 4) {
        numTicks = 0;
        TimeMath._lastTick = t;
      }

      if (t - TimeMath._lastFpsUpdate > 200) {
        TimeMath._fps =
          (0.9 * TimeMath._framesSinceFPSUpdate * 1000) /
            (t - TimeMath._lastFpsUpdate) +
          0.1 * TimeMath._fps;
        Time.fps = TimeMath._fps;
        TimeMath._lastFpsUpdate = t;
        TimeMath._framesSinceFPSUpdate = 0;
      }

      TimeMath._framesSinceFPSUpdate++;

      // Update
      for (let i = 0; i < numTicks; i++) {
        TimeMath._lastTick += TimeMath._timestep;
        Time.t = TimeMath._lastTick - TimeMath._startTime;
        Time.dt = TimeMath._timestep;

        //update(); //this does literally nothing
        renderFrame();
      }

      // Draw
      Time.frame = TimeMath._currentFrame;
      Time.frameTime = t;
      //draw(); //this moves the square in a circle

      TimeMath._currentFrame++;
    } catch (e) {
      //cancelAnimationFrame(requestIdRef.current);
      throw e;
    }
    //renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //socket handlers:
  useEffect(() => {
    // const startGame = (socketUser1: string, socketUser2: string) => {
    //   const tempTeam = new Team({
    //     players: { x: socketUser1, y: socketUser2 },
    //   });
    //   setMyTeam(tempTeam);
    // };

    socket.on("room_and_users", (data: Array<any>) => {
      const socketIds = data[1];
      currentGameRef.current.userList = socketIds;
      if (socketIds.length % 2 === 0) {
        const tempMyTeam = new Team({
          players: {
            x: socketIds[socketIds.length - 2],
            y: socketIds[socketIds.length - 1],
          },
        });

        currentGameRef.current.myTeam = tempMyTeam;
        socket.emit("send_team", {
          x: socketIds[socketIds.length - 2],
          y: socketIds[socketIds.length - 1],
        });
      }
      console.log(
        "room and users",
        data,
        currentGameRef.current.myTeam
          ? currentGameRef.current.myTeam
          : "no team created"
      );
    });

    socket.on("receive_my_team", (data) => {
      console.log("receive_my_team", data);
      const tempMyTeam = new Team({
        players: {
          x: data.x,
          y: data.y,
        },
      });
      currentGameRef.current.myTeam = tempMyTeam;
    });

    socket.on("client_joined", (data) => {
      console.log("client_joined", data);
      currentGameRef.current.userList = data;
    });

    socket.on("receive_player_update", (data) => {
      playerRef.current = data;
    });
  }, [socket]);

  //add keyboard event listeners when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        lastKeyRef.current = e.key;
        keysPressedRef.current = {
          ...keysPressedRef.current,
          [e.key]: {
            pressed: true,
          },
        };
      } else if (e.key === "q") {
        console.log("userList:", currentGameRef.current.userList);
        console.log("myTeam:", currentGameRef.current.myTeam);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        keysPressedRef.current = {
          ...keysPressedRef.current,
          [e.key]: {
            pressed: false,
          },
        };
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ color: "white", backgroundColor: "black" }}>
      <p>welcome to da game</p>
      <canvas {...size} ref={canvasRef} />

      {/* socketHandling: */}
      <div className="SocketHandling">
        {/* <button onClick={joinPublic}>Join a public game!</button> */}
        <h1>inputs below:</h1>
        <ul>
          <li>{currentGameRef.current.userList[0]}</li>
          <li>{currentGameRef.current.userList[1]}</li>
          <li>{currentGameRef.current.userList[2]}</li>
          <li>{currentGameRef.current.userList[3]}</li>
        </ul>
      </div>
    </div>
  );
}

export default Canvas;
