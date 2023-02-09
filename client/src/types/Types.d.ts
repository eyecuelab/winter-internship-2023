export type userType = {
	id: number
	name: string
  email: string
  games: GameUser[]
  teams: TeamUser[]
}

export type gameType = {
	id: number
	timeLeft: number
  boardArray: Prisma.JsonArray
  pelletCount: number
}

export type kartType = {
	position: { x: number; y: number }
  velocity: { x: number; y: number }
  radius: number
  imgSrc: string
}

