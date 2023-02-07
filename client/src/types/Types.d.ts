export type userType = {
  id: number;
  name: string;
  email: string;
  games: GameUser[];
  teams: TeamUser[];
};

export type gameType = {
  id: number;
  timeLeft: number;
  boardArray: Prisma.JsonArray;
  pelletCount: number;
};

export type myGameType = {
  userList: [];
  myTeamMate: string;
  myControl: string;
  myTeam: Team;
  myKart: Kart;
};

export type roomGameType = {
  karts: Map<key, string>;
  boundaries: Boundary[];
};
