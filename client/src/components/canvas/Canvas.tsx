import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Kart, Team, Pellet } from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { map } from "./Maps";
import kartTest from "./../../constants/images";
import { GameOver, useGameOver } from "./gameOver";
import "./CanvasStyles.css";
import { myGameType, roomGameType, teamType, kartType } from "../../types/Types";
import { circleCollidesWithRectangle } from "./circleCollidesWithRectangle";


interface Props {
  gameId: string;
}

function Canvas(props: any) {
  const { gameId } = props;


  const { isOpen, toggle } = useGameOver();
  const colors = ["yellow", "white", "teal", "blue", "white"];
  const lastKeyRef = useRef("");
// const kartRef = useRef<kartType>({
//   position: { x: 60, y: 60 },
//   velocity: { x: 0, y: 0 },
//   radius: 15,
//   angle: 0,
//   imgSrc:  kartTest.kartTest
// })
  const boundariesRef = useRef<Boundary[]>([]);
  const pelletsRef = useRef<Pellet[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 1120, height: 1240 };

  const roomGameRef = useRef<roomGameType>({
    karts: new Map(),
    boundaries: [],
  });

  const myGameRef = useRef<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: {
      teamId: 0,
      color: "",
      playerInControl: "",
      players: { x: "", y: "" },
      kart: {
        position: {
          x: 0,
          y: 0,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        radius: 15,
      },
      changePlayerInControl: () => null,
      score: 0,
    },
  });

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
    boundariesRef.current = tempBoundaries;
  };

  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart = roomGameRef.current.karts.get(myColor);
    if (lastKeyRef.current === "w") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: kart.velocity.x,
                y: -5,
              }
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
          break;
        } else {
          kart.angle = -90;
          //make this based off of velocity instead of lastKey
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
                x: kart.velocity.x,
                y: 5,
              }
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
         
          break;
        } else {
          kart.angle = 90;
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
        console.log("Y movement: kart velocity x: " + kart.velocity.x )
        console.log("Y movement: kart velocity y: " + kart.velocity.y )
        // if (kart.velocity.x === 0 && (lastKeyRef.current === 'w' || lastKeyRef.current === 's')) {
        //     kart.angle = 45;
        //   } 
        //   if (kart.velocity.x === 5) {
        //    kart.angle = 270;
        //   } 
        
        //   if (kart.velocity.x > 0 && (lastKeyRef.current === 'w' || lastKeyRef.current === 's')) {
        //     kart.angle = -45;
        //   } 
        //   if (kart.velocity.x === -5) {
        //     kart.angle = 90;
        //    } 

        kart.velocity.y = 0;
        kart.velocity.x = 0;
        

        // kart.angle += 90;

        // setTimeout(()=> {
        //   kart.angle = 0;
        // }, 500);
      }
    });

    if (kart.velocity.y != 0) {
      lastKeyRef.current = "";
      myGameRef.current.myTeam.changePlayerInControl();
      const tempTeamMate = myGameRef.current.myTeamMate;
      const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
      socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
    }
    return kart;
  };

  const updateKartXMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart = roomGameRef.current.karts.get(myColor);
    if (lastKeyRef.current === "a") {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: -5,
                y: kart.velocity.y,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          break;
        } else {
          kart.angle = 180;
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
                y: kart.velocity.y,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          break;
        } else {
          kart.angle = 0;
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
        console.log("X movement: kart velocity x: " + kart.velocity.x )
        console.log("X movement: kart velocity y: " + kart.velocity.y )
        // if (kart.velocity.y === -5) {
        //   kart.angle = 90;
        // } 
        // if (kart.velocity.y === 5) {
        //   kart.angle = -90;
        // } 

        kart.velocity.x = 0;
        kart.velocity.y = 0;
       
        // setTimeout(()=> {
        //   kart.angle = 0;
        // }, 500);
      }
    });

    if (kart.velocity.x != 0) {
      lastKeyRef.current = "";
      myGameRef.current.myTeam.changePlayerInControl();
      const tempTeamMate = myGameRef.current.myTeamMate;
      const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
      socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
    }

    return kart;
  };

  //canvas animation functions:
  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let updatedKart;//should this be referencing local state?

    if (myGameRef.current.myTeam.playerInControl === socketId) {
      if (myGameRef.current.myControl === "x") {
        updateBoundaries();
        updatedKart = updateKartXMovements();
      } else if (myGameRef.current.myControl === "y") {
        updateBoundaries();
        updatedKart = updateKartYMovements();
      }
      removePellets(pelletsRef.current, updatedKart);
      const tempColor = myGameRef.current.myTeam.color;
      socket.emit("kart_update", { updatedKart, tempColor, gameId });
    }

    const kartsArr = Array.from(roomGameRef.current.karts, function (kart) {
      return { color: kart[0], kart: kart[1] };
    });

    frameRenderer.call(
      context,
      size,
      kartsArr,
      boundariesRef.current,
      pelletsRef.current
    );
  };

  const tick = () => {
    if (!canvasRef.current) return;
    // try {
    //   const t = performance.now();
    //   const nextTick = TimeMath._lastTick + TimeMath._timestep;
    //   let numTicks = 0;
    //   if (t > nextTick) {
    //     numTicks = Math.floor((t - TimeMath._lastTick) / TimeMath._timestep);
    //   }
    //   if (numTicks > 4) {
    //     numTicks = 0;
    //     TimeMath._lastTick = t;
    //   }

    //   if (t - TimeMath._lastFpsUpdate > 200) {
    //     TimeMath._fps =
    //       (0.9 * TimeMath._framesSinceFPSUpdate * 1000) /
    //         (t - TimeMath._lastFpsUpdate) +
    //       0.1 * TimeMath._fps;
    //     Time.fps = TimeMath._fps;
    //     TimeMath._lastFpsUpdate = t;
    //     TimeMath._framesSinceFPSUpdate = 0;
    //   }

    //   TimeMath._framesSinceFPSUpdate++;

    // Update
    // for (let i = 0; i < numTicks; i++) {
    //   TimeMath._lastTick += TimeMath._timestep;
    //   Time.t = TimeMath._lastTick - TimeMath._startTime;
    //   Time.dt = TimeMath._timestep;

    //update(); //this does literally nothing
    renderFrame();
    // }

    // Draw
    //   Time.frame = TimeMath._currentFrame;
    //   Time.frameTime = t;
    //   //draw(); //this moves the square in a circle

    //   TimeMath._currentFrame++;
    // } catch (e) {
    //   //cancelAnimationFrame(requestIdRef.current);
    //   throw e;
    // }
    //renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };


  useEffect(() => {
    const tempBoundaries = boundariesRef.current;
    const tempPellets = pelletsRef.current;
    //map switch case will live here eventually.

    requestIdRef.current = requestAnimationFrame(tick);
    map.forEach((row, i) => {
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
          case ".":
            tempPellets.push(
              new Pellet({
                position: {
                  x: j * Boundary.width + Boundary.width / 2,
                  y: i * Boundary.height + Boundary.height / 2,
                },
              })
            );
            break;
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

  const removePellets = (
    pelletsRef: Pellet[],
    kartRef: {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      radius: number;
    }
  ) => {
    const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
    pelletsRef.forEach((pellet, i) => {
      if (kartRef){
        if (
          Math.hypot(
            pellet.position.x - kartRef.position.x,
            pellet.position.y - kartRef.position.y
          ) <
          pellet.radius + kartRef.radius
        ) {
          pelletsRef.splice(i, 1);
          tempScoreCondition.push("pellet");
          scoreConditionRef.current = tempScoreCondition;
          addScore(scoreConditionRef.current);
          if (pelletsRef.length === 0) {
            console.log("game over")
            toggle(); //this toggles the game over screen, we can rename it lol
            // navigate to game over or put game over on top of the canvas
         }
        }
      }
    });
  };


  const addScore = (scoreConditionArr: string[]) => {
    const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
    if (scoreConditionArr[0] === "pellet") {
      const currentGame = myGameRef.current;
      currentGame.myTeam.score += Pellet.scoreValue;
      const currentScoreCondition = scoreConditionRef.current;
      scoreConditionRef.current = tempScoreCondition;
      console.log(scoreConditionArr);
    }
  };

  //socket handlers:
  useEffect(() => {
    console.count("socket handlers");
    socket.on("receive_client_joined", (data) => {
      myGameRef.current.userList = data;
      const numberOfUsers = data.length;
      if (socketId === data[numberOfUsers - 1]) {
        if (numberOfUsers % 2 === 0) {
          const tempKart = new Kart({
            position: { x: 60 * numberOfUsers, y: 60 },
            velocity: { x: 0, y: 0 }
          }, kartTest.kartTest, 0);
          const tempMyTeam = new Team({
            teamId: numberOfUsers.toString(),
            color: colors[numberOfUsers],
            players: {
              x: data[data.length - 2],
              y: data[data.length - 1],
            },
            kart: tempKart,
            score: 0
          });

          myGameRef.current.myTeamMate = data[numberOfUsers - 2];
          myGameRef.current.myControl = "y";
          myGameRef.current.myTeam = tempMyTeam;
          socket.emit("send_team", { tempMyTeam, gameId });
          //do we need to send Teams update to all clients in room pushing a list of teams and karts into state (like userList)?
        }
      }
    });

    //receive team added will replace receive my team
    socket.on("receive_my_team", (data) => {
      myGameRef.current.myTeam = new Team(data);
      myGameRef.current.myTeamMate = data.players.y;
      myGameRef.current.myControl = "x";
    });
    
    socket.on("receive_team_added", (data) => {
      const tempKart = new Kart({
        position: data.kart.position,
        velocity: data.kart.velocity,
      }, kartTest.kartTest, 0);
      roomGameRef.current.karts.set(data.color, tempKart);
    });

    //a new socket called receive game update (kart, team score, pellets) will replace kart update:
    socket.on("receive_kart_update", (data) => {
      const tempKart = new Kart({
        position: data.kart.position,
        velocity: data.kart.velocity,
      }, kartTest.kartTest, 0);

      roomGameRef.current.karts.set(data.color, tempKart);
    });

    socket.on("receive_toggle_player_control", (data) => {
      myGameRef.current.myTeam.updateTeamWithJson(data);
    });

    //add a clean up method
  }, [socket]);

  //add keyboard event listeners when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        lastKeyRef.current = e.key;
      } else if (e.key === "q") {
        //temp development keypress for state console.logs
        console.log("myGameRef", myGameRef);
        console.log("roomGameRef:", roomGameRef.current);
        console.log("last key", lastKeyRef.current);
      } else if (e.key === "p") {
        //temp development toggle playerControl:
        lastKeyRef.current = "";
        myGameRef.current.myTeam.changePlayerInControl();
        const tempTeamMate = myGameRef.current.myTeamMate;
        const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
        socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={{ color: "white", backgroundColor: "black", alignItems: "center" }}>
      <p>welcome to da game</p>
      <p>
        {myGameRef.current.myTeam.playerInControl === socketId
          ? `YOU ARE IN CONTROL`
          : `your are NOT in control`}
      </p>
      <canvas {...size} ref={canvasRef} />
      <div>
        {/* <button onClick={toggle}>Open GameOver </button> */}
        <GameOver isOpen={isOpen} toggle={toggle}></GameOver>
      </div>
    </div>
    
  );
}

export default Canvas;
