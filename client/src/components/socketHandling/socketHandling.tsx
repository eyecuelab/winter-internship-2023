//import Login from "./components/Login";
//import io from 'socket.io-client';
import * as io from 'socket.io-client';
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3001");
function SocketHandling() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  let roomNumber = "";

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
    console.log("user is trying to join a public game");
    socket.emit("join_public")
  }

  useEffect(() => {
    socket.on("receive_room_number", (data) => {
      console.log("previous room number: " + roomNumber)
      roomNumber = data;
      console.log(roomNumber);
      // so the server puts the client in a room, sends the room number to the client
      // we need the client to be able to store that information
    })

    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);

      //this below would do a window alert with literally just "Hello" from the sendMessage function, we've changed it since tho
      //alert(data.message);
    });
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