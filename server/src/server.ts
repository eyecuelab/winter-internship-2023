import app from './app';
import http from 'http';
import { Server, Socket } from 'socket.io';
import googleRoutes from './Routes/google-routes';

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
      socket.emit("receive_room_number", [roomNumber.toString(), true, socket.id]);
      roomfull = false;
      publicRoomSpace = 1;
    }
    else {
      console.log("user is joining room " + roomNumber)
      socket.join(roomNumber.toString());
      socket.emit("receive_room_number", [roomNumber.toString(), false]);
      socket.to(roomNumber.toString()).emit("mod_receive_user", socket.id)
      publicRoomSpace ++;
      if (publicRoomSpace === 4) {
        roomfull = true;
        socket.to(roomNumber.toString()).emit("room_full")
      }
    }} 
  )

  socket.on("player_update", (data) => {
    socket.to(data.roomNumber).emit("receive_player_update", data.tempPlayer);
  })

  socket.on("key_press", (data) => {
    socket.to(data.roomNumber).emit("receive_key", [data, socket.id]);
  })

  socket.on("mod_sends_user_list", (data) => {
    socket.to(data.roomNumber).emit("get_user_list", data.userList)
  })

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);

  })
})

server.listen(3001, () =>
  console.log('Server ready at: http://localhost:3001'),
)

export default io;