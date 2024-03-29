import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { getGameById } from "./Models/game";
import { PrismaClient } from "@prisma/client";
import { deactivateLastGameForUser } from "./Models/user";

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

io.on("connection", (socket) => {
  console.log("User Connected: " + socket.id);

  socket.on("user_id_update", ({ userId }) => {
    socket.data.userId = userId;
  });

  socket.on("join_game_room", async (data) => {
    const { gameId } = data;
    
    if (gameId) {
      const room = gameId.toString();
      socket.join(room);
      console.log(socket.id, "joined room: ", room);

      const gameData = JSON.stringify(await getGameById(room));
      io.to(socket.id).emit("receive_initial_game_data", gameData);

      const socketsInRoom: any = await io.sockets.adapter.rooms.get(`${room}`);
      const socketIds = Array.from(socketsInRoom);

      io.in(`${room}`).emit("receive_client_joined", { socketIds });
    }
  });

  socket.on("send_team", (data) => {
    const { jsonTeam, jsonKart, gameId } = data;
    io.in(`${gameId}`).emit("receive_team_added", { jsonTeam, jsonKart });
  });

  socket.on("game_update", (data) => {
    const { gameId, tempColor, tempScore, jsonKart } = data;
    socket
      .to(`${gameId}`)
      .emit("receive_game_update", { tempColor, jsonKart, tempScore });
  });

  socket.on("toggle_player_control", (data) => {
    socket
      .to(data.tempTeamMate)
      .emit("receive_toggle_player_control", data.jsonTeam);
  });

  socket.on("update_pellets", (data) => {
    const { gameId, i, isGameOver } = data;
    socket.to(`${gameId}`).emit("receive_pellet_update", { i, isGameOver });
  });

  socket.on("ghost_kart_toggle", (data) => {
    const { kartColor, ghostColor, spawnNum, gameId } = data;
    io.in(`${gameId}`).emit("receive_ghost_kart_toggle", {
      kartColor,
      ghostColor,
      spawnNum,
    });
  });

  socket.on("db_update", async (data) => {
    const {
      gameId,
      currentTeamId,
      currentScore,
      currentKart,
      currentPellets,
      currentIsGameOver,
    } = data;

    if (gameId) {
      await prisma.game.update({
        where: { id: parseInt(gameId) },
        data: {
          pellets: currentPellets,
          isActive: !currentIsGameOver,
        },
      });
    }
    if (currentTeamId) {
      await prisma.team.update({
        where: { id: parseInt(currentTeamId) },
        data: {
          score: currentScore,
          position: currentKart["position"],
          velocity: currentKart["velocity"],
          angle: currentKart["angle"],
        },
      });
    }
  });

  socket.on("game_over", async (data) => {
    const { gameId } = data;
    await prisma.game.update({
      where: { id: parseInt(gameId) },
      data: {
        isActive: false,
      },
    });
  });

  socket.on("leave_room", async (leaveRoomData) => {
    const { gameId, userId } = leaveRoomData;
    console.log("disconnect from canvas:", userId);
    socket.leave(`$gameId`);

    const res = await deactivateLastGameForUser(socket.data.userId);
    if(res.gameId){
      const gameId = res.gameId
      io.in(`${gameId}`).emit("disconnect_game_over", (gameId))
    }
  });

  socket.on("disconnect", async (reason) => {
    console.log("disconnect user:", socket.data.userId, "socketId:", socket.id);
    const disconnectedClientId = socket.id;
    socket.broadcast.emit("client_disconnect", { disconnectedClientId });

    const res = await deactivateLastGameForUser(socket.data.userId);
    if(res.gameId){
      const gameId = res.gameId
      io.in(`${gameId}`).emit("disconnect_game_over", (gameId))
      socket.leave(`$gameId`);
    }
  });
});

// server.listen(3001, () =>
//   console.log("Server ready at: http://localhost:3001")
// );
server.listen(8080, () =>
  console.log("Server ready at: 8080")
);

export default io;
