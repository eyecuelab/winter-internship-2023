import React, { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Kart, Team, Pellet } from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { gameMap } from "./Maps";
import kartTest from "./../../constants/images";
import { GameOver, useGameOver } from "./gameOver";
import "./CanvasStyles.css";
import {
  kartType,
  myGameType,
  roomGameType,
  teamType,
  pelletType
} from "../../types/Types";
import { circleCollidesWithRectangle } from "./circleCollidesWithRectangle";
import mapSwitchCase from "./mapSwitchCase";

interface Props {
  gameId: string;
}

function Canvas(props: any) {
  const { gameId } = props;

  const scoreConditionRef = useRef<string[]>([]);
  const { isOpen, toggleGameOver } = useGameOver();
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
    scores: new Map(),
    boolOfGameStatus: false
  });

  const myGameRef = useRef<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(),
  });

  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart = roomGameRef.current.karts.get(myColor) || {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      radius: 0,
      imgSrc: "",
      angle: 0,
    };

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
              },
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
              },
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
        //console.log("Y movement: kart velocity x: " + kart.velocity.x);
        //console.log("Y movement: kart velocity y: " + kart.velocity.y);
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
      //console.log("y");
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
    const kart = roomGameRef.current.karts.get(myColor) || {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      radius: 0,
      imgSrc: "",
      angle: 0,
    };

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
        //console.log("X movement: kart velocity x: " + kart.velocity.x);
        //console.log("X movement: kart velocity y: " + kart.velocity.y);
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
      //console.log("x");
      lastKeyRef.current = "";
      myGameRef.current.myTeam.changePlayerInControl();
      const tempTeamMate = myGameRef.current.myTeamMate;
      const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
      socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
    }

    return kart;
  };

  //pellets and score:
  const removePellets = (pelletsRef: Pellet[], kartRef: Kart | undefined) => {
    const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
    pelletsRef.forEach((pellet, i) => {
      if (kartRef) {
        if (
          Math.hypot(
            pellet.position.x - kartRef.position.x,
            pellet.position.y - kartRef.position.y
          ) <
            pellet.radius + kartRef.radius &&
          pellet.isVisible === true
        ) {
          pellet.isVisible = false;
          //socket emit that the pellet is gone
           // make this also send if the game is over
          //assuming the socket server holds the entire array, it would only need to receive something to tell which pellet in the array is gone
          //pelletsRef.splice(i, 1);
          // tempScoreCondition.push("pellet");
          // scoreConditionRef.current = tempScoreCondition;
          // addScore(scoreConditionRef.current);
          updateScore(10);
          //we need to go through each ref in the array, and if there is a single true in it, we return that gameOver is false
          const boolOfGameStatus = isGameOver(pelletsRef);
          socket.emit("remove_pellet", { gameId, i, boolOfGameStatus })
          //eliminate the whole function
          if (boolOfGameStatus) {
            toggleGameOver();
          }
           
        }
      }
    });
  };

