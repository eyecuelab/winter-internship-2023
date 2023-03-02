import userControllers from "../Controllers/user";
import express from "express";

const router = express.Router();

// router.get('/user/:id', userControllers.getUserById);
router.get("/user/:email", userControllers.getUserByEmail);
router.post("/user", userControllers.createUser);
router.put("/user/:userId/deactivate-last-game", userControllers.deactivateLastGame)

export default router;
