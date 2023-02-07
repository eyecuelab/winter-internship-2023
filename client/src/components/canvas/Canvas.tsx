import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Kart, Team } from "./gameClasses";
import { socketId, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";
import { myGameType, roomGameType } from "../../types/Types";

// import SocketHandling from "../socketHandling/socketHandling";
// import * as io from 'socket.io-client';
// const socket = io.connect("http://localhost:3001");
interface Props {
  gameId: string;
}
function Canvas(props: any) {
  const { gameId } = props;
  const lastKeyRef = useRef("");

  const mapRef = useRef<any[][]>([
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
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
      players: { x: "", y: "" },
      playerInControl: "x",
      changePlayerInControl: () => null,
    },
    myKart: {
      position: { x: 60, y: 60 },
      velocity: { x: 0, y: 0 },
      radius: 15,
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

  const updateKarts = () => {
    //fill the karts ref array with everyone's kart updates
  };

  //updates kart movement based on collision detection and player axis control:
  const updateKartYMovements = (kart: Kart) => {
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
      const tempTeam = myGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      myGameRef.current.myTeam = tempTeam;
      socket.emit("toggle_player_control", myGameRef.current.myTeamMate);
      lastKeyRef.current = "";
    }
  };

  const updateKartXMovements = (kart: Kart) => {
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
      const tempTeam = myGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      myGameRef.current.myTeam = tempTeam;
      socket.emit("toggle_player_control", myGameRef.current.myTeamMate);
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

    if (myGameRef.current.myTeam.playerInControl === socketId) {
      if (myGameRef.current.myControl === "x") {
        updateBoundaries();
        updateKartXMovements(myGameRef.current.myTeam.kart);
      } else if (myGameRef.current.myControl === "y") {
        updateBoundaries();
        updateKartYMovements(myGameRef.current.myTeam.kart);
      }
      const tempKart = myGameRef.current.myKart; //is this sending updates 1 frame delayed?
      const tempTeamId = myGameRef.current.myTeam.teamId;
      socket.emit("kart_update", { tempKart, tempTeamId, gameId }); //this will need a team Id..
    }

    frameRenderer.call(context, size, myGameRef.current.myKart, mapRef.current); //myKart will be replaced with an array or object filled with all the teams Karts called kartsRef
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
    //map switch case will live here eventually.
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //socket handlers:
  useEffect(() => {
    socket.on("receive_client_joined", (data) => {
      myGameRef.current.userList = data;
      const numberOfUsers = data.length;
      console.log(numberOfUsers);
      if (socketId === data[numberOfUsers - 1]) {
        if (numberOfUsers % 2 === 0) {
          const tempKart = new Kart({
            position: { x: 60, y: 60 },
            velocity: { x: 0, y: 0 },
          });
          const tempMyTeam = new Team({
            teamId: numberOfUsers.toString(),
            players: {
              x: data[numberOfUsers - 2],
              y: data[numberOfUsers - 1],
            },
            kart: tempKart,
          });
          myGameRef.current.myTeamMate = data[numberOfUsers - 2];
          myGameRef.current.myControl = "y";
          myGameRef.current.myTeam = tempMyTeam;
          socket.emit("send_team", { tempMyTeam, gameId });
          //send Teams update to all clients in room pushing a list of teams and karts into state (like userList)
        }
      }
    });

    socket.on("receive_my_team", (data) => {
      const tempMyTeam = new Team(data);
      myGameRef.current.myTeam = tempMyTeam;
      myGameRef.current.myTeamMate = data.players.y;
      myGameRef.current.myControl = "x";
    });

    socket.on("receive_team_added", (data) => {
      roomGameRef.current.karts.set(data.teamId, data.kart);
    });

    socket.on("receive_kart_update", (data) => {
      //this will be a kart and a teamId
      roomGameRef.current.karts.set(data.teamId, data.kart);
    });

    socket.on("receive_toggle_player_control", () => {
      console.log("receive toggle");
      const tempTeam = myGameRef.current.myTeam;
      tempTeam.changePlayerInControl();
      myGameRef.current.myTeam = tempTeam;
    });
  }, [socket]);

  //add keyboard event listeners when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
        lastKeyRef.current = e.key;
      } else if (e.key === "q") {
        //temp development keypress for state console.logs
      } else if (e.key === "p") {
        //temp development toggle playerControl:
        const tempTeam = myGameRef.current.myTeam;
        tempTeam.changePlayerInControl();
        myGameRef.current.myTeam = tempTeam;

        socket.emit("toggle_player_control", myGameRef.current.myTeamMate);
        console.log("toggle player control:", myGameRef.current.myTeam);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