const isGameOver = (pelletsRef: Pellet[]) => {
  for(let i = 0; i < pelletsRef.length; i++){
    if (pelletsRef[i].isVisible === true){
      return false;
    }
  }
  return true;
}

  const updateScore = (pointValue: number) => {
    let updatedScore:number = roomGameRef.current.scores.get(myGameRef.current.myTeam.color) ?? 0;
    updatedScore += pointValue;
    roomGameRef.current.scores.set(myGameRef.current.myTeam.color, updatedScore);
  }

  // const addScore = (scoreConditionArr: string[]) => {
  //   const tempScoreCondition: ((prevState: never[]) => never[]) | string[] = [];
  //   if (scoreConditionArr[0] === "pellet") {
  //     const currentGame = myGameRef.current;
  //     currentGame.myTeam.score += Pellet.scoreValue;
  //     const currentScoreCondition = scoreConditionRef.current;
  //     scoreConditionRef.current = tempScoreCondition;
  //     console.log(scoreConditionArr);
  //   }
  // };

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

    let updatedKart; //should this be referencing local state?

    if (myGameRef.current.myTeam.playerInControl === socketId) { 
      if (myGameRef.current.myControl === "x") {
        updatedKart = new Kart(updateKartXMovements());
      } else if (myGameRef.current.myControl === "y") {
        updatedKart = new Kart(updateKartYMovements());
      }

      removePellets(pelletsRef.current, updatedKart);//consolidate this emit with game_update

      const tempColor = myGameRef.current.myTeam.color;
      const jsonKart = JSON.stringify(updatedKart);
      const tempScore = roomGameRef.current.scores.get(tempColor);

      socket.emit("game_update", { jsonKart, tempColor, tempScore, gameId });
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
        // renderFrame();
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
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const { boundaries, pellets } = mapSwitchCase(gameMap);
    boundariesRef.current = boundaries;
    pelletsRef.current = pellets;

    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //socket handlers:
  useEffect(() => {
    console.count("socket handlers");

    socket.on("receive_client_joined", (data) => {
      myGameRef.current.userList = data;
      const numberOfUsers = data.length;
      if (socketId === data[numberOfUsers - 1]) {
        if (numberOfUsers % 2 === 0) {
          const tempMyKart = new Kart({
            position: { x: 60 * numberOfUsers, y: 60 },
            velocity: { x: 0, y: 0 },
            imgSrc: kartTest.kartTest,
            angle: 0,
          });
          const tempMyTeam = new Team({
            teamId: numberOfUsers.toString(),
            color: colors[numberOfUsers],
            players: {
              x: data[numberOfUsers - 2],
              y: data[numberOfUsers - 1],
            },
            score: 0,
          });

          myGameRef.current.myTeamMate = data[numberOfUsers - 2];
          myGameRef.current.myControl = "y";
          myGameRef.current.myTeam = tempMyTeam;
          myGameRef.current.myKart = tempMyKart;

          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(tempMyTeam);
          const jsonKart = JSON.stringify(tempMyKart);
          socket.emit("send_team", {
            jsonTeam,
            jsonKart,
            gameId,
            tempTeamMate,
          });
        }
      }
    });

    socket.on("receive_team_added", (data) => {
      const { jsonTeam, jsonKart } = data;
      const tempTeam = new Team(JSON.parse(jsonTeam));
      const tempKart = new Kart(JSON.parse(jsonKart));

      if (tempTeam.players.x === socketId) {
        myGameRef.current.myTeam.updateTeamWithJson(jsonTeam);
        myGameRef.current.myKart.updateKartWithJson(jsonKart);
        myGameRef.current.myControl = "x";
        myGameRef.current.myTeamMate = myGameRef.current.myTeam.players.y;
      }

      roomGameRef.current.karts.set(tempTeam.color, tempKart);
    });

    //pellet, scores, and power-up updates can live here eventually:
    socket.on("receive_game_update", (data) => {
      const { tempColor, jsonKart, tempScore } = data;
      const tempKart = new Kart(JSON.parse(jsonKart));
      roomGameRef.current.karts.set(tempColor, tempKart);
      roomGameRef.current.scores.set(tempColor, tempScore);
      displayScores();
      //console.log(roomGameRef.current.scores);
    });

    socket.on("pellet_gone", (data) => {
      const {i, boolOfGameStatus} = data;
      //update the pellet array
      pelletsRef.current[i].isVisible = false;
      //pellet at pellet.position = false;
      if(boolOfGameStatus) {
        toggleGameOver();
      }
    });

    socket.on("receive_toggle_player_control", (data) => {
      myGameRef.current.myTeam.updateTeamWithJson(data);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  const displayScores = () => {
    const scoresArr = Array.from(roomGameRef.current.scores, function (score) {
      return { color: score[0], score: score[1] };
      
    });
    console.log(scoresArr); // in the array, you reference the object's score
    // for each item in the array, display ojbject.score
    // let scoresList = document.getElementById("scoresList");
    let teamOne = document.getElementById("team1");
    let teamTwo = document.getElementById("team2");

    if (teamOne && scoresArr[0]) {
      teamOne.innerText = scoresArr[0]["score"].toString();
    }
    if (teamTwo && scoresArr[1]) {
      teamTwo.innerText = scoresArr[1]["score"].toString();
    }
   
    // if(scoresList){
    //   for(let i = 0; i <scoresArr.length; i++) {
    //     let li = document.createElement("li");
    //     li.innerText = scoresArr[i]["score"].toString();
    //     scoresList.appendChild(li);
    //   }
    // }
    
  }

  //add keyboard event listeners when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        lastKeyRef.current = e.key;
      } else if (e.key === "q") {
        //temp development keypress for state //console.logs
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
    <>
      <div
        style={{
          color: "white",
          backgroundColor: "black",
          alignItems: "center",
        }}
      >
        <p>welcome to da game</p>
        <p>my team: {myGameRef.current.myTeam.color}</p>
        <p>
          {myGameRef.current.myTeam.playerInControl === socketId
            ? `YOU ARE IN CONTROL`
            : `your are NOT in control`}
        </p>
        <p>scores:</p>
        <ul>
          <li id="team1"></li>
          <li id="team2"></li>
        </ul>
        <canvas {...size} ref={canvasRef} />
        <div>
          {/* <button onClick={toggle}>Open GameOver </button> */}
          <GameOver isOpen={isOpen} toggleGameOver={toggleGameOver} ></GameOver>
        </div>
      </div>
    </>
  );
}

export default Canvas;
