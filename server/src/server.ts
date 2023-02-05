import app from "./app";
import http from "http";
import { Server, Socket } from "socket.io";
import googleRoutes from "./routes/googleRoutes";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

let roomfull: boolean = true;
let publicRoomSpace: number = 0;
let roomNumber: number = 0;

io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id);

  //room:
  socket.on("start_game_room", async (data) => {
    console.log("new room started:", data);
    console.log(io.sockets)
    socket.join(data.toString());
    socket.emit("receive_room_number", [data.toString(), true, socket.id]);
    const socketsInRoom = await io;
    console.log(socketsInRoom);
  });

  socket.on("join_game_room", async (data) => {
    const room = data.toString();
    socket.join(room);
    console.log(socket.id, "joined room: ", room)

    const socketsInRoom = await io.sockets.adapter.rooms.get(`${room}`)
    console.log(socketsInRoom);

    socket.emit("receive_room_number", [room, false]);
    socket.to(room).emit("mod_receive_user", socket.id);
  });

  socket.on("player_update", (data) => {
    socket.to(data.roomNumber).emit("receive_player_update", data.tempPlayer);
  });

  socket.on("key_press", (data) => {
    socket.to(data.roomNumber).emit("receive_key", [data, socket.id]);
  });

  socket.on("mod_sends_user_list", (data) => {
    socket.to(data.roomNumber).emit("get_user_list", data.userList);
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("disconnect", (reason) => {
    console.log(socket.id + " disconnected");
  });
});

server.listen(3001, () =>
  console.log("Server ready at: http://localhost:3001")
);

export default io;
