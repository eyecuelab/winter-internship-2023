import userControllers from '../Controllers/user';
import express from "express";

const router = express.Router();

router.get('/user/:id', userControllers.getUserById);
router.post('/user', userControllers.createUser);

export default router; 