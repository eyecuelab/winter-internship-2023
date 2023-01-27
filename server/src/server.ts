import app from './app';
//import express from 'express';
//const app = express();
import http from 'http';
import { Server, Socket } from 'socket.io';
import googleRoutes from './Routes/google-routes';
//import cors from 'cors';

//app.use(cors());
//lines 3,6, and 8 take everything that we would have made in app.ts


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  }
});


let roomfull: boolean = true;
let publicRoomSpace: number = 0;
let roomNumber: number = 0;


io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id)

  socket.on("join_public", () => {
    console.log(socket.id + "wants to join a game");
    if (roomfull) {
      console.log("we have to create a room")
      roomNumber ++;
      console.log("room number: " + roomNumber);
      socket.join(roomNumber.toString());
      socket.emit("receive_room_number", roomNumber.toString());
      roomfull = false;
      publicRoomSpace = 1;
      //if the room is full, we create a new room and send them there, if not we send the user to an existing room
    }
    else {
      console.log("user is joining room " + roomNumber)
      socket.join(roomNumber.toString());
      socket.emit("receive_room_number", roomNumber.toString());
      publicRoomSpace ++;
      if (publicRoomSpace === 4) {
        roomfull = true;
      }
    }
    // the join public function: uses roomfull, publicRoomSpace, and roomNumber. if the most recent room is full (or there was never a room (server just started)), then it will increase the roomNumber and create a room with that code, everyone else will go to that created room

  })
 // https://socket.io/docs/v3/rooms/

  // so room is basically a string the user can declare, so honestly we can probably just make something that auto increments the rooms for us

  //socket.join(data) is how we send them to a specific room
  //socket.to(data.room).emit("function_name", data) to send data to that room from the server

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
    console.log(data);
  })
})

// io.on("connection", (socket) => {
//   console.log("User Connected: " + socket.id)


  /*
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
    console.log(data);
  
  "send_message" = the title of the sent out data
  socket.broadcast.emit("receive_message", data); = sends the data from the argument in send_message out as the name receive_message, so that the client side can run receive_message
  })
  */
//})



server.listen(3001, () =>
  console.log('Server ready at: http://localhost:3001'),
)

export default io;