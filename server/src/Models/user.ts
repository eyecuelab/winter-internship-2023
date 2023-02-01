import { PrismaClient } from '@prisma/client';

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
      email: email
  }
});
  return users[0];
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