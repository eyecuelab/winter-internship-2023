import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTeamUser = async (
  teamId: number,
  userId: number,
  verticalOrHorizontalControl: string
) => {
  return await prisma.teamUser.create({
    data: {
      ...{
        team: { connect: { id: teamId } },
        user: { connect: { id: userId } },
        verticalOrHorizontalControl: verticalOrHorizontalControl,
      },
    },
  });
};
