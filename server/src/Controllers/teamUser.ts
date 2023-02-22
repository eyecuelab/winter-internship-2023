import { createTeamUser } from "../Models/teamUser";

const teamUserControllers = {
  async createTeamUser(req: any, res: any) {
    const { teamId, userId, axisControl } = req.body;
    const newTeamUser = await createTeamUser(
      teamId,
      userId,
      axisControl
    );
    res.status(200).json(newTeamUser);
  },
};

export default teamUserControllers;
