import { createGame, getLastGame, updateGame, getGameById } from "../Models/game";

const gameControllers = {
  async createGameController(req: any, res: any) {
    const { map, boundaries, pellets, spawnPoints } = req.body;
    const newGame = await createGame(map, boundaries, pellets, spawnPoints);
    res.status(200).json(newGame);
  },

  async getGameController(req: any, res: any) {
    const { id } = req.params;
    const foundGame = await getGameById(id);
    res.json(foundGame);
  },

  async getLastGameController(req: any, res: any) {
    const foundGame = await getLastGame();
    res.json(foundGame);
  },

  async updateGameController(req: any, res: any) {
    const { id, pellets, isActive } = req.params;
    const updatedGame = await updateGame(id, pellets, isActive);
    res.status(200).json(updatedGame);
  },
};

export default gameControllers;
