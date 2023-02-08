import gameUserControllers from "../controllers/gameUser";
import express from "express";

const router = express.Router();

router.post("/gameUser", gameUserControllers.createGameUser);
router.get("/game/:gameId/gameUser", gameUserControllers.findManyGameUsers);

export default router;
