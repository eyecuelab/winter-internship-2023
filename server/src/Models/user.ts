import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const getOneUser = async (id: number) => {
//   return await prisma.user.findUnique({
//     where: {
//       id: Number(id)
//     }
//   });
// }

export const findUserByEmail = async (email: string) => {
  const users = await prisma.user.findMany({
    where: {
      email: email,
    },
  });
  return users[0];
};

export const createUser = async (email: string, name: string) => {
  return await prisma.user.create({
    data: {
      ...{
        email: email,
        name: name,
      },
    },
  });
};

export const deactivateLastGameForUser = async (
  userId: number
) => {
  try {
    const lastGame = await prisma.game.findFirst({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!lastGame) {
      return { error: "User has no games" };
    }
    if (!lastGame.isActive) {
      return { message: "Last game was already inactive" };
    }

    const updatedGame = await prisma.game.update({
      where: {
        id: lastGame.id,
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: `Game ${updatedGame.id} deactivated`,
      gameId: updatedGame.id,
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
};
