import userControllers from "../Controllers/user";
import express from "express";

const router = express.Router();

// router.get('/user/:id', userControllers.getUserById);
router.get("/user/:email", userControllers.getUserByEmail);
router.post("/user", userControllers.createUser);

export default router;
