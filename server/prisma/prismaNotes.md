//PATTY GUESSING:

model Role {
  id       Int    @id @default(autoincrement())
  name     String
}

model User {
  id       Int    @id @default(autoincrement())
  name    String
  email String
  // auth   String
  games  GameUsers[]
}

model GameUsers { 
  id       Int    @id @default(autoincrement())
  game     Game  @relation(fields: [gameId], references: [id])
  gameId    Int
  user   User  @relation(fields: [userId], references: [id])
  userId    Int
  roleId    Int
}

model Game {
  id       Int    @id @default(autoincrement())
  timeLeft Int
  boardArray Json[]
  pelletCount Int
  players GameUsers[]
}

//MAFIA EXMAPLE:
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Game {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  players   Player[]
  rounds    Round[]
  endedAt   DateTime?
  gameCode  String    @unique
  name      String
  size      Int
}

model Role {
  id              Int      @id @default(autoincrement())
  name            String
  type            String
  nightTimePrompt String
  roleDesc        String
  players         Player[]
}

model Player {
  id          Int     @id @default(autoincrement())
  isHost      Boolean @default(false)
  name        String
  role        Role?   @relation(fields: [roleId], references: [id])
  roleId      Int?
  game        Game    @relation(fields: [gameId], references: [id])
  gameId      Int
  roundDied   Round?  @relation(fields: [roundDiedId], references: [id])
  roundDiedId Int?
  status      String  @default("alive")
	traits			PlayerTrait[]
	ghosts			GhostTarget[] @relation("Ghost")
	targets			GhostTarget[] @relation("Target")
  avatar      String
  isReady     Boolean @default(false)
  socketId    String?
  isDisconnected Boolean @default(false)
}

model GhostTarget { //
	id          Int     @id @default(autoincrement())
	ghost				Player  @relation("Ghost", fields: [ghostId], references: [id])
	ghostId			Int
	target			Player  @relation("Target", fields: [targetId], references: [id])
	targetId		Int
	round				Round  @relation(fields: [roundId], references: [id])
	roundId			Int
}

model Round {
  id           Int       @id @default(autoincrement())
  game         Game      @relation(fields: [gameId], references: [id])
  gameId       Int
  roundNumber  Int
  currentPhase String    @default("day")
  createdAt    DateTime  @default(now())
  died         Player[]
	ghostImages	 Int[]
	ghostTarget	 GhostTarget[]
  endedAt      DateTime?
}

model Vote {
  id          Int    @id @default(autoincrement())
  gameId      Int
  roundNumber Int
  voterId     Int
  candidateId Int
  phase       String
	@@unique([gameId, roundNumber, voterId, phase])
}

model Session {
  id        String   @id
  sid       String   @unique
  data      String
  expiresAt DateTime
}

model Trait {
	id 			Int							 @id @default(autoincrement())
	name 		String
	players PlayerTrait[]
}

model PlayerTrait { // explicit many to many with player & trait
	id       Int 		  @id @default(autoincrement())
	trait    Trait  	@relation(fields: [traitId], references: [id])
	traitId  Int
	player 	 Player   @relation(fields: [playerId], references: [id])
	playerId Int
}