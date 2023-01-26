import usersControllers from '../Controllers/users';
import express from "express";

const router = express.Router();

router.get('/users/:id', usersControllers.getUserById);

export default router; 