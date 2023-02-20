// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// const roles = [{name: "Player"}, {name: "Moderator"}]

// const karts = [{name: "krazy kart 1", topSpeed: 10, acceleration: 1, handling: 4}]

// const characters = [{name: "pacman"}, {name: "ghost"}]

// async function main() {

//   for (let i = 0; i < roles.length; i++) {
//     await prisma.role.upsert({
//       where: { id: i },
// 			update: {},
//       create: {
//         name: roles[i]["name"]
//       },
//     });
//   }

//   for (let i = 0; i < karts.length; i++) {
//     await prisma.kart.upsert({
//       where: { id: i },
// 			update: {},
//       create: {
//         name: karts[i]["name"],
//         topSpeed: karts[i]["topSpeed"],
//         acceleration: karts[i]["acceleration"],
//         handling: karts[i]["handling"]
//       },
//     });
//   }

//   for (let i = 0; i < characters.length; i++) {
//     await prisma.character.upsert({
//       where: { id: i },
// 			update: {},
//       create: {
//         name: roles[i]["name"]
//       },
//     });
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
