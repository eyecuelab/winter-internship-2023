import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRole = async (id: number) => {
  return await prisma.role.findUnique({
    where: {
      id: Number(id)
    }
  });
}


export const createRole = async (name: string) => {
  return await prisma.role.create({
    data: {
      ...{
        name: name,
      },
    },
  });
};