//import Login from "./components/Login";
//import io from 'socket.io-client';
import * as io from 'socket.io-client';
import { useEffect, useState } from "react";
import { KeyboardOptions } from '@nextui-org/react';
const socket = io.connect("http://localhost:3001");
function SocketHandling() {
  const [message, setMessage] = useState("");
  const [lastInput, setLastInput] = useState("");
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
  // every communication that we want to run will be declared here as a const
  // this one is sendMessage, the "send_message" in the emit is what the backend is looking for
  // if we want to send data, the message is where we would send it
  // so with this, "Hello" is the data sent
  // we will build functions that just need to send the data over to the server based on the specific input
  // as long as the input receiver is good and differentiated, then none of that really matters what were sending
  // *unless its data like username or something
  const sendMessage = () => {
    socket.emit("send_message", {message: message}); //since the message and the variable are the same, you can just do {message}, I left it in there tho in case we want an example on how to send other information
  };

  const joinPublic = () => {
    //console.log("user is trying to join a public game");
    socket.emit("join_public")
  }
//building a keypress in the client side, we need a function to send it out (below), a way for the file to recognize keypresses, and a way to display the other's keypresses
  const keypress = (key: string) => {
    //console.log("this is the key being sent out: " + key)
    socket.emit("key_press", { key, roomNumber})
  }

  const sendUsers = (data: Array<string>) => {
    setUser1(userList[0])
    setUser2(userList[1])
    setUser3(userList[2])
    setUser4(userList[3])
    socket.emit("mod_sends_user_list", {userList, roomNumber})
    //socket emit with the argument
  }


  useEffect(() => {
    socket.on("receive_room_number", (data: Array<any>) => {
      //console.log("previous room number: " + roomNumber)
      roomNumber = data[0];
      ifModerator = data[1];
      if (ifModerator) {
        //console.log(data[2])
        //console.log(typeof(data[2]))
        userList.push(data[2])
        //console.log(userList)
      }
      //console.log(roomNumber);
      document.addEventListener('keypress', handleKeyPress);
      // so the server puts the client in a room, sends the room number to the client
      // we need the client to be able to store that information
    })

    socket.on("mod_receive_user", (data) => {
      if (ifModerator) {
        //console.log("mod is receiving a new user")
        userList.push(data)
        //console.log(userList)
      }
      //if mod? add to the list of users
      // if not mod, don't do anything
    })
    socket.on("room_full", () => {
      if (ifModerator) {
        sendUsers(userList)
      }
    })

    socket.on("get_user_list", (data: Array<string>) => {
      setUser1(data[0])
      setUser2(data[1])
      setUser3(data[2])
      setUser4(data[3])
      userList = data;
      //



      // data.forEach(function(socketIds: string) {
      //   //console.log(socketIds)
      // })
      //console.log(data)
      //so they'll receive the list of users and be able to make the html below
    })

    // socket.on("receive_message", (data) => {
    //   setMessageReceived(data.message)

    //   //this below would do a window alert with literally just "Hello" from the sendMessage function, we've changed it since tho
    //   //alert(data.message);
    // });

    function handleKeyPress(e: KeyboardEvent) { //
      //console.log(e);// arrow keys don't work yet
      if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === " ") { //this works to recognize the key
        //console.log("send it !!!!!"); // wasd and space are sorted, we can now send that information to the server
        //console.log(typeof(e.key));
        keypress(e.key);
      }
      else {
        //console.log("don't send it");
      }
      // else if (e.key === 'd'){
      //   //console.log('its d');
      // }
    }
    socket.on("receive_key", (data: Array<any>) => {
      //console.log(data[1])
      //setLastInput(data[0].key)
      console.log(data[1])
      //console.log(userList[])
      if (data[1] === userList[0]) {
        setUser1Input(data[0].key)
      } else if (data[1] === userList[1]) {
        setUser2Input(data[0].key)
      } else if (data[1] === userList[2]) {
        setUser3Input(data[0].key)
      } else {
        setUser4Input(data[0].key)
      }
    });
    //document.addEventListener('keypress', handleKeyPress);
  }, [socket]);

  return (
    <div className="SocketHandling">
     {/* <input placeholder='Message...' onChange={(event) => {
      setMessage(event.target.value);
     }}/>
     <button onClick={sendMessage}>Send Message</button>
     <h1>Message: </h1>
     {messageReceived} */}
     <button onClick={joinPublic}>Join a public game!</button>
     <h1>inputs below:</h1>
     {lastInput}
     <ul>
      <li>{user1}: {user1Input}</li>
      <li>{user2}: {user2Input}</li>
      <li>{user3}: {user3Input}</li>
      <li>{user4}: {user4Input}</li>
     </ul>
    </div>
  );
}
// reference: https://github.com/machadop1407/socket-io-react-example/blob/main/client/src/SocketHandling.js
export default SocketHandling;
//IT DOESN'T LIKE IO.CONNECT FOR SOME REASON SO I'M GONNA COPY PASTE THE OLD APP.JS FILE FROM YESTERDAY
/*
import io from 'socket.io-client';
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3001");
function SocketHandling() { */