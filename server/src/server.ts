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

  socket.on("join_game_room", async (data) => {
    const room = data.toString();
    socket.join(room);
    console.log(socket.id, "joined room: ", room);

    //fetches all socket ids in the room:
    const socketsInRoom: any = await io.sockets.adapter.rooms.get(`${room}`);
    console.log(`guests in room ${room}`, socketsInRoom);
    const socketIds = Array.from(socketsInRoom);

    io.in(`${room}`).emit("client_joined", socketIds);
    // socket.emit("room_and_users", [room, socketIds]);
  });

  socket.on("send_team", (data) => {
    socket.to(data.x).emit("receive_my_team", data);
  });

  socket.on("player_update", (data) => {
    socket.to(`${data.gameId}`).emit("receive_player_update", data.tempPlayer);
  });

  socket.on("toggle_player_control", (data) => {
    socket.to(data.myTeammate).emit("receive_toggle_player_control", data.tempTeam);
  })

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
