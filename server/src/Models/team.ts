import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTeam = async (
  gameId: number,
  teamName: string,
  score: number,
  characterId: number,
  currentDirectionMoving: string,
  nextDirection: string,
  powerUp: boolean,
  kartId: number
) => {
  return await prisma.team.create({
    data: {
      ...{
        game: { connect: { id: gameId } },
        teamName: teamName,
        score: score,
        character: { connect: { id: characterId } },
        currentDirectionMoving: currentDirectionMoving,
        nextDirection: nextDirection,
        powerUp: powerUp,
        kart: { connect: { id: kartId } },
      },
    },
  });
};

export const updateTeam = async (
  id: number,
  score: number,
  currentDirectionMoving: string,
  nextDirection: string,
  powerUp: boolean,
  kartId: number
) => {
  return await prisma.team.update({
    where: { id: Number(id) },
    data: {
      score: score,
      currentDirectionMoving: currentDirectionMoving,
      nextDirection: nextDirection,
      powerUp: powerUp,
      kart: { connect: { id: kartId } },
    },
  });
};
