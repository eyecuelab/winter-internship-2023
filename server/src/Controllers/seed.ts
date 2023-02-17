// seed controller

import { create1 } from "../Models/seed";

const seedController = {
  async createSeeds(req: any, res: any) {
    const newSeed = await create1();
    if (newSeed === null) {
      res.status(400)
    } else {
      res.status(200).json(newSeed);
    }
  }
}

export default seedController;