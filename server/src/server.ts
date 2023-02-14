import app from "./app";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://super-pacart.netlify.app",
    "https://super-pacart.fly.dev",],
    methods: ["GET", "POST", "DELETE", "PUT"]
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
  });

  socket.on("send_team", (data) => {
    const { jsonTeam, jsonKart } = data;
    io.in(data.gameId).emit("receive_team_added", {jsonTeam, jsonKart});
  });

  socket.on("game_update", (data) => {
    const { gameId, tempColor, tempScore, jsonKart } = data;
    socket.to(`${gameId}`).emit("receive_game_update", {tempColor, jsonKart, tempScore});
  });

  socket.on("toggle_player_control", (data) => {
    socket.to(data.tempTeamMate).emit("receive_toggle_player_control", data.jsonTeam);
  })

  socket.on("remove_pellet", (data) => {
    const {gameId, i, boolOfGameStatus} = data;
    socket.to(gameId).emit("pellet_gone", {i, boolOfGameStatus})
  })

  socket.on("disconnect", (reason) => {
    console.log(socket.id + " disconnected");
  });
});

server.listen(8080, () =>
  console.log("Server ready at: http://localhost:3000")
);


export default io;
