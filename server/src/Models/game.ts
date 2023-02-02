import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGame = async (
  timeLeft: number,
  boardArray: Prisma.JsonArray,
  pelletCount: number
) => {
  return await prisma.game.create({
    data: {
      ...{
        timeLeft: timeLeft,
        boardArray: boardArray,
        pelletCount: pelletCount,
      },
    },
  });
};

export const updateGame = async (
  id: number,
  timeLeft: number,
  pelletCount: number
) => {
  return await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      timeLeft: timeLeft,
      pelletCount: pelletCount,
    },
  });
};
