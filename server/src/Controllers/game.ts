import { createGame, getLastGame, updateGame, getGameById } from "../models/game";

const gameControllers = {
  async createGameController(req: any, res: any) {
    const { timeLeft, boardArray, pelletCount } = req.body;
    const newGame = await createGame(timeLeft, boardArray, pelletCount);
    res.status(200).json(newGame);
  },

  async getGameController(req: any, res: any) {
    const { id } = req.params;
    const foundGame = await getGameById(id);
    res.json(foundGame);
  },

  async getLastGameController(res: any) {
    const foundGame = await getLastGame();
    res.json(foundGame);
  },

  async updateGameController(req: any, res: any) {
    const { id, timeLeft, pelletCount } = req.params;
    const updatedGame = await updateGame(id, timeLeft, pelletCount);
    res.status(200).json(updatedGame);
  },
};

export default gameControllers;
