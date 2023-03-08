import React, { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import {
  Boundary,
  Kart,
  Team,
  Pellet,
  SpawnPoint,
  GameMap,
  Poof,
} from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { gameMap } from "./Maps";
import { GameOver } from "./gameOver";
import { WaitingForStart } from "./waitingForStart";
import "./CanvasStyles.css";
import {
  myGameType,
  roomGameType,
  kartType,
  userType,
  lastKeyType
} from "../../types/Types";
import { kartCollidesWithBoundary } from "./kartCollidesWithBoundary";
import { generateMapQuadrants } from "./quadrants";
import { ghostCollidesWithKart } from "./ghostCollidesWithKart";
import { postData } from "../../apiHelper";
import { mapBrickSvgString } from "../../assets/mapBrickSvg";
import { pelletSvgString } from "../../assets/pelletSvg";
import { redKartSvgString } from "../../assets/redKartSvg";
import { blueKartSvgString } from "../../assets/blueKartSvg";
import { orangeKartSvgString } from "../../assets/orangeKartSvg";
import { pinkKartSvgString } from "../../assets/pinkKartSvg";
import { redGhostSvgString } from "../../assets/redGhostSvg";
import { orangeGhostSvgString } from "../../assets/orangeGhostSvg";
import { pinkGhostSvgString } from "../../assets/pinkGhostSvg";
import { blueGhostSvgString } from "../../assets/blueGhostSvg";
import { poofSvgString } from "../../assets/poofSvg";
import explosionSoundEffect from "../../assets/explosion.wav";
import pelletSoundEffect from "../../assets/pellet.wav";
import turningSoundEffect from "../../assets/turning-corner.wav";

interface Props {
  gameId: string | undefined;
  userData: userType | undefined;
  roomGameRef: React.RefObject<roomGameType>;
  myGameRef: React.RefObject<myGameType>;
  lastKeyRef:  React.RefObject<lastKeyType>;
  setRoomGameStateWrapper: (state: roomGameType) => void;
  setMyGameStateWrapper: (state: myGameType) => void;
  updateWrapperState: () => void;
}

function Canvas(props: Props) {
  const { gameId, userData, roomGameRef, myGameRef, setRoomGameStateWrapper, setMyGameStateWrapper, lastKeyRef } = props;
  console.log(roomGameRef);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isWaitingForGameModalOpen, setWaitingForGameModalOpen] =
    useState(true);

  const explosionSound = new Audio(explosionSoundEffect);
  const turningSound = new Audio(turningSoundEffect);
  const pelletSound = new Audio(pelletSoundEffect);

  const colors = ["blue", "orange", "pink", "red"];
  const mapBrickSvgRef = useRef<HTMLImageElement | undefined>();
  const pelletSvgRef = useRef<HTMLImageElement | undefined>();
  const poofSvgRef = useRef<HTMLImageElement | undefined>();

  const redKartSvgRef = useRef<HTMLImageElement | undefined>();
  const pinkKartSvgRef = useRef<HTMLImageElement | undefined>();
  const orangeKartSvgRef = useRef<HTMLImageElement | undefined>();
  const blueKartSvgRef = useRef<HTMLImageElement | undefined>();

  const pinkGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const redGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const orangeGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const blueGhostSvgRef = useRef<HTMLImageElement | undefined>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<any | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 2000, height: 2000 };

  const boundariesRef = useRef<Boundary[]>([]);
  const pelletsRef = useRef<Pellet[]>([]);
  const spawnPointsRef = useRef<SpawnPoint[]>([]);
  const poofsRef = useRef<Poof[]>([]);

  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [isTimerReady, setIsTimerReady] = useState<boolean>(true);

  const [myGameState, setMyGameState] = useState<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(), // deprecated
  });

  const [roomGameState, setRoomGameState] = useState<roomGameType>({
    karts: new Map(),
    scores: new Map(),
    isGameOver: false,
  });

  //UPDATE GAME STATE FUNCTIONS:
  //updates kart movement based on collision detection and player axis control:

  const updateKartYMovements = () => {
    const myColor = myGameRef.current?.myTeam.color;
    if (myColor) {
    const kart: Kart = roomGameRef.current?.karts.get(myColor) ?? new Kart(); //not sure about this..
    const velocityUnit = kart.isGhost ? 20 : 10;

    if (isGameOverModalOpen === false) {
      const previousXVelocity = kart.velocity.x;

      if (
        lastKeyRef.current?.lastKey === "w" &&
        (kart.position.x - Boundary.width / 2) % Boundary.width === 0
      ) {
        for (let i = 0; i < boundariesRef.current.length; i++) {
          const boundary = boundariesRef.current[i];
          if (
            kartCollidesWithBoundary({
              circle: {
                ...kart,
                velocity: {
                  x: 0,
                  y: -velocityUnit,
                },
              },
              rectangle: boundary,
            })
          ) {
            kart.velocity.y = 0;
            kart.velocity.x = previousXVelocity;

            break;
          } else {
            kart.velocity.y = -velocityUnit;
            kart.velocity.x = 0;
            kart.angle.goalAngle =
              Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
          }
        }
      } else if (
        lastKeyRef.current?.lastKey === "s" &&
        (kart.position.x - Boundary.width / 2) % Boundary.width === 0
      ) {
        for (let i = 0; i < boundariesRef.current.length; i++) {
          const boundary = boundariesRef.current[i];
          if (
            kartCollidesWithBoundary({
              circle: {
                ...kart,
                velocity: {
                  x: kart.velocity.x,
                  y: velocityUnit,
                },
              },
              rectangle: boundary,
            })
          ) {
            kart.velocity.y = 0;
            kart.velocity.x = previousXVelocity;
            break;
          } else {
            kart.velocity.y = velocityUnit;
            kart.velocity.x = 0;
            kart.angle.goalAngle =
              Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
          }
        }
      }

      kart.position.x += kart.velocity.x;
      kart.position.y += kart.velocity.y;

      kart.updateKartAngle();

      boundariesRef.current.forEach((boundary) => {
        if (
          kartCollidesWithBoundary({
            circle: kart,
            rectangle: boundary,
          })
        ) {
          kart.velocity.y = 0;
          kart.velocity.x = 0;
        }
      });
    }
  
    return kart;
  }
  };

  const updateKartXMovements = () => {
    const myColor = myGameRef.current?.myTeam.color;
    if (myColor) {
      const kart: Kart = roomGameRef.current?.karts.get(myColor) ?? new Kart();
      const velocityUnit = kart.isGhost ? 20 : 10;

      if (isGameOverModalOpen === false) {
        const previousYVelocity = kart.velocity.y;

        if (
          lastKeyRef.current?.lastKey === "a" &&
          (kart.position.y - Boundary.width / 2) % Boundary.width === 0
        ) {
          for (let i = 0; i < boundariesRef.current.length; i++) {
            const boundary = boundariesRef.current[i];
            if (
              kartCollidesWithBoundary({
                circle: {
                  ...kart,
                  velocity: {
                    x: -velocityUnit,
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
              kart.velocity.x = -velocityUnit;
              kart.velocity.y = 0;
              kart.angle.goalAngle =
                Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
              }
            }
          } else if (
            lastKeyRef.current?.lastKey === "d" &&
            (kart.position.y - Boundary.width / 2) % Boundary.width === 0
            ) {
            for (let i = 0; i < boundariesRef.current.length; i++) {
              const boundary = boundariesRef.current[i];
              if (
                kartCollidesWithBoundary({
                  circle: {
                    ...kart,
                    velocity: {
                      x: velocityUnit,
                      y: 0,
                    },
                  },
                  rectangle: boundary,
                })
              ) {
                kart.velocity.x = 0;
                kart.velocity.y = previousYVelocity;
                break;
              }
              else {
                kart.velocity.x = velocityUnit;
                kart.velocity.y = 0;
                kart.angle.goalAngle =
                  Math.atan2(kart.velocity.y, kart.velocity.x) + Math.PI / 2;
        }
      }
    }

        kart.position.x += kart.velocity.x;
        kart.position.y += kart.velocity.y;
        kart.updateKartAngle();

        boundariesRef.current.forEach((boundary) => {
          if (
            kartCollidesWithBoundary({
              circle: kart,
              rectangle: boundary,
            })
          ) {
            kart.velocity.x = 0;
            kart.velocity.y = 0;
          }
        });
      }

        return kart;
      }
};

  const checkForGhostCollisions = () => {
    if (myGameRef.current) {
      const teamColor = myGameRef.current?.myTeam.color;
      if (teamColor) {
        const currentKart: Kart =
          roomGameRef.current?.karts.get(teamColor) ?? new Kart();

        if (currentKart.isGhost === true && roomGameRef.current) {
          const targetKartsArr = Array.from(
            roomGameRef.current.karts,
            function (entry) {
              if (entry[1].isGhost === false) {
                return { color: entry[0], pacKart: entry[1] };
              }
            }
          );

          targetKartsArr.forEach((item) => {
            if (item) {
              if (
                ghostCollidesWithKart({ ghost: currentKart, paCart: item.pacKart })
              ) {
                const spawnNum = Math.floor(Math.random() * 4);

                const kartColor = item.color;
                const ghostColor = myGameRef.current?.myTeam.color;
                socket.emit("ghost_kart_toggle", {
                  kartColor,
                  ghostColor,
                  spawnNum,
                  gameId,
                });
                updateScore(200);
                currentKart.isGhost = false;
              }
            }
          });

        }
      }
    }
  };

  const initiatePoofAnimation = (spawnNumber: number, ghostColor: string) => {
    const tempPoofsRef = [...poofsRef.current];
    const ghostKart = roomGameRef.current?.karts.get(ghostColor);
    const ghostPosition = ghostKart?.position;
    const paCartPosition = spawnPointsRef.current[spawnNumber].position;

    const positionsArr = [ghostPosition, paCartPosition];

    positionsArr.forEach((position) => {
      if (position) {
        const bigPoof = new Poof(position, 100, 0);
        const littlePoof = new Poof(
          { x: position.x + 20, y: position.y + 20 },
          60,
          1.3
        );
        const littlePoof2 = new Poof(
          { x: position.x - 30, y: position.y - 30 },
          40,
          0.8
        );
        tempPoofsRef.push(bigPoof, littlePoof, littlePoof2);
      }
    });

    poofsRef.current = tempPoofsRef;
  };

  const updatePoofs = () => {
    const tempPoofsRef = [...poofsRef.current];
    tempPoofsRef.forEach((poof) => {
      poof.update();
    });

    const filteredPoofs = tempPoofsRef.filter((poof) => poof.opacity > 0);

    poofsRef.current = filteredPoofs;
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
            playPelletSound();

            updateScore(10);
            const isGameOver = hasPellets();

            if (isGameOver) {
              const tempColor = myGameRef.current?.myTeam.color;
              const jsonKart = JSON.stringify(kartRef);
              if (tempColor) {
                const tempScore = roomGameRef.current?.scores.get(tempColor);

                socket.emit("game_update", {
                  jsonKart,
                  tempColor,
                  tempScore,
                  gameId,
                });
              }
              if (roomGameRef.current) {
                roomGameRef.current.isGameOver = true;
              }
              socket.emit("game_over", { gameId });
              toggleGameOver();
            }
            socket.emit("update_pellets", { gameId, i, isGameOver });
          }
        }
    });
  };

  const updateScore = (pointValue: number) => {
    if (myGameRef.current) {
      let updatedScore: number =
      roomGameRef.current?.scores.get(myGameRef.current.myTeam.color) ?? 0;
      updatedScore += pointValue;
      roomGameRef.current?.scores.set(
      myGameRef.current.myTeam.color,
      updatedScore);
    }
  };

  const updatePlayerControl = () => {
    if (myGameRef.current?.myTeam.playerInControl === socketId) {
      const kart = roomGameRef.current?.karts.get(
        myGameRef.current.myTeam.color
      );
      if (myGameRef.current.myControl === "x") {
        if (kart?.velocity.x != 0 ) {
          if (lastKeyRef.current) {
            lastKeyRef.current.lastKey = "";
          }
          myGameRef.current.myTeam.changePlayerInControl();
          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
          socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
        }
      }
      if (myGameRef.current.myControl === "y") {
        if (kart?.velocity.y != 0) {
          if (lastKeyRef.current) {
            lastKeyRef.current.lastKey = "";
          }

          myGameRef.current.myTeam.changePlayerInControl();
          const tempTeamMate = myGameRef.current.myTeamMate;
          const jsonTeam = JSON.stringify(myGameRef.current.myTeam);
          socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current = context;
      }
        const cxt = contextRef.current;
        cxt.scale(1, 1);
      }
  }, []);

  //CANVAS ANIMATION FUNCTIONS:
  const renderFrame = () => {
    props.updateWrapperState();
    if (roomGameRef.current) {
      setRoomGameStateWrapper(roomGameRef.current);
    }
    if (myGameRef.current) {
      setMyGameStateWrapper(myGameRef.current);
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    let updatedKart; //should this be referencing local state?

    if (myGameRef.current?.myTeam.playerInControl === socketId) {
      if (myGameRef.current.myControl === "x") {
        updatedKart = new Kart(updateKartXMovements());
      } else if (myGameRef.current.myControl === "y") {
        updatedKart = new Kart(updateKartYMovements());
      }
      //maybe only call removePellets if you're not a ghost?
      const kart = roomGameRef.current?.karts.get(
        myGameRef.current.myTeam.color
      );
      if (kart) {
        if (kart.isGhost === false) {
          removePellets(pelletsRef.current, updatedKart);
        } else {
          checkForGhostCollisions();
        }
      }

      //consolidate this emit with game_update
      const tempColor = myGameRef.current.myTeam.color;
      const jsonKart = JSON.stringify(updatedKart);
      const tempScore = roomGameRef.current?.scores.get(tempColor);

      socket.emit("game_update", { jsonKart, tempColor, tempScore, gameId });
    }

    // displayScores();
    updatePlayerControl();
    updatePoofs();

    if (myGameRef.current) {
    const myKartForCamera = roomGameRef.current?.karts.get(
      myGameRef.current.myTeam.color
    );

    if (myKartForCamera && roomGameRef.current) {
      const kartsArr = Array.from(roomGameRef.current.karts, function (kart) {
        return { color: kart[0], kart: kart[1] };
      });

        frameRenderer.call(
          contextRef.current,
          size,
          myKartForCamera,
          kartsArr,
          boundariesRef.current,
          pelletsRef.current,
          spawnPointsRef.current,
          poofsRef.current,
          mapBrickSvgRef.current,
          pelletSvgRef.current,
          redKartSvgRef.current,
          orangeKartSvgRef.current,
          blueKartSvgRef.current,
          pinkKartSvgRef.current,
          redGhostSvgRef.current,
          orangeGhostSvgRef.current,
          blueGhostSvgRef.current,
          pinkGhostSvgRef.current,
          poofSvgRef.current
        );
      }
    }
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
    mapBrickImg.src = `data:image/svg+xml;base64,${window.btoa(
      mapBrickSvgString
    )}`;
    mapBrickImg.addEventListener("load", () => {
      mapBrickSvgRef.current = mapBrickImg;
    });

    const pelletImg = new Image();
    pelletImg.src = `data:image/svg+xml;base64,${window.btoa(pelletSvgString)}`;
    pelletImg.addEventListener("load", () => {
      pelletSvgRef.current = pelletImg;
    });

    const poofImg = new Image();
    poofImg.src = `data:image/svg+xml;base64,${window.btoa(poofSvgString)}`;
    poofImg.addEventListener("load", () => {
      poofSvgRef.current = poofImg;
    });

    const redKartImg = new Image();
    redKartImg.src = `data:image/svg+xml;base64,${window.btoa(
      redKartSvgString
    )}`;
    redKartImg.addEventListener("load", () => {
      redKartSvgRef.current = redKartImg;
    });

    const orangeKartImg = new Image();
    orangeKartImg.src = `data:image/svg+xml;base64,${window.btoa(
      orangeKartSvgString
    )}`;
    orangeKartImg.addEventListener("load", () => {
      orangeKartSvgRef.current = orangeKartImg;
    });

    const blueKartImg = new Image();
    blueKartImg.src = `data:image/svg+xml;base64,${window.btoa(
      blueKartSvgString
    )}`;
    blueKartImg.addEventListener("load", () => {
      blueKartSvgRef.current = blueKartImg;
    });

    const pinkKartImg = new Image();
    pinkKartImg.src = `data:image/svg+xml;base64,${window.btoa(
      pinkKartSvgString
    )}`;
    pinkKartImg.addEventListener("load", () => {
      pinkKartSvgRef.current = pinkKartImg;
    });

    const redGhostImg = new Image();
    redGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      redGhostSvgString
    )}`;
    redGhostImg.addEventListener("load", () => {
      redGhostSvgRef.current = redGhostImg;
    });

    const orangeGhostImg = new Image();
    orangeGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      orangeGhostSvgString
    )}`;
    orangeGhostImg.addEventListener("load", () => {
      orangeGhostSvgRef.current = orangeGhostImg;
    });

    const pinkGhostImg = new Image();
    pinkGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      pinkGhostSvgString
    )}`;
    pinkGhostImg.addEventListener("load", () => {
      pinkGhostSvgRef.current = pinkGhostImg;
    });

    const blueGhostImg = new Image();
    blueGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      blueGhostSvgString
    )}`;
    blueGhostImg.addEventListener("load", () => {
      blueGhostSvgRef.current = blueGhostImg;
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

    socket.on("receive_client_joined", async (data) => {
      const { socketIds } = data;
      if (myGameRef.current) {
        myGameRef.current.userList = socketIds;
        const numberOfUsers = socketIds.length;

        if (socketId === socketIds[numberOfUsers - 1]) {
          if (numberOfUsers % 2 === 0) {
            const spawnPosition = spawnPointsRef.current[numberOfUsers / 2 - 1];

            if (gameId) {
              const newTeam = await postData(`/team`, {
                color: colors[numberOfUsers / 2 - 1],
                score: 0,
                position: spawnPosition.position,
                velocity: { x: 0, y: 0 },
                angle: { currentAngle: 0, goalAngle: 0 },
                characterId: numberOfUsers > 3 ? 2 : 1,
                gameId: parseInt(gameId),
                kartId: 1,
              });

              const tempMyKart = new Kart({
                position: newTeam.position,
                velocity: newTeam.velocity,
                radius: 15,
                angle: newTeam.angle,
                isGhost: newTeam.characterId === 1 ? false : true,
              });

              const tempMyTeam = new Team({
                teamId: newTeam.id,
                color: newTeam.color,
                playerInControl: socketIds[numberOfUsers - 2],
                players: {
                  x: socketIds[numberOfUsers - 2],
                  y: socketIds[numberOfUsers - 1],
                },
                score: newTeam.score,
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

              if (userData) {
                postData(`/teamUser`, {
                  teamId: parseInt(newTeam.id),
                  userId: userData.id,
                  axisControl: "y",
                });
              }
            }
          }
        }
        if (isWaitingForGameModalOpen) {
          setMyGameState(myGameRef.current);
          setMyGameStateWrapper(myGameRef.current);
          if (numberOfUsers === 4 && isTimerReady) {
            setInterval(async () => {
              setIsCountingDown(true);
            }, 3000);
            setInterval(async () => {
              setWaitingForGameModalOpen(false);
            }, 10000);
            setIsCountingDown(false);
            setIsTimerReady(false);
          }
        }
      }
    });

    socket.on("receive_team_added", (data) => {
      const { jsonTeam, jsonKart } = data;
      const tempTeam = new Team(JSON.parse(jsonTeam));
      const tempKart = new Kart(JSON.parse(jsonKart));

      if (myGameRef.current) {
        if (tempTeam.players.x === socketId) {
          myGameRef.current.myTeam.updateTeamWithJson(jsonTeam);
          myGameRef.current.myKart.updateKartWithJson(jsonKart);
          myGameRef.current.myControl = "x";
          myGameRef.current.myTeamMate = myGameRef.current?.myTeam.players.y;
          if (userData) {
            postData(`/teamUser`, {
              teamId: parseInt(tempTeam.teamId),
              userId: userData.id,
              axisControl: "x",
            });
          }
        }
      
        roomGameRef.current?.karts.set(tempTeam.color, tempKart);
        roomGameRef.current?.scores.set(tempTeam.color, 0);

        setMyGameState(myGameRef.current);
        if (myGameRef.current) {
          setMyGameStateWrapper(myGameRef.current);
        }
        if (roomGameRef.current) {
          setRoomGameState(roomGameRef.current);
          setRoomGameStateWrapper(roomGameRef.current);
        }
    }
    });

    socket.on("receive_game_update", (data) => {
      const { tempColor, jsonKart, tempScore } = data;
      const tempKart = new Kart(JSON.parse(jsonKart));
      roomGameRef.current?.karts.set(tempColor, tempKart);
      roomGameRef.current?.scores.set(tempColor, tempScore);
      // displayScores();
    });

    socket.on("receive_ghost_kart_toggle", (data) => {
      const { kartColor, ghostColor, spawnNum } = data;
      playExplosionSound();
      console.log('explosion sound!')
      if (
        myGameRef.current?.myTeam.playerInControl === socket.id &&
        myGameRef.current?.myTeam.color === kartColor
      ) {
        toggleToGhost(spawnNum);
      }
      initiatePoofAnimation(spawnNum, ghostColor);
    });

    socket.on("receive_pellet_update", (data) => {
      const { i, isGameOver } = data;
      pelletsRef.current[i].isVisible = false;
      if (isGameOver && roomGameRef.current) {
        roomGameRef.current.isGameOver = true;
        toggleGameOver();
      }
    });

    socket.on("receive_toggle_player_control", (data) => {
      // playTurningSound();
      myGameRef.current?.myTeam.updateTeamWithJson(data);
    });

    socket.on("client_disconnect", (data) => {
      myGameRef.current?.userList.forEach((user) => {
        if (roomGameRef.current && data.disconnectedClientId === user) {
          roomGameRef.current.isGameOver = true;
          socket.emit("game_over", { gameId });
          toggleGameOver();
        }
      });
    });

    socket.on("disconnect_game_over", (data) => {
      console.log("disconnect game over:", data);
      if (data === gameId) {
        toggleGameOver();
      }
    });

    return () => {
      const userId = userData?.id;
      const leaveRoomData = { gameId, userId };
      socket.emit("leave_room", leaveRoomData);
      socket.removeAllListeners();
    };
  }, [socket]);

  setInterval(async () => {
    if (myGameRef.current?.myTeam.players.x === socketId) {
      const currentScore = roomGameRef.current?.scores.get(
        myGameRef.current?.myTeam.color
      );
      const currentKart = roomGameRef.current?.karts.get(
        myGameRef.current.myTeam.color
      );
      const currentIsGameOver = roomGameRef.current?.isGameOver;
      const currentPellets = pelletsRef.current;
      const currentTeamId = myGameRef.current.myTeam.teamId;

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


  //KEYBOARD EVENT LISTENERS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
          console.log(lastKeyRef);
          console.log(lastKeyRef.current);
          if (lastKeyRef.current) {
          lastKeyRef.current.lastKey = e.key;
          }
      } else if (e.key === "q") {
        console.log("roomGameRef:", roomGameRef.current);
        console.log("myGameRef:", myGameRef.current);
        console.log("poofsRef", poofsRef.current);
      } else if (e.key === "p") {
        if (lastKeyRef.current) {
          lastKeyRef.current.lastKey = "";
        }
        myGameRef.current?.myTeam.changePlayerInControl();
        const tempTeamMate = myGameRef.current?.myTeamMate;
        const jsonTeam = JSON.stringify(myGameRef.current?.myTeam);
        socket.emit("toggle_player_control", { tempTeamMate, jsonTeam });
    }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
 
  const toggleToGhost = (spawnNum: number) => {
    if (myGameRef.current) {
      const kart = roomGameRef.current?.karts.get(myGameRef.current.myTeam.color);

      if (kart) {
        kart.isGhost = true;
        kart.position = spawnPointsRef.current[spawnNum].position;
        kart.velocity = { x: 0, y: 0 };
      }
    }
  };

  //GAME OVER FUNCTIONS:
  const toggleGameOver = () => {
    setIsGameOverModalOpen(!isGameOverModalOpen);
    setWaitingForGameModalOpen(false);
  };

  const hasPellets = () => {
    for (let i = 0; i < pelletsRef.current.length; i++) {
      if (pelletsRef.current[i].isVisible === true) {
        return false;
      }
    }
    return true;
  };

  const playPelletSound = () => {
    pelletSound.currentTime = 0;
    pelletSound.volume = .5;
    pelletSound.play();
  };

  const playTurningSound = () => {
    turningSound.currentTime = 0;
    turningSound.volume = .5;
    turningSound.play();
  };

  const playExplosionSound = () => {
    explosionSound.currentTime = 0;
    explosionSound.volume = .5;
    explosionSound.play();
  };

  return (
    <>
      <div
        style={{
          color: "white",
          alignItems: "center",
        }}
      >
        <div>your kart: {myGameRef.current?.myTeam.color}</div>
        <div>
          scores: <span id="team1"></span> || <span id="team2"></span>
        </div>
        <div>
          <span id="playerControlDisplay"></span>
        </div>
        <div className={`app-container`}>
        </div>
        <div id="canvas-container">
          <canvas {...size} ref={canvasRef} />
        </div>
        <div>
          <WaitingForStart
            isWaitingForGameModalOpen={isWaitingForGameModalOpen}
            roomGameState={roomGameState}
            myGameState={myGameState}
            isCountingDown={isCountingDown}
          ></WaitingForStart>
        </div>
        <div>
          <GameOver
            isGameOverModalOpen={isGameOverModalOpen}
            setIsGameOverModalOpen={setIsGameOverModalOpen}
            toggleGameOver={toggleGameOver}
            scores={roomGameRef.current?.scores}
          ></GameOver>
        </div>
      </div>
    </>
  );
}

export default Canvas;
