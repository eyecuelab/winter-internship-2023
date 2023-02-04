import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player, Team } from "./gameClasses";
import { socketID, socket } from "./../../GlobalSocket";
import { Time, TimeMath } from "./FPSEngine";

// import SocketHandling from "../socketHandling/socketHandling";
// import * as io from 'socket.io-client';
// const socket = io.connect("http://localhost:3001");

function Canvas() {
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

  // const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const boundariesRef = useRef<Boundary[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<any>(null);
  const size = { width: 700, height: 700 };

  //socketHandling state:
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [user3, setUser3] = useState("");
  const [user4, setUser4] = useState("");
  const [user1Input, setUser1Input] = useState("");
  const [user2Input, setUser2Input] = useState("");
  const [user3Input, setUser3Input] = useState("");
  const [user4Input, setUser4Input] = useState("");

  const [myTeam, setMyTeam] = useState({players: {x: "", y: ""}});
  const [test, setTest] = useState({});

  setTest

  let roomNumber = "";
  let ifModerator: boolean = false;
  let userList: Array<string> = [];

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
    updateBoundaries();
    updatePlayer();

    if (ifModerator) {
      const tempPlayer = playerRef.current;
      socket.emit("player_update", { tempPlayer, roomNumber });
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
        console.log(`dropping ${numTicks} frames`);
        numTicks = 0;
        TimeMath._lastTick = t;
      }
      
      if (t - TimeMath._lastFpsUpdate > 200) {
        TimeMath._fps = 0.9 * TimeMath._framesSinceFPSUpdate * 1000 / (t - TimeMath._lastFpsUpdate) + 0.1 * TimeMath._fps;
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
        console.log("render a frame")
      }
  
      // Draw
      Time.frame = TimeMath._currentFrame;
      Time.frameTime = t;
      //draw(); //this moves the square in a circle
      
      TimeMath._currentFrame++;
    } catch (e) {
      //cancelAnimationFrame(requestIdRef.current);
      throw(e);
    }
    //renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
    console.log("every time it checks")
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);





  useEffect(() => {
    socket.on("receive_player_update", (data) => {
      playerRef.current = data;
    });

    socket.on("receive_room_number", (data: Array<any>) => {
      console.log(data);
      roomNumber = data[0];
      ifModerator = data[1];
    });

    //socketHandling useEffect:
    socket.on("receive_room_number", (data: Array<any>) => {
      roomNumber = data[0];
      ifModerator = data[1];
      if (ifModerator) {
        userList.push(data[2]);
      }
    });

    socket.on("mod_receive_user", (data) => {
      if (ifModerator) {
        userList.push(data);
      }
    });
    socket.on("room_full", () => {
      if (ifModerator) {
        sendUsers(userList);
      }
    });

    const startGame = (socketUser1: string, socketUser2: string) => {
      const tempTeam = new Team({players: {x: socketUser1, y: socketUser2}});
      setTest(tempTeam);
      console.log(test);
    }

    socket.on("get_user_list", (data: Array<string>) => {
      setUser1(data[0]);
      setUser2(data[1]);
      setUser3(data[2]);
      setUser4(data[3]);
      userList = data;
      startGame(data[0], data[1]);
    });

  }, [socket]);

  const sendUsers = (data: Array<string>) => {
    setUser1(userList[0]);
    setUser2(userList[1]);
    setUser3(userList[2]);
    setUser4(userList[3]);
    socket.emit("mod_sends_user_list", { userList, roomNumber });

    setTest(new Team({players: {x: userList[0], y: userList[1]}}));
  };

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
      }
      console.log("handleKeyDown state:", lastKeyRef.current);
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
      console.log("handleKeyUp state:", lastKeyRef.current);
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
          <li>
            {user1}: {user1Input}
          </li>
          <li>
            {user2}: {user2Input}
          </li>
          <li>
            {user3}: {user3Input}
          </li>
          <li>
            {user4}: {user4Input}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Canvas;
