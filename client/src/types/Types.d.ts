import { Boundary, Kart, Pellet, Team } from "../components/canvas/gameClasses";

export type userType = {
  id: number;
  name: string;
  email: string;
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
  score: number;
};

export type kartType = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  imgSrc: string;
  angle: { currentAngle: number; goalAngle: number };
  isGhost: boolean;
};

export type myGameType = {
  userList: [];
  myTeamMate: string;
  myControl: string;
  myTeam: Team;
  myKart: Kart;
};

export type roomGameType = {
  karts: Map<string, Kart>;
  scores: Map<string, number>;
  isGameOver: boolean;
};

export type pelletType = {
  position: { x: number; y: number };
  isVisible: boolean;
};

export type poofType = {
  position: { x: number; y: number };
  radius: number;
  opacity: number;
}
