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