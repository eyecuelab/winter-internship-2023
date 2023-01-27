import app from './app';
//import express from 'express';
//const app = express();
import http from 'http';
import { Server, Socket } from 'socket.io';
//import cors from 'cors';

//app.use(cors());
//lines 3,6, and 8 take everything that we would have made in app.ts

import googleRoutes from './Routes/google-routes';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  }
});



io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id)

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

export default io;

server.listen(3001, () =>
  console.log('Server ready at: http://localhost:3001'),
)