import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import GamePageWrapper from "./GamePageWrapper";
import { roomGameType, userType, myGameType } from "../types/Types";
import backgroundMusic from "../assets/backgroundMusic.wav";
import {
  Kart,
  Team
} from "./../components/canvas/gameClasses";

interface Props {
  userData: userType | undefined;
}

const GamePage = (props: Props) => {
  const { userData } = props;
  const { gameId } = useParams();

  const roomGameRef = useRef<roomGameType>({
    karts: new Map(),
    scores: new Map(),
    isGameOver: false,
  });

  const myGameRef = useRef<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(), // deprecated
  });


  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [gameMusic, setGameMusic] = useState(new Audio(backgroundMusic));

  useEffect(() => {
    gameMusic.volume = 0.1;
    gameMusic.loop = true;
    if (isMusicPlaying) {
      gameMusic.play();
    } else {
      gameMusic.pause();
      gameMusic.currentTime = 0;
    }
  }, [gameMusic, isMusicPlaying]);

  const handlePauseClick = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className={`app-container`}>
      <GamePageWrapper handlePauseClick={handlePauseClick} roomGameRef={roomGameRef}/>
      <div>
        <Canvas gameId={gameId} userData={userData} roomGameRef={roomGameRef} myGameRef={myGameRef} />
      </div>
    </div>
  );
};

export default GamePage;

GamePage.propTypes = {};
