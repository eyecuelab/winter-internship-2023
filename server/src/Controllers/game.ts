import { createGame, updateGame } from "../Models/game";

const gameControllers = {
  async createGameController(req: any, res: any) {
    const { timeLeft, boardArray, pelletCount } = req.body;
    const newGame = await createGame(timeLeft, boardArray, pelletCount);
    res.status(200).json(newGame);
  },

  async updateGameController(req: any, res: any) {
    const { id, timeLeft, boardArray, pelletCount } = req.params;
    const updatedGame = await updateGame(timeLeft, boardArray, pelletCount);
    res.status(200).json(updatedGame);
  },
};

export default gameControllers;
