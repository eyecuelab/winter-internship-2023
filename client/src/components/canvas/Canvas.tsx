import React, { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import {
  Boundary,
  Kart,
  Team,
  Pellet,
  SpawnPoint,
  GameMap,
} from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { gameMap } from "./Maps";
import kartTest from "./../../constants/images";
import { GameOver } from "./gameOver";
import "./CanvasStyles.css";
import { myGameType, roomGameType, kartType } from "../../types/Types";
import { circleCollidesWithRectangle } from "./circleCollidesWithRectangle";
import mapSwitchCase from "./mapSwitchCase";
import { generateMapQuadrants, quadrants } from "./quadrants";
import { circleCollidesWithCircle } from "./circleCollidesWithCircle";
import { postData } from "../../apiHelper";
import {mapBrickSvgString} from "../../assets/mapBrickSvg";
import {pelletSvgString} from "../../assets/pelletSvg";

function Canvas(props: any) {
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const { gameId } = props;
  const colors = ["yellow", "white", "teal", "blue", "orange"];
  const mapBrickSvgRef = useRef<HTMLImageElement | undefined>();
  const pelletSvgRef = useRef<HTMLImageElement | undefined>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 1120, height: 1240 };
  const canvasBorderRef = useRef<object>({});

  const boundariesRef = useRef<Boundary[]>([]);
  const pelletsRef = useRef<Pellet[]>([]);
  const spawnPointsRef = useRef<SpawnPoint[]>([]);
  const lastKeyRef = useRef("");

  const roomGameRef = useRef<roomGameType>({
    karts: new Map(),
    scores: new Map(),
    isGameOver: false,
  });

  const myGameRef = useRef<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(), // deprecated
  });

  const teamId = useRef<number | null>(null);

  //GAME OVER FUNCTIONS:
  const toggleGameOver = () => {
    setIsGameOverModalOpen(!isGameOverModalOpen);
  };

  const hasPellets = () => {
    for (let i = 0; i < pelletsRef.current.length; i++) {
      if (pelletsRef.current[i].isVisible === true) {
        return false;
      }
    }
    return true;
  };

  const kill = (/*victimsColor: string, */spawnNum: number) => {

    console.log("I was killed!")
    const kart = roomGameRef.current.karts.get(myGameRef.current.myTeam.color)

  


    // const kart:Kart|undefined = roomGameRef.current.karts.get(victimsColor);
    if (kart) {
      kart.isGhost = true;
      kart.position = spawnPointsRef.current[spawnNum].position
      kart.velocity = { x: 0, y: 0}
    //   roomGameRef.current.karts.set(victimsColor, kart)
      

      /*this technically works but the other users send out the information that their isGhost is false still */
    }
  }
  //UPDATE GAME STATE FUNCTIONS:
  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart: Kart = roomGameRef.current.karts.get(myColor) ?? new Kart(); //not sure about this..
    const previousXVelocity = kart.velocity.x;

    if (lastKeyRef.current === "w" && (kart.position.x - 20) % 40 === 0) {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: 0,
                y: -5,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
          kart.velocity.x = previousXVelocity;
          break;
        } else {
          kart.angle = -90;
          kart.velocity.y = -5;
          kart.velocity.x = 0;
          kart.angle =
            Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    } else if (
      lastKeyRef.current === "s" &&
      (kart.position.x - 20) % 40 === 0
    ) {
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
          kart.velocity.x = previousXVelocity;
          break;
        } else {
          kart.angle = 90;
          kart.velocity.y = 5;
          kart.velocity.x = 0;
          kart.angle =
            Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    }
    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;

    //

    if (kart.isGhost === true) {
      const kartsArr = Array.from(roomGameRef.current.karts, function (entry) {
        return { color: entry[0], pacmanKart: entry[1] };
      }); //[{color: "teal", pacmanKart: {}}, {color: "orange", pacmanKart: {}}]

      const aliveKartsArr: any[] = [];

      kartsArr.forEach((mapargument) => {
        if (mapargument.pacmanKart.isGhost === false) {
          aliveKartsArr.push(mapargument);
        }
      });

      aliveKartsArr.forEach((item) => {
        if(item){
         
            if (circleCollidesWithCircle({ghost: kart, paCart: item.pacmanKart})){
              const spawnNum = Math.floor(Math.random() * 4)
              
              //kill(item.color, spawnNum)
              kart.isGhost = false;
              const victim = item.color
              socket.emit("player_killed", { victim, spawnNum, gameId })
              /*
              todo: 
              this function sets own .isGhost to false
              maybe done
              

              kill function moves victim location and velocity to a set point
              maybe done

              socket emit from here with the correct data (killer, victim, spawn number)


              make the socket receiver that takes in the above 3 things and also does the things
              (turns killer .isGhost to false, turns victim's .isGhost to true, moves victim to spawn point and changes their velocity to (0, 0))

              */






              //myGameRef.current.myTeam.ghost = false
              //socket.emit("consume", myGameRef.current.myTeam.color , paCart) //sends the 2 colors so that the other clients do the above 2 lines
              // make the server and receiver for this emit
            }
        }
      });
    }
    //

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
    return kart;
  };

  const updateKartXMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart: Kart = roomGameRef.current.karts.get(myColor) ?? new Kart(); //not sure about this..

    const previousYVelocity = kart.velocity.y;

    if (lastKeyRef.current === "a" && (kart.position.y - 20) % 40 === 0) {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: -5,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          kart.velocity.y = previousYVelocity;
          break;
        } else {
          kart.angle = 180;
          kart.velocity.x = -5;
          kart.velocity.y = 0;
          kart.angle =
            Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    } else if (
      lastKeyRef.current === "d" &&
      (kart.position.y - 20) % 40 === 0
    ) {
      for (let i = 0; i < boundariesRef.current.length; i++) {
        const boundary = boundariesRef.current[i];
        if (
          circleCollidesWithRectangle({
            circle: {
              ...kart,
              velocity: {
                x: 5,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          kart.velocity.x = 0;
          kart.velocity.y = previousYVelocity;
          break;
        } else {
          kart.angle = 0;
          kart.velocity.x = 5;
          kart.velocity.y = 0;
          kart.angle =
            Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    }

    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;
    if (kart.isGhost === true) {
      const aliveKartsArr = Array.from(
        roomGameRef.current.karts,
        function (entry) {
          if (entry[1].isGhost === false) {
            // return [ entry[0], entry[1] ];
            return { color: entry[0], pacmanKart: entry[1] }; //[{color: "teal", kart: kart}, {"orange", kart}]
          }
        }
      );
      //console.log(aliveKartsArr);

      aliveKartsArr.forEach((item) => {
        if(item){
            if (circleCollidesWithCircle({ghost:kart, paCart: item.pacmanKart})){
              const spawnNum = Math.floor(Math.random() * 4)
              
              //kill(item.color, spawnNum)
              console.log("pacman killed! on the x axis controlled person");
              kart.isGhost = false;
              console.log(item);
              const victim = item.color //{"orange", kart} item.kart jsonified
              socket.emit("player_killed", { victim, spawnNum, gameId })
              //myGameRef.current.myTeam.ghost = false
              //socket.emit("consume", myGameRef.current.myTeam.color , paCart) //sends the 2 colors so that the other clients do the above 2 lines
              // make the server and receiver for this emit
            }
        }
      });
    }
    //run circle collides with circle here for each player
    //ghosts will only check for each instance of a player

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

    return kart;
  };

  const removePellets = (pelletsRef: Pellet[], kartRef: Kart | undefined) => {
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
          updateScore(10);
          const isGameOver = hasPellets();

          if (isGameOver) {
            const tempColor = myGameRef.current.myTeam.color;
            const jsonKart = JSON.stringify(kartRef);
            const tempScore = roomGameRef.current.scores.get(tempColor);

            socket.emit("game_update", {
              jsonKart,
              tempColor,
              tempScore,
              gameId,
            });
            toggleGameOver();
          }
          socket.emit("remove_pellet", { gameId, i, isGameOver });
        }
      }
    });
  };

  const updateScore = (pointValue: number) => {
    let updatedScore: number =
      roomGameRef.current.scores.get(myGameRef.current.myTeam.color) ?? 0;
    updatedScore += pointValue;
    roomGameRef.current.scores.set(
      myGameRef.current.myTeam.color,
      updatedScore
    );
  };

  const updatePlayerControl = () => {
    if (myGameRef.current.myTeam.playerInControl === socketId) {
      const kart = roomGameRef.current.karts.get(
        myGameRef.current.myTeam.color
      );
      if (myGameRef.current.myControl === "x") {
        if (kart?.velocity.x != 0) {
          lastKeyRef.current = "";
          myGameRef.current.myTeam.changePlayerInControl();
          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
          socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
        }
      }
      if (myGameRef.current.myControl === "y") {
        if (kart?.velocity.y != 0) {
          lastKeyRef.current = "";
          myGameRef.current.myTeam.changePlayerInControl();
          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
          socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
        }
      }
    }
  };

  const displayScores = () => {
    const scoresArr = Array.from(roomGameRef.current.scores, function (score) {
      return [score[0], score[1]];
    });

    const teamOne = document.getElementById("team1");
    const teamTwo = document.getElementById("team2");

    if (teamOne && scoresArr[0]) {
      const teamScore = scoresArr[0][1] ?? 0;
      teamOne.innerText = `${scoresArr[0][0]} kart - ${teamScore}`;
    }
    if (teamTwo && scoresArr[1]) {
      const teamScore = scoresArr[1][1] ?? 0;
      teamTwo.innerText = `${scoresArr[1][0]} kart - ${teamScore}`;
    }

    const playerControlDisplay = document.getElementById(
      "playerControlDisplay"
    );
    if (playerControlDisplay) {
      const isInControl = myGameRef.current.myTeam.playerInControl === socketId;
      playerControlDisplay.innerText = isInControl
        ? `YOU ARE IN CONTROL`
        : `your are NOT in control`;
      if (isInControl) {
        canvasBorderRef.current = {
          borderStyle: "solid",
          borderColor: "red",
          borderWidth: 10,
        };
      } else {
        canvasBorderRef.current = { borderStyle: "none" };
      }
    }
  };

  //CANVAS ANIMATION FUNCTIONS:
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
      //maybe only call removePellets if you're not a ghost?
      const kart = roomGameRef.current.karts.get(
        myGameRef.current.myTeam.color
      );
      if (kart) {
        if (kart.isGhost === false) {
          removePellets(pelletsRef.current, updatedKart);
        }
      }

      //consolidate this emit with game_update
      const tempColor = myGameRef.current.myTeam.color;
      const jsonKart = JSON.stringify(updatedKart);
      const tempScore = roomGameRef.current.scores.get(tempColor);

      socket.emit("game_update", { jsonKart, tempColor, tempScore, gameId });
      displayScores();
    }

    updatePlayerControl();

    const kartsArr = Array.from(roomGameRef.current.karts, function (kart) {
      return { color: kart[0], kart: kart[1] };
    });

    frameRenderer.call(
      context,
      size,
      kartsArr,
      boundariesRef.current,
      pelletsRef.current,
      spawnPointsRef.current,
      mapBrickSvgRef.current,
      pelletSvgRef.current
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
      for (let i = 0; i < numTicks; i++) {
        TimeMath._lastTick += TimeMath._timestep;
        Time.t = TimeMath._lastTick - TimeMath._startTime;
        Time.dt = TimeMath._timestep;
        renderFrame();
      }

      Time.frame = TimeMath._currentFrame;
      Time.frameTime = t;
      TimeMath._currentFrame++;
    } catch (e) {
      throw e;
    }
    
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const mapBrickImg = new Image();
    mapBrickImg.src = `data:image/svg+xml;base64,${window.btoa(mapBrickSvgString)}`;
    mapBrickImg.addEventListener("load", () => {
      mapBrickSvgRef.current = mapBrickImg;
    });

    const pelletImg = new Image();
    pelletImg.src = `data:image/svg+xml;base64,${window.btoa(pelletSvgString)}`;
    pelletImg.addEventListener("load", () => {
      pelletSvgRef.current = pelletImg;
    });

    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //SOCKET HANDLERS:
  useEffect(() => {
    socket.on("receive_initial_game_data", (gameData) => {
      const initialGameData = JSON.parse(gameData);
      //console.log(initialGameData);
      boundariesRef.current = initialGameData.boundaries;
      pelletsRef.current = initialGameData.pellets;
      spawnPointsRef.current = initialGameData.spawnPoints;
    });

    socket.on("receive_client_joined", (data) => {
      const { socketIds, userId } = data;

      myGameRef.current.userList = socketIds;
      const numberOfUsers = socketIds.length;
      if (socketId === socketIds[numberOfUsers - 1]) {
        //set the map properties
        if (numberOfUsers % 2 === 0) {
          const teamNumber = numberOfUsers / 2;
          const spawnPosition = spawnPointsRef.current[teamNumber - 1];
          const tempMyKart = new Kart({
            position: spawnPosition.position,
            velocity: { x: 0, y: 0 },
            imgSrc: kartTest.kartTest,
            radius: 15,
            angle: 0,
            isGhost: numberOfUsers > 3 ? true : false,
          });

          const tempMyTeam = new Team({
            teamId: numberOfUsers.toString(),
            color: colors[numberOfUsers],
            players: {
              x: socketIds[numberOfUsers - 2],
              y: socketIds[numberOfUsers - 1],
            },
            score: 0,
          });

          myGameRef.current.myTeamMate = socketIds[numberOfUsers - 2];
          myGameRef.current.myControl = "y";
          myGameRef.current.myTeam = tempMyTeam;
          myGameRef.current.myKart = tempMyKart;

          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
          const jsonKart = JSON.stringify(tempMyKart);
          socket.emit("send_team", {
            jsonTeam,
            jsonKart,
            gameId,
            tempTeamMate,
          });
          postData(`/team`, {
            color: colors[numberOfUsers],
            score: 0,
            position: spawnPosition.position,
            velocity: { x: 0, y: 0 },
            angle: 0,
            characterId: 1,
            gameId: parseInt(gameId),
            kartId: 1,
          })
            //I think this actually needs to go elsewhere, because It's not being called for every User
            .then((team) => {
              teamId.current = team.id;
              //console.log(teamId.current);
              postData(`/teamUser`, {
                teamId: parseInt(team.id),
                userId: parseInt(userId),
                //dummy data
                axisControl: "vertical",
              });
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
      roomGameRef.current.scores.set(tempTeam.color, 0);
    });

    //pellet, scores, and power-up updates can live here eventually:
    socket.on("receive_game_update", (data) => {
      const { tempColor, jsonKart, tempScore } = data;
      const tempKart = new Kart(JSON.parse(jsonKart));
      roomGameRef.current.karts.set(tempColor, tempKart);
      roomGameRef.current.scores.set(tempColor, tempScore);
      displayScores();
    });

    socket.on("receive_kill", (data) => {
      const { victim, spawnNum } = data;
      console.log(data)
      //JSON.parse(ghost) and victim
      //if (my team is the victims color AND I'm the player in control)
      if (myGameRef.current.myTeam.playerInControl === socket.id && myGameRef.current.myTeam.color === victim) {
        kill(spawnNum);
      }
      
    })

    socket.on("pellet_gone", (data) => {
      const { i, isGameOver } = data;
      pelletsRef.current[i].isVisible = false;
      if (isGameOver) {
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

  setInterval(async () => {
    if (teamId.current) {
      const currentScore = roomGameRef.current.scores.get(
        myGameRef.current.myTeam.color
      );
      const currentKart = roomGameRef.current.karts.get(
        myGameRef.current.myTeam.color
      );
      const currentIsGameOver = roomGameRef.current.isGameOver;
      const currentPellets = pelletsRef.current;
      const currentTeamId = teamId.current;

      // console.log("color:" + myGameRef.current.myTeam.color)
      // console.log("currentScore" + currentScore);
      // console.log("currentKart" + currentKart);
      // console.log("teamId" + currentTeamId);
      // console.log("currentIsGameOver" + currentIsGameOver);

      socket.emit("db_update", {
        gameId,
        currentTeamId,
        currentScore,
        currentKart,
        currentPellets,
        currentIsGameOver,
      });
    }
  }, 10000);

  //KEYBOARD EVEN LISTENERS when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        lastKeyRef.current = e.key;
      } else if (e.key === "q") {
        console.log("roomGameRef:", roomGameRef.current);
        console.log("myGameRef:", myGameRef.current);
        console.log("socketId:", socketId);
      } else if (e.key === "p") {
        lastKeyRef.current = "";
        myGameRef.current.myTeam.changePlayerInControl();
        const tempTeamMate = myGameRef.current.myTeamMate;
        const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
        socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
      } else if (e.key === "m") {
        const quads = generateMapQuadrants();
        const newMap = new GameMap(quads);

        newMap.generateMapArr();
        newMap.generateMapPropertiesArrs();
        console.log(newMap);
        boundariesRef.current = newMap.boundaries;
        pelletsRef.current = newMap.pellets;
        spawnPointsRef.current = newMap.spawnPoints;
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
        <div>your kart: {myGameRef.current.myTeam.color}</div>
        <div>
          scores: <span id="team1"></span> || <span id="team2"></span>
        </div>
        <div>
          <span id="playerControlDisplay"></span>
        </div>
        <canvas {...size} ref={canvasRef} style={canvasBorderRef.current} />
        <div>
          <GameOver
            isGameOverModalOpen={isGameOverModalOpen}
            setIsGameOverModalOpen={setIsGameOverModalOpen}
            toggleGameOver={toggleGameOver}
            scores={roomGameRef.current.scores}
          ></GameOver>
        </div>
      </div>
    </>
  );
}

export default Canvas;
