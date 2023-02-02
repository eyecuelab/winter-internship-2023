import { createTeamUser } from "../Models/teamUser";

const teamUserControllers = {
  async createTeamUser(req: any, res: any) {
    const { teamId, userId, verticalOrHorizontalControl } = req.body;
    const newUser = await createTeamUser(
      teamId,
      userId,
      verticalOrHorizontalControl
    );
    res.status(201).json(newUser);
  },
};

export default teamUserControllers;
