import { createTeamUser } from "../Models/teamUser";

const teamUserControllers = {
  async createTeamUser(req: any, res: any) {
    const { teamId, userId, verticalOrHorizontalControl } = req.body;
    const newTeamUser = await createTeamUser(
      teamId,
      userId,
      verticalOrHorizontalControl
    );
    res.status(200).json(newTeamUser);
  },
};

export default teamUserControllers;
