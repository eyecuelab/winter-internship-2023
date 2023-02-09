import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Kart, Team, Pellet } from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { map } from "./Maps";
import kartTest from "./../../constants/images";
import { kartType } from "./../../types/Types";

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

  const kartRef = useRef<kartType>({
    position: { x: 60, y: 60 },
    velocity: { x: 0, y: 0 },
    radius: 15,
    imgSrc:  kartTest.kartTest
  });

  const boundariesRef = useRef<Boundary[]>([]);
  const pelletsRef = useRef <Pellet[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 1120, height: 1240 };

  const currentGameRef = useRef<{
    userList: [];
    myTeamMate: string;
    myControl: string;
    myTeam: Team;
  }>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: {
      players: { x: "", y: "" },
      playerInControl: "x",
      changePlayerInControl: () => null,
      score: 0
    },
  });

  //collision detection function:
  function circleCollidesWithRectangle({
    circle,
    rectangle,
  }: {
    circle: Kart;
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
    map.forEach((row: any[], i: number) => {
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

  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = () => {
    const kart = kartRef.current;

    if (lastKeyRef.current === "w") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: kartRef.current.velocity.x,
                y: -5,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
          break;
        } else {
          kart.velocity.y = -5;
        }
      }
    } else if (lastKeyRef.current === "s") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: kartRef.current.velocity.x,
                y: 5,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
          break;
        } else {
          kart.velocity.y = 5;
        }
      }
    }
    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;
    boundariesRef.current.forEach((boundary) => {
      if (
        circleCollidesWithRectangle({
          circle: kart,
          rectangle: boundary,
        })
      ) {
        kart.velocity.y = 0;
        kart.velocity.x = 0;
      }
    });
    if (kart.velocity.y != 0) {
      const tempTeam = currentGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      currentGameRef.current.myTeam = tempTeam;
      socket.emit("toggle_player_control", currentGameRef.current.myTeamMate);
      lastKeyRef.current = "";
    }
  };

  const updateKartXMovements = () => {
    const kart = kartRef.current;

    if (lastKeyRef.current === "a") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: -5,
                y: kartRef.current.velocity.y,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          break;
        } else {
          kart.velocity.x = -5;
        }
      }
    } else if (lastKeyRef.current === "d") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: 5,
                y: kartRef.current.velocity.y,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          break;
        } else {
          kart.velocity.x = 5;
        }
      }
    }
    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;

    boundariesRef.current.forEach((boundary) => {
      if (
        circleCollidesWithRectangle({
          circle: kart,
          rectangle: boundary,
        })
      ) {
        kart.velocity.x = 0;
        kart.velocity.y = 0;
      }
    });
    if (kart.velocity.x != 0) {
      const tempTeam = currentGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      currentGameRef.current.myTeam = tempTeam;
      socket.emit("toggle_player_control", currentGameRef.current.myTeamMate);
      lastKeyRef.current = "";
    }
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
      if (currentGameRef.current.myControl === "x") {
        updateBoundaries();
        updateKartXMovements();
      } else if (currentGameRef.current.myControl === "y") {
        updateBoundaries();
        updateKartYMovements();
      }
      const tempKart = kartRef.current;
      socket.emit("kart_update", { tempKart, gameId });
    }
    removePellets(pelletsRef.current, kartRef.current)
    frameRenderer.call(context, size, kartRef.current, boundariesRef.current, pelletsRef.current);
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
    const tempBoundaries = boundariesRef.current;
    const tempPellets = pelletsRef.current;
    requestIdRef.current = requestAnimationFrame(tick);
    map.forEach((row, i) => {
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
          case '.':
            tempPellets.push(
              new Pellet({
                position: {
                  x: j * Boundary.width + Boundary.width / 2,
                  y: i * Boundary.height + Boundary.height / 2
                }
              })
            )
            break
        }
      });
    });
    boundariesRef.current = tempBoundaries;
    pelletsRef.current = tempPellets;
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  const scoreConditionRef = useRef<string[]>([]);

  const removePellets = (pelletsRef : Pellet[], kartRef : { position: { x: number; y: number; }; velocity: { x: number; y: number; }; radius: number; }) => {

    const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
    pelletsRef.forEach((pellet, i) => {
      if (Math.hypot(
        pellet.position.x - kartRef.position.x,
        pellet.position.y - kartRef.position.y) < pellet.radius + kartRef.radius) {
        pelletsRef.splice(i, 1)
        tempScoreCondition.push("pellet");
        scoreConditionRef.current = tempScoreCondition;
        addScore(scoreConditionRef.current);
      }
    })
  }

  const addScore = (scoreConditionArr: string[]) => {
    const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
    if (scoreConditionArr[0] === "pellet") {
      const currentGame = currentGameRef.current;
      currentGame.myTeam.score += Pellet.scoreValue;
      const currentScoreCondition = scoreConditionRef.current;
      scoreConditionRef.current = tempScoreCondition;
      console.log(currentGame.myTeam.score);
    }
  }

  //socket handlers:
  useEffect(() => {
    // const startGame = (socketUser1: string, socketUser2: string) => {
    //   const tempTeam = new Team({
    //     players: { x: socketUser1, y: socketUser2 },
    //   });
    //   setMyTeam(tempTeam);
    // };

    socket.on("client_joined", (data) => {
      currentGameRef.current.userList = data;
      if (socketId === data[data.length - 1]) {
        if (data.length % 2 === 0) {
          const tempMyTeam = new Team({
            players: {
              x: data[data.length - 2],
              y: data[data.length - 1],
              } }, {
             score: 0
            });
          
          currentGameRef.current.myTeamMate = data[data.length - 2];
          currentGameRef.current.myControl = "y";
          currentGameRef.current.myTeam = tempMyTeam;
          socket.emit("send_team", {
            x: data[data.length - 2],
            y: data[data.length - 1],
            score: 0
          });
        }
      }
    });

    socket.on("receive_my_team", (data) => {
      const tempMyTeam = new Team({
        players: {
          x: data.x,
          y: data.y,
        } }, {score: 0 }
        );
      currentGameRef.current.myTeam = tempMyTeam;
      currentGameRef.current.myTeamMate = data.y;
      currentGameRef.current.myControl = "x";
    });

    socket.on("receive_kart_update", (data) => {
      kartRef.current = data;
    });

    socket.on("receive_toggle_player_control", () => {
      console.log("receive toggle");
      const tempTeam = currentGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      currentGameRef.current.myTeam = tempTeam;
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
        console.log(kartRef.current);
      } else if (e.key === "p") {
        //practice toggle playerControl:
        const tempTeam = currentGameRef.current.myTeam;
        tempTeam.changePlayerInControl();
        currentGameRef.current.myTeam = tempTeam;

        socket.emit("toggle_player_control", currentGameRef.current.myTeamMate);
        console.log("toggle:", kartRef.current);
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
    </div>
  );
}

export default Canvas;
