import gameUserControllers from "../Controllers/gameUser";
import express from "express";

const router = express.Router();

router.post("/gameUser", gameUserControllers.createGameUser);

export default router;
