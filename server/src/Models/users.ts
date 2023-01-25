import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export const getOneGame = async (id: number) => {
//   return await prisma.games.findUnique({
// 		where: {
// 			id: Number(id)
// 		},
// 		include: {
// 			Topic: true,
// 			Rounds: true,
// 		}
// 	});
// }