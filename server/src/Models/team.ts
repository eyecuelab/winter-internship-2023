import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTeam = async (
  color: string,
  score: number,
  position: Prisma.JsonObject,
  velocity: Prisma.JsonObject,
  angle: Prisma.JsonObject,
  characterId: number,
  gameId: number,
  kartId: number
) => {
  return await prisma.team.create({
    data: {
      ...{
        color: color,
        score: score,
        position: position,
        velocity: velocity,
        angle: angle,
        character: { connect: { id: characterId } },
        game: { connect: { id: gameId } },
        kart: { connect: { id: kartId } },
      },
    },
  });
};

export const updateTeam = async (
  id: number,
  score: number,
  position: Prisma.JsonObject,
  velocity: Prisma.JsonObject,
  angle: number
) => {
  return await prisma.team.update({
    where: { id: Number(id) },
    data: {
      score: score,
      position: position,
      velocity: velocity,
      angle: angle,
    },
  });
};
