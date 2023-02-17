import userRouter from "./Routes/user";
import gameRouter from "./Routes/game";
import teamRouter from "./Routes/team";
import teamUserRouter from "./Routes/teamUser";
import gameUserRouter from "./Routes/gameUser";
import roleRouter from "./Routes/role";
import cors from "cors";
import express from "express";
// import githubRoutes from './Routes/github-routes';
import googleRoutes from "./Routes/googleRoutes";

const app = express();

app.use(
  cors({
    origin: [
      "https://super-pacart.netlify.app",
      "https://super-pacart.fly.dev",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    // Access-Control-Allow-Origin: *,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Origin", "https://super-pacart.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

app.use(
  roleRouter,
  userRouter,
  gameRouter,
  teamRouter,
  gameUserRouter,
  teamUserRouter
);

app.use("/api/google", googleRoutes);

export default app;
