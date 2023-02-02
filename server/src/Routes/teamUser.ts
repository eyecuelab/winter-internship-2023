import teamUserControllers from "../Controllers/team";
import express from "express";

const router = express.Router();

router.post("/teamUser", teamUserControllers.createTeam);

export default router;
