import { createGameUser, findManyGameUsers } from "../Models/gameUser";

const gameUserControllers = {

  async createGameUser(req: any, res: any) {
    const { gameId, userId, roleId } = req.body;
    const newGameUser = await createGameUser(gameId, userId, roleId);
    res.status(200).json(newGameUser);
  },

  async findManyGameUsers(req: any, res: any) {
    const { gameId } = req.params;
    const GameUser = await findManyGameUsers(gameId);
    res.status(200).json(GameUser);
  }
}

export default gameUserControllers;
