import { useEffect, useRef, useState } from "react";
import frameRenderer from "./frameRenderer";
import { Boundary, Player, Team } from "./gameClasses";
import { socketID, socket } from "./../../GlobalSocket";

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
  const socketUsersRef = useRef({
    activeUser: "",
    user1: "",
    user2: "",
    user3: "",
    user4: "",
    user1Input: "",
    user2Input: "",
    user3Input: "",
    user4Input: "",
  })
  // const [user1, setUser1] = useState("");
  // const [user2, setUser2] = useState("");
  // const [user3, setUser3] = useState("");
  // const [user4, setUser4] = useState("");
  
  // const [user1Input, setUser1Input] = useState("");
  // const [user2Input, setUser2Input] = useState("");
  // const [user3Input, setUser3Input] = useState("");
  // const [user4Input, setUser4Input] = useState("");

  //useMemo() and create a useEffect just for these 3 vars:
  let roomNumber = "";
  let ifModerator: boolean = false; //isModerator
  let userList: Array<string> = [];

  useEffect(() => {

  }, [])

  //socketHandling logic:
  // const joinPublic = () => {
  //   socket.emit("join_public");
  // };
  const keypress = (key: string) => {
    socket.emit("key_press", { key, roomNumber });
  };

  const sendUsers = (data: Array<string>) => {
    // socketUsersRef.current = ({...socketUsersRef.current, 
    //   user1: userList[0],
    //   user2: userList[1],
    //   user3: userList[2],
    //   user4: userList[3],
    // })
    // // setUser1(userList[0]);
    // // setUser2(userList[1]);
    // // setUser3(userList[2]);
    // // setUser4(userList[3]);
    socket.emit("mod_sends_user_list", { userList, roomNumber });
  };

  const toggleControl = (id: string) => {
    socketUsersRef.current = {...socketUsersRef.current, activeUser: id}
    // setActiveUser(id);
    socket.emit("toggle_control", { id, roomNumber });
  };

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
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  //socketHandling useEffect:
  useEffect(() => {
    socket.on("receive_player_update", (data) => {
      playerRef.current = data;
    });

    socket.on("receive_room_number", (data: Array<any>) => {
      roomNumber = data[0];
      ifModerator = data[1];
    });

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

    socket.on("get_user_list", (data: Array<string>) => {
    socketUsersRef.current = ({...socketUsersRef.current, 
      user1: userList[0],
      user2: userList[1],
      user3: userList[2],
      user4: userList[3],
    })
      userList = data;
      console.log(data);
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
          <li>
            {socketUsersRef.current.user1}: {socketUsersRef.current.user1Input}
          </li>
          <li>
            {socketUsersRef.current.user2}: {socketUsersRef.current.user2Input}
          </li>
          <li>
            {socketUsersRef.current.user3}: {socketUsersRef.current.user3Input}
          </li>
          <li>
            {socketUsersRef.current.user4}: {socketUsersRef.current.user4Input}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Canvas;
