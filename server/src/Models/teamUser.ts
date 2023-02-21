import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTeamUser = async (
  teamId: number,
  userId: number,
  axisControl: string
) => {
  return await prisma.teamUser.create({
    data: {
      ...{
        team: { connect: { id: teamId } },
        user: { connect: { id: userId } },
        axisControl: axisControl,
      },
    },
  });
};
