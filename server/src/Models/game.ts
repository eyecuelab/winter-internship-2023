import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGame = async (
  map: Prisma.JsonObject,
  boundaries: Prisma.JsonArray,
  pellets: Prisma.JsonArray,
  spawnPoints: Prisma.JsonArray
) => {
  return await prisma.game.create({
    data: {
      ...{
        map: map,
        boundaries: boundaries,
        pellets: pellets,
        spawnPoints: spawnPoints,
        isActive: true
      },
    },
  });
};

export const getGameById = async (id: number) => {
  return await prisma.game.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const getLastGame = async () => {
  return await prisma.game.findFirst({
    orderBy: {
      id: "desc",
    },
  });
};

export const updateGame = async (
  id: number,
  pellets: number,
  isActive: boolean
) => {
  return await prisma.game.update({
    where: {
      id: id,
    },

    data: {
      pellets: pellets,
      isActive: isActive,
    },
  });
};
