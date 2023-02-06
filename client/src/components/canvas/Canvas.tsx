import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player, Team } from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
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

  const currentGameRef = useRef<{
    userList: [];
    myTeamMate: string;
    myTeam: Team;
  }>({
    userList: [],
    myTeamMate: "",
    myTeam: {
      players: { x: "", y: "" },
      playerInControl: "x",
      changePlayerInControl: () => null,
    },
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
          player.velocity.x = 0;
          break;
        } else {
          player.velocity.x = 5;
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

    if (currentGameRef.current.myTeam.playerInControl === socketId) {
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

    socket.on("client_joined", (data) => {
      console.log("client_joined", data);
      currentGameRef.current.userList = data;

      if (data.length % 2 === 0) {
        if (socketId === data[data.length - 1]) {
          const tempMyTeam = new Team({
            players: {
              x: data[data.length - 2],
              y: data[data.length - 1],
            },
          });
          currentGameRef.current.myTeamMate = data[data.length - 2];
          currentGameRef.current.myTeam = tempMyTeam;
          socket.emit("send_team", {
            x: data[data.length - 2],
            y: data[data.length - 1],
          });
        }
      }
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
      currentGameRef.current.myTeamMate = data.y;
    });

    socket.on("receive_player_update", (data) => {
      playerRef.current = data;
    });

    socket.on("receive_toggle_player_control", (data) => {
      currentGameRef.current.myTeam = data;
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
        console.log("myTeamMate:", currentGameRef.current.myTeamMate);
        const tempTeam = currentGameRef.current.myTeam.changePlayerInControl();
      } else if (e.key === "p") {
        //practice toggle playerControl:
        let tempTeam = currentGameRef.current.myTeam;
        const myTeammate =
          socketId === currentGameRef.current.myTeam.players.x
            ? currentGameRef.current.myTeam.players.y
            : currentGameRef.current.myTeam.players.x;
        if (
          currentGameRef.current.myTeam.playerInControl ===
          currentGameRef.current.myTeam.players.x
        ) {
          currentGameRef.current.myTeam.playerInControl =
            currentGameRef.current.myTeam.players.y;
          tempTeam.playerInControl = currentGameRef.current.myTeam.players.y;
        } else {
          currentGameRef.current.myTeam.playerInControl =
            currentGameRef.current.myTeam.players.x;
          tempTeam.playerInControl = currentGameRef.current.myTeam.players.x;
        }
        socket.emit("toggle_player_control", { tempTeam, myTeammate });
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
