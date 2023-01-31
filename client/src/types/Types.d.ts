export type User = {
	id: number
	name: string
  email: string
  games: GameUser[]
  teams: TeamUser[]
}