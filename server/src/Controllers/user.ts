import { PrismaClient } from "@prisma/client";
import { /*getOneUser,*/ createUser, findUserByEmail } from "../Models/user";

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
};

export default userControllers;