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

    io.in(`${room}`).emit("receive_client_joined", socketIds);
    // socket.emit("room_and_users", [room, socketIds]);
  });

  socket.on("send_team", (data) => {
    const { jsonTeam, jsonKart } = data;
    io.in(data.gameId).emit("receive_team_added", {jsonTeam, jsonKart});
  });

  socket.on("game_update", (data) => {
    const { gameId, tempColor, jsonKart } = data;
    socket.to(`${gameId}`).emit("receive_game_update", {tempColor, jsonKart});
  });

  socket.on("toggle_player_control", (data) => {
    socket.to(data.tempTeamMate).emit("receive_toggle_player_control", data.jsonTeam);
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
