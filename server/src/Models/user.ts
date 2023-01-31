import { PrismaClient } from '@prisma/client';
import { stringify } from 'querystring';

const prisma = new PrismaClient();

export const getOneUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
}

export const createUser = async (email: string, name: string) => {
  return await prisma.user.create({
    data: {
                  ...{
                    email: email,
                    name: name
                  }
    }
  });
}