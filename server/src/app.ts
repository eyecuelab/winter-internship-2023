import userRouter from './Routes/user';
import gameRouter from './Routes/game';
import teamRouter from './Routes/team';
import teamUserRouter from './Routes/teamUser';
import gameUserRouter from './Routes/gameUser';
import cors from 'cors';
import express from 'express';
// import githubRoutes from './Routes/github-routes';
import googleRoutes from './Routes/googleRoutes';

const app = express();

app.use(cors({
  origin: ["https://super-pacart.netlify.app",
  "https://superpacart.fly.dev",],
  methods: ['GET', 'POST', 'DELETE', 'PUT'], 
	credentials: true,}));

app.use(express.json());

app.use(
	userRouter,
  gameRouter,
  teamRouter,
  gameUserRouter,
  teamUserRouter
);

app.use('/api/google', googleRoutes);

export default app;