import usersRouter from './Routes/users';
import cors from 'cors';
import express from 'express';
// import githubRoutes from './Routes/github-routes';
import googleRoutes from './Routes/google-routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'PUT'], 
	credentials: true,}));

app.use(express.json());

app.use(
	usersRouter
);

// app.use('/api/github', githubRoutes);
app.use('/api/google', googleRoutes);

export default app;