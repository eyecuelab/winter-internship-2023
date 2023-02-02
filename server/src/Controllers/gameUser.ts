import { createGameUser } from "../Models/gameUser";

const gameUserControllers = {
  async createGameUser(req: any, res: any) {
    const { gameId, userId, roleId } = req.body;
    const newGameUser = await createGameUser(gameId, userId, roleId);
    res.status(201).json(newGameUser);
  },
};

export default gameUserControllers;
