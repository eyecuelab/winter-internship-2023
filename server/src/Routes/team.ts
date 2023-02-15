import teamControllers from "../Controllers/team";
import express from "express";

const router = express.Router();

router.post("/team", teamControllers.createTeam);
router.patch("/team/:id", teamControllers.updateTeamController);

export default router;
