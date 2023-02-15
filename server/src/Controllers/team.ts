import { createTeam, updateTeam } from "../Models/team";

const teamControllers = {
  async createTeam(req: any, res: any) {
    const {
      gameId,
      teamName,
      score,
      characterId,
      currentDirectionMoving,
      nextDirection,
      powerUp,
      kartId,
    } = req.body;
    const newTeam = await createTeam(
      gameId,
      teamName,
      score,
      characterId,
      currentDirectionMoving,
      nextDirection,
      powerUp,
      kartId
    );
    res.status(200).json(newTeam);
  },

  async updateTeamController(req: any, res: any) {
    const {
      id,
      score,
      currentDirectionMoving,
      nextDirection,
      powerUp,
      kartId,
    } = req.body;
    const updatedTeam = await updateTeam(
      id,
      score,
      currentDirectionMoving,
      nextDirection,
      powerUp,
      kartId
    );
    res.status(200).json(updatedTeam);
  },
};

export default teamControllers;
