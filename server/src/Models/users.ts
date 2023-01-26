import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOneUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
}