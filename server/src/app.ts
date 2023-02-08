import userRouter from './routes/user';
import gameRouter from './routes/game';
import teamRouter from './routes/team';
import teamUserRouter from './routes/teamUser';
import gameUserRouter from './routes/gameUser';
import cors from 'cors';
import express from 'express';
// import githubRoutes from './Routes/github-routes';
import googleRoutes from './routes/googleRoutes';

const app = express();

app.use(cors({
  origin: '*', 
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

// app.use('/api/github', githubRoutes);
app.use('/api/google', googleRoutes);

export default app;