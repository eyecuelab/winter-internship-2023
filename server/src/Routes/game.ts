import gameControllers from "../Controllers/game";
import express from "express";

const router = express.Router();

router.patch("/game/:id", gameControllers.updateGameController);
router.post("/game", gameControllers.createGameController);

export default router;
