import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGameUser = async (
  gameId: number,
  userId: number,
  roleId: number
) => {
  console.log(gameId, userId, roleId)
  return await prisma.gameUser.create({
    data: {
      ...{
        game: { connect: { id: gameId } },
        user: { connect: { id: userId } },
        role: { connect: { id: roleId } },
      },
    },
  });
};
