import usersRouter from './Routes/users';
import cors from 'cors';
import express from 'express';


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'PUT'], 
	credentials: true,}));

app.use(express.json());

app.use(
	usersRouter
);

export default app;