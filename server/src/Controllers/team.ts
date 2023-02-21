import { createTeam, updateTeam } from "../Models/team";

const teamControllers = {
  async createTeam(req: any, res: any) {
    const {
      color,
      score,
      position,
      velocity,
      angle,
      characterId,
      gameId,
      kartId
    } = req.body;
    const newTeam = await createTeam(
      color,
      score,
      position,
      velocity,
      angle,
      characterId,
      gameId,
      kartId
    );
    res.status(200).json(newTeam);
  },

  async updateTeamController(req: any, res: any) {
    const {
      id,
      score,
      position,
      velocity,
      angle
    } = req.body;
    const updatedTeam = await updateTeam(
      id,
      score,
      position,
      velocity,
      angle
    );
    res.status(200).json(updatedTeam);
  },
};

export default teamControllers;
