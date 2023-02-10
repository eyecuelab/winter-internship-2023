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

export type teamType = {
  teamId: string;
  color: string;
  playerInControl: string;
  players: { x: string; y: string };
  kart: Kart;
  score: number;
}

export type kartType = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  angle: number;
  imgSrc: string;
}

export type myGameType = {
  userList: [];
  myTeamMate: string;
  myControl: string;
  myTeam: Team;
};

export type roomGameType = {
  karts: Map<key, Kart>;
  boundaries: Boundary[];
};

//teamFromJSONtype
