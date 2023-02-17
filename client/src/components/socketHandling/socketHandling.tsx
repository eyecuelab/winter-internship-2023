import * as io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001")
// const socket = io.connect("https://super-pacart.fly.dev");

function SocketHandling() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [user3, setUser3] = useState("");
  const [user4, setUser4] = useState("");
  const [user1Input, setUser1Input] = useState("");
  const [user2Input, setUser2Input] = useState("");
  const [user3Input, setUser3Input] = useState("");
  const [user4Input, setUser4Input] = useState("");
  let roomNumber = "";
  let ifModerator: boolean = false;
  let userList: Array<string> = [];

  const joinPublic = () => {
    socket.emit("join_public");
  };
  const keypress = (key: string) => {
    socket.emit("key_press", { key, roomNumber });
  };

  const sendUsers = (data: Array<string>) => {
    setUser1(userList[0]);
    setUser2(userList[1]);
    setUser3(userList[2]);
    setUser4(userList[3]);
    socket.emit("mod_sends_user_list", { userList, roomNumber });
  };

  useEffect(() => {
    socket.on("receive_room_number", (data: Array<any>) => {
      roomNumber = data[0];
      ifModerator = data[1];
      if (ifModerator) {
        userList.push(data[2]);
      }
      document.addEventListener("keypress", handleKeyPress);
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
      setUser1(data[0]);
      setUser2(data[1]);
      setUser3(data[2]);
      setUser4(data[3]);
      userList = data;
    });
    function handleKeyPress(e: KeyboardEvent) {
      if (
        e.key === "w" ||
        e.key === "a" ||
        e.key === "s" ||
        e.key === "d" ||
        e.key === " "
      ) {
        keypress(e.key);
      } else {
      }
    }
    // socket.on("receive_key", (data: Array<any>) => {
    //   myGameRef(data[1]);
    //   if (data[1] === userList[0]) {
    //     setUser1Input(data[0].key);
    //   } else if (data[1] === userList[1]) {
    //     setUser2Input(data[0].key);
    //   } else if (data[1] === userList[2]) {
    //     setUser3Input(data[0].key);
    //   } else {
    //     setUser4Input(data[0].key);
    //   }
    // });
  }, [socket]);

  return (
    <div className="SocketHandling">
      <button onClick={joinPublic}>Join a public game!</button>
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
  );
}
export default SocketHandling;
