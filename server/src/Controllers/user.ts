import { PrismaClient } from "@prisma/client";
import { createUser, deactivateLastGameForUser, findUserByEmail } from "../Models/user";

const prisma = new PrismaClient();

const userControllers = {
  async getUserByEmail(req: any, res: any) {
    const { email, name } = req.params;

    const user = await findUserByEmail(email);
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      res.status(200).json(newUser);
    } else {
      res.status(200).json(user);
    }
  },

  async createUser(req: any, res: any) {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return newUser;
  },

  async deactivateLastGame(req: any, res: any) {
    const { userId } = req.params;
  
    const result = await deactivateLastGameForUser(parseInt(userId));
  
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
  
    return res.json(result);
  }
};

export default userControllers;
