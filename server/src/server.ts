import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://super-pacart.netlify.app",
      "https://super-pacart.fly.dev",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  },
});

interface Update {
  table: string;
  id: number;
  value: number | string;
}

//(1)try it in the sockets to see if it actually decreases performance
//(2)look for a package that does this- This is expensive as is

io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id);

  socket.on("join_game_room", async (data) => {
    const { gameId, userId} = data;
    console.log("serverData:" + data);
    console.log("typeof gameId" + typeof(gameId));
    console.log("gameId" + gameId);
    console.log(userId);
    const room = gameId.toString();
    socket.join(room);
    console.log(socket.id, "joined room: ", room);

    //fetches all socket ids in the room:
    const socketsInRoom: any = await io.sockets.adapter.rooms.get(`${room}`);
    console.log(`guests in room ${room}`, socketsInRoom);
    const socketIds = Array.from(socketsInRoom);


    io.in(`${room}`).emit("receive_client_joined", {socketIds, userId});
  });

  socket.on("send_team", (data) => {
    const { jsonTeam, jsonKart } = data;
    io.in(data.gameId).emit("receive_team_added", { jsonTeam, jsonKart });
  });

  socket.on("game_update", (data) => {
    const { gameId, teamId, tempScore, jsonKart, boolOfGameStatus, tempPellets } = data;
    const parsedKart = JSON.parse(jsonKart)

    // console.log("tempColor: "+ tempColor);
    // console.log("tempScore: "+ tempScore);
    // console.log("jsonKart: "+ jsonKart);
    // console.log("tempPellets " + tempPellets);
    // console.log(`parsedKart["velocity"] ` + parsedKart["velocity"]);

    // setInterval(async () => {

    //   await prisma.game.update({
    //     where: { id: gameId },
    //     data: { 
    //       pellets: tempPellets,
    //       isActive: boolOfGameStatus
    //     },
    //   }), await prisma.team.update({
    //     where: { id: teamId },
    //     data: { 
    //       score: tempScore,

    //       json blob type?
    //       position:  parsedKart["position"],

    //       velocity:  parsedKart["velocity"],
    //       angle: parsedKart["angle"]
    //     },
    //   })
    // }, 5000);

    socket
      .to(`${gameId}`)
      .emit("receive_game_update", { jsonKart, tempScore });

  });

  socket.on("toggle_player_control", (data) => {
    socket
      .to(data.tempTeamMate)
      .emit("receive_toggle_player_control", data.jsonTeam);
  });

  socket.on("remove_pellet", (data) => {
    const { gameId, i, boolOfGameStatus } = data;
    socket.to(gameId).emit("pellet_gone", { i, boolOfGameStatus });
  });

  socket.on("disconnect", (reason) => {
    console.log(socket.id + " disconnected");
  });
});

server.listen(3001, () =>
  console.log("Server ready at: http://localhost:3001")
);
// server.listen(8080, () =>
//   console.log("Server ready at: 8080")
// );


export default io;
