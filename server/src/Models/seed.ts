// seed model
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create1 = async () => {
  const roles = [{name: "Player"}, {name: "Moderator"}]
  const karts = [{name: "krazy kart 1", topSpeed: 10, acceleration: 1, handling: 4}]
  const characters = [{name: "pacman"}, {name: "ghost"}]

  return await prisma.role.create({
    data: {
      name: roles[0].name
  }
}), prisma.role.create({
  data: {
    name: roles[1].name
  }
}), prisma.kart.create({
  data: {
    name: karts[0].name,
    topSpeed: karts[0].topSpeed,
    acceleration: karts[0].acceleration,
    handling: karts[0].handling
  }
}), prisma.character.create({
  data: {
    name: characters[0].name
  }
}), prisma.character.create({
  data: {
    name: characters[1].name
  }
})
}
