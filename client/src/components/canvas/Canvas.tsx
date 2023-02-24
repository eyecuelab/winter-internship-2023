import React, { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Kart, Team, Pellet, SpawnPoint, GameMap } from "./gameClasses";
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

function Canvas(props: any) {
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const { gameId, blobUrl} = props;
  const colors = ["yellow", "white", "teal", "blue", "orange"];
  console.log(blobUrl);

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
  const svgRef = useRef<SVGElement | null>(null);

  useEffect(() => {
  const svgElement = document.getElementById('pinkKart') as SVGGraphicsElement | null;
  if (svgElement) {
  let clonedSvgElement = svgElement.cloneNode(true) as SVGElement;
  svgRef.current = clonedSvgElement;
  console.log(svgRef.current);
  }
}, []);

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



  const kill = (victimsColor: string) => {
    
    const kart:Kart|undefined = roomGameRef.current.karts.get(victimsColor);
    if (kart) {
      kart.isGhost = true;
      roomGameRef.current.karts.set(victimsColor, kart)
    }

    //move their location to a spawn point
    //change their velocity possibly

  }
  //UPDATE GAME STATE FUNCTIONS:
  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = () => {
    const myColor = myGameRef.current.myTeam.color;
    const kart:Kart = roomGameRef.current.karts.get(myColor) ?? new Kart();//not sure about this..
    const previousXVelocity = kart.velocity.x;

    if (lastKeyRef.current === "w" && ((kart.position.x - 20) % 40) === 0) {
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
          kart.velocity.x = 0
          kart.angle = Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    } else if (lastKeyRef.current === "s" && ((kart.position.x - 20) % 40) === 0) {
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
          kart.angle = Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    }
    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;


    //

    if (kart.isGhost === true){
      const kartsArr = Array.from(roomGameRef.current.karts, function (entry) {
          return { color: entry[0], pacmanKart: entry[1] }
      }); //[{color: "teal", pacmanKart: {}}, {color: "orange", pacmanKart: {}}]

      const aliveKartsArr:any[] = []
      
      kartsArr.forEach((mapargument) => {
        if (mapargument.pacmanKart.isGhost === false) {
          aliveKartsArr.push(mapargument)
        }
      })

      aliveKartsArr.forEach((item) => {
        if(item){
          //console.log("is this even working?")
            if (circleCollidesWithCircle({ghost: kart, paCart: item.pacmanKart})){
              kill(item.color)
              //myGameRef.current.myTeam.ghost = false
              //socket.emit("consume", myGameRef.current.myTeam.color , paCart) //sends the 2 colors so that the other clients do the above 2 lines
              // make the server and receiver for this emit
            }
        }
      })
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
    const kart:Kart = roomGameRef.current.karts.get(myColor) ?? new Kart();//not sure about this..

    const previousYVelocity = kart.velocity.y;

    if (lastKeyRef.current === "a" && ((kart.position.y - 20) % 40) === 0) {
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
          kart.angle = Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    } else if (lastKeyRef.current === "d" && ((kart.position.y - 20) % 40) === 0) {
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
          kart.angle = Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    }
    
    kart.position.x += kart.velocity.x;
    kart.position.y += kart.velocity.y;
    if (kart.isGhost === true){
      const aliveKartsArr = Array.from(roomGameRef.current.karts, function (entry) {
        if (entry[1].isGhost === false) {
        // return [ entry[0], entry[1] ];
        return { color: entry[0], pacmanKart: entry[1] } //[{color: "teal", kart: kart}, {"orange", kart}]
        }
      });
      //console.log(aliveKartsArr);

      aliveKartsArr.forEach((item) => {
        if(item){
            if (circleCollidesWithCircle({ghost:kart, paCart: item.pacmanKart})){
              kill(item.color)
              console.log("pacman killed! on the x axis controlled person");
              //myGameRef.current.myTeam.ghost = false
              //socket.emit("consume", myGameRef.current.myTeam.color , paCart) //sends the 2 colors so that the other clients do the above 2 lines
              // make the server and receiver for this emit
            }
        }
      })
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

    const playerControlDisplay = document.getElementById("playerControlDisplay");
    if(playerControlDisplay){
      const isInControl = myGameRef.current.myTeam.playerInControl === socketId;
      playerControlDisplay.innerText = isInControl ? `YOU ARE IN CONTROL` : `your are NOT in control`
      if (isInControl){
        canvasBorderRef.current = {borderStyle: "solid", borderColor: "red", borderWidth: 10}
      } else {
        canvasBorderRef.current = {borderStyle: "none"}
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
      const kart = roomGameRef.current.karts.get(myGameRef.current.myTeam.color);
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
      svgRef.current
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
      }

      Time.frame = TimeMath._currentFrame;
      Time.frameTime = t;
      TimeMath._currentFrame++;
    } catch (e) {
      throw e;
    }
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //SOCKET HANDLERS:
  useEffect(() => {
    socket.on("receive_initial_game_data", (gameData)=>{
      const initialGameData = JSON.parse(gameData);
      //console.log(initialGameData);
      boundariesRef.current = initialGameData.boundaries;
      pelletsRef.current = initialGameData.pellets;
      spawnPointsRef.current = initialGameData.spawnPoints;
    })

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
              console.log(teamId.current);
              postData(`/teamUser`, {
                teamId: parseInt(team.id),
                userId: parseInt(userId),
                //dummy data
                axisControl: "vertical",
              });
            })
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
      const currentScore = roomGameRef.current.scores.get(myGameRef.current.myTeam.color)
      const currentKart =  roomGameRef.current.karts.get(
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
        gameId, currentTeamId, currentScore, currentKart, currentPellets, currentIsGameOver
      })
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
      };
    }

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
          <canvas {...size} ref={canvasRef}  style={canvasBorderRef.current}/>
        <div>
        <svg style={{backgroundColor: "transparent", width: "50px", height: "50px"}} xmlns="http://www.w3.org/2000/svg" width="147" height="151" viewBox="0 0 147 151" fill="none" id="pinkKart">
      <rect x="26" y="20" width="93" height="3" fill="#303030"/>
      <rect x="23" y="130" width="110" height="3" fill="#303030"/>
      <rect x="138" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 138 151)" fill="#303030"/>
      <rect x="16" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 16 151)" fill="#303030"/>
      <rect x="26" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 26 41)" fill="#303030"/>
      <rect x="129" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 129 41)" fill="#303030"/>
      <rect x="132" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 132 151)" fill="#303030"/>
      <rect x="10" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 10 151)" fill="#303030"/>
      <rect x="20" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 20 41)" fill="#303030"/>
      <rect x="123" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 123 41)" fill="#303030"/>
      <rect x="126" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 126 151)" fill="#303030"/>
      <rect x="4" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 4 151)" fill="#303030"/>
      <rect x="14" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 14 41)" fill="#303030"/>
      <rect x="117" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 117 41)" fill="#303030"/>
      <rect width="38.8284" height="3" transform="matrix(-0.707107 0.707107 0.707107 0.707107 116.456 22)" fill="#303030"/>
      <rect x="30.1213" y="22" width="38.8284" height="3" transform="rotate(45 30.1213 22)" fill="#303030"/>
      <path d="M122 118C122 115.239 124.239 113 127 113H142C144.761 113 147 115.239 147 118V144C147 146.761 144.761 149 142 149H127C124.239 149 122 146.761 122 144V118Z" fill="#303030"/>
      <path d="M0 118C0 115.239 2.23858 113 5 113H20C22.7614 113 25 115.239 25 118V144C25 146.761 22.7614 149 20 149H5C2.23858 149 0 146.761 0 144V118Z" fill="#303030"/>
      <path d="M12 12C12 9.23858 14.2386 7 17 7H28C30.7614 7 33 9.23858 33 12V34C33 36.7614 30.7614 39 28 39H17C14.2386 39 12 36.7614 12 34V12Z" fill="#303030"/>
      <path d="M115 12C115 9.23858 117.239 7 120 7H131C133.761 7 136 9.23858 136 12V34C136 36.7614 133.761 39 131 39H120C117.239 39 115 36.7614 115 34V12Z" fill="#303030"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M69.5044 0H59.8186C56.1556 0 44.556 12.7372 39.2142 19.1059V23.4254L54.0071 38.2117V49.7111C54.0071 50.7878 50.82 52.7533 46.6884 55.3013C41.6394 58.4151 35.1799 62.3987 31.4027 66.6931C29.9351 67.9668 27 71.0459 27 73.1725C27 74.5016 27.5 92.3378 28 110.174C28.5 128.01 29 145.847 29 147.176C29 149.302 31.9351 149.945 33.4027 150H69.5044H77.2531H113.355C114.822 149.945 117.758 149.302 117.758 147.176C117.758 145.847 118.258 128.01 118.758 110.174C119.258 92.3378 119.758 74.5016 119.758 73.1725C119.758 71.0459 116.822 67.9668 115.355 66.6931C111.578 62.3987 105.118 58.4151 100.069 55.3013C95.9375 52.7533 92.7504 50.7878 92.7504 49.7111V38.2117L107.543 23.4254V19.1059C102.201 12.7372 90.6019 0 86.9389 0H77.2531H69.5044Z" fill="#F06ACA"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M65.2401 57C59.3131 59.4703 46.7783 64.6723 44.0544 65.7186C41.3306 66.7648 41.6584 71.3856 42.1629 73.5653C45.8899 85.4016 48.5832 106.223 50.1366 118.232C50.7381 122.882 51.1687 126.211 51.4222 127.184C52.5571 131.544 67.1316 133.723 70.9148 133.723L72.2579 133.723L73.563 133.723L74.9061 133.723C78.6892 133.723 93.2637 131.544 94.3987 127.185C94.6521 126.211 95.0827 122.882 95.6843 118.232C97.2376 106.223 99.931 85.4016 103.658 73.5653C104.162 71.3856 104.49 66.7648 101.766 65.7186C99.0425 64.6723 86.5077 59.4703 80.5808 57L73.563 57L65.2401 57Z" fill="#BA4499"/>
      <rect width="6.53599" height="25.4904" rx="3.268" transform="matrix(-0.674767 -0.738031 -0.738031 0.674767 64.2229 6.82379)" fill="#F27CD1"/>
      <circle cx="72.5" cy="99.5" r="21.5" fill="#FFC327"/>
      <rect x="57" y="66" width="32" height="6" rx="3" fill="#303030"/>
      <path d="M90 95C93 93.9048 99 90.1371 99 83.8286C99 77.52 94.0588 73.3143 91.5882 72" stroke="#FFC227" stroke-width="6"/>
      <path d="M55 95C52 93.9048 46 90.1371 46 83.8286C46 77.52 50.9412 73.3143 53.4118 72" stroke="#FFC227" stroke-width="6"/>
      <path d="M72.7957 113.414C70.2325 113.834 64.2211 113.372 60.6813 108.163C57.1415 102.954 57.9912 97.3008 58.8586 95.125" stroke="#FFE39C" stroke-width="6" stroke-linecap="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M63.4175 66.2H59.8C58.2536 66.2 57 67.4536 57 69C57 70.5464 58.2536 71.8 59.8 71.8H63.4175C62.3374 74.2723 59.8704 76 57 76C53.134 76 50 72.866 50 69C50 65.134 53.134 62 57 62C59.8704 62 62.3374 63.7277 63.4175 66.2Z" fill="#CDAD5C"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M82 66.2H85.6175C87.1639 66.2 88.4175 67.4536 88.4175 69C88.4175 70.5464 87.1639 71.8 85.6175 71.8H82C83.0802 74.2723 85.5471 76 88.4175 76C92.2835 76 95.4175 72.866 95.4175 69C95.4175 65.134 92.2835 62 88.4175 62C85.5471 62 83.0802 63.7277 82 66.2Z" fill="#CDAD5C"/>
    </svg>
    </div>
{/* 
        <div id="container2" className="container">
          <svg style={{backgroundColor: "transparent", width: "50px", height: "50px"}} xmlns="http://www.w3.org/2000/svg" width="147" height="151" viewBox="0 0 147 151" fill="none" id="svg">
          <rect x="26" y="20" width="93" height="3" fill="#303030"/>
          <rect x="23" y="130" width="110" height="3" fill="#303030"/>
          <rect x="138" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 138 151)" fill="#303030"/>
          <rect x="16" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 16 151)" fill="#303030"/>
          <rect x="26" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 26 41)" fill="#303030"/>
          <rect x="129" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 129 41)" fill="#303030"/>
          <rect x="132" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 132 151)" fill="#303030"/>
          <rect x="10" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 10 151)" fill="#303030"/>
          <rect x="20" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 20 41)" fill="#303030"/>
          <rect x="123" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 123 41)" fill="#303030"/>
          <rect x="126" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 126 151)" fill="#303030"/>
          <rect x="4" y="151" width="40" height="5" rx="2.5" transform="rotate(-90 4 151)" fill="#303030"/>
          <rect x="14" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 14 41)" fill="#303030"/>
          <rect x="117" y="41" width="36" height="5" rx="2.5" transform="rotate(-90 117 41)" fill="#303030"/>
          <rect width="38.8284" height="3" transform="matrix(-0.707107 0.707107 0.707107 0.707107 116.456 22)" fill="#303030"/>
          <rect x="30.1213" y="22" width="38.8284" height="3" transform="rotate(45 30.1213 22)" fill="#303030"/>
          <path d="M122 118C122 115.239 124.239 113 127 113H142C144.761 113 147 115.239 147 118V144C147 146.761 144.761 149 142 149H127C124.239 149 122 146.761 122 144V118Z" fill="#303030"/>
          <path d="M0 118C0 115.239 2.23858 113 5 113H20C22.7614 113 25 115.239 25 118V144C25 146.761 22.7614 149 20 149H5C2.23858 149 0 146.761 0 144V118Z" fill="#303030"/>
          <path d="M12 12C12 9.23858 14.2386 7 17 7H28C30.7614 7 33 9.23858 33 12V34C33 36.7614 30.7614 39 28 39H17C14.2386 39 12 36.7614 12 34V12Z" fill="#303030"/>
          <path d="M115 12C115 9.23858 117.239 7 120 7H131C133.761 7 136 9.23858 136 12V34C136 36.7614 133.761 39 131 39H120C117.239 39 115 36.7614 115 34V12Z" fill="#303030"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M69.5044 0H59.8186C56.1556 0 44.556 12.7372 39.2142 19.1059V23.4254L54.0071 38.2117V49.7111C54.0071 50.7878 50.82 52.7533 46.6884 55.3013C41.6394 58.4151 35.1799 62.3987 31.4027 66.6931C29.9351 67.9668 27 71.0459 27 73.1725C27 74.5016 27.5 92.3378 28 110.174C28.5 128.01 29 145.847 29 147.176C29 149.302 31.9351 149.945 33.4027 150H69.5044H77.2531H113.355C114.822 149.945 117.758 149.302 117.758 147.176C117.758 145.847 118.258 128.01 118.758 110.174C119.258 92.3378 119.758 74.5016 119.758 73.1725C119.758 71.0459 116.822 67.9668 115.355 66.6931C111.578 62.3987 105.118 58.4151 100.069 55.3013C95.9375 52.7533 92.7504 50.7878 92.7504 49.7111V38.2117L107.543 23.4254V19.1059C102.201 12.7372 90.6019 0 86.9389 0H77.2531H69.5044Z" fill="#F06ACA"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M65.2401 57C59.3131 59.4703 46.7783 64.6723 44.0544 65.7186C41.3306 66.7648 41.6584 71.3856 42.1629 73.5653C45.8899 85.4016 48.5832 106.223 50.1366 118.232C50.7381 122.882 51.1687 126.211 51.4222 127.184C52.5571 131.544 67.1316 133.723 70.9148 133.723L72.2579 133.723L73.563 133.723L74.9061 133.723C78.6892 133.723 93.2637 131.544 94.3987 127.185C94.6521 126.211 95.0827 122.882 95.6843 118.232C97.2376 106.223 99.931 85.4016 103.658 73.5653C104.162 71.3856 104.49 66.7648 101.766 65.7186C99.0425 64.6723 86.5077 59.4703 80.5808 57L73.563 57L65.2401 57Z" fill="#BA4499"/>
          <rect width="6.53599" height="25.4904" rx="3.268" transform="matrix(-0.674767 -0.738031 -0.738031 0.674767 64.2229 6.82379)" fill="#F27CD1"/>
          <circle cx="72.5" cy="99.5" r="21.5" fill="#FFC327"/>
          <rect x="57" y="66" width="32" height="6" rx="3" fill="#303030"/>
          <path d="M90 95C93 93.9048 99 90.1371 99 83.8286C99 77.52 94.0588 73.3143 91.5882 72" stroke="#FFC227" stroke-width="6"/>
          <path d="M55 95C52 93.9048 46 90.1371 46 83.8286C46 77.52 50.9412 73.3143 53.4118 72" stroke="#FFC227" stroke-width="6"/>
          <path d="M72.7957 113.414C70.2325 113.834 64.2211 113.372 60.6813 108.163C57.1415 102.954 57.9912 97.3008 58.8586 95.125" stroke="#FFE39C" stroke-width="6" stroke-linecap="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M63.4175 66.2H59.8C58.2536 66.2 57 67.4536 57 69C57 70.5464 58.2536 71.8 59.8 71.8H63.4175C62.3374 74.2723 59.8704 76 57 76C53.134 76 50 72.866 50 69C50 65.134 53.134 62 57 62C59.8704 62 62.3374 63.7277 63.4175 66.2Z" fill="#CDAD5C"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M82 66.2H85.6175C87.1639 66.2 88.4175 67.4536 88.4175 69C88.4175 70.5464 87.1639 71.8 85.6175 71.8H82C83.0802 74.2723 85.5471 76 88.4175 76C92.2835 76 95.4175 72.866 95.4175 69C95.4175 65.134 92.2835 62 88.4175 62C85.5471 62 83.0802 63.7277 82 66.2Z" fill="#CDAD5C"/>
        </svg>
        </div> */}
          
          <GameOver
            isGameOverModalOpen={isGameOverModalOpen}
            setIsGameOverModalOpen={setIsGameOverModalOpen}
            toggleGameOver={toggleGameOver}
            scores={roomGameRef.current.scores}
          ></GameOver>
        </div>
    </>
  );
}

export default Canvas;
