import teamUserControllers from "../Controllers/teamUser";
import express from "express";

const router = express.Router();

router.post("/teamUser", teamUserControllers.createTeamUser);

export default router;
