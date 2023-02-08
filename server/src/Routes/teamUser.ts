import teamUserControllers from "../controllers/teamUser";
import express from "express";

const router = express.Router();

router.post("/teamUser", teamUserControllers.createTeamUser);

export default router;
